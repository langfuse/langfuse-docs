# /// script
# requires-python = ">=3.12"
# dependencies = [
#   "langfuse>=4.8.1,<5",
#   "opentelemetry-sdk>=1.25.0",
#   "opentelemetry-exporter-otlp-proto-http>=1.25.0",
#   "nbformat",
# ]
# ///
"""Execute cookbook cells through real SDK clients with HTTP and OTLP fixtures.

Run with the latest supported SDK:
    uv run scripts/test_data_migration.py

Run with the minimum supported SDK:
    uv run --with langfuse==4.8.1 scripts/test_data_migration.py

No live project credentials or network access are used by the tests.
"""

# Execute the trusted, checked-in notebook so tests exercise its actual code.
# ruff: noqa: S102

import base64
import contextlib
import gzip
import io
import json
import os
from importlib.metadata import version
from pathlib import Path
from unittest.mock import patch
from urllib.parse import unquote

import httpx
import nbformat
import requests
from opentelemetry.proto.collector.trace.v1.trace_service_pb2 import (
    ExportTraceServiceRequest,
)

NOTEBOOK = Path(__file__).resolve().parents[1] / "cookbook/example_data_migration.ipynb"
NOW = "2026-10-01T00:00:00Z"
TRACE = "trace-source"
ROOT = "root-source"
CHILD = "child-source"
LONG_METADATA = "長いメタデータ" * 60


def paged(data, page=1, total_pages=1):
    return {
        "data": data,
        "meta": {
            "page": page,
            "limit": 100,
            "totalPages": total_pages,
            "totalItems": len(data),
        },
    }


def score_config(id, name, kind="NUMERIC", **extra):
    return dict(
        id=id,
        name=name,
        dataType=kind,
        isArchived=False,
        projectId="source",
        createdAt=NOW,
        updatedAt=NOW,
        **extra,
    )


CONFIGS = [
    score_config("cfg-source", "quality", minValue=0, maxValue=1),
    score_config("bool-source", "valid", "BOOLEAN"),
    score_config(
        "cat-source", "label", "CATEGORICAL", categories=[{"label": "good", "value": 1}]
    ),
]
MODEL = {
    "id": "model-source",
    "modelName": "custom-model",
    "matchPattern": "^custom-model$",
    "unit": "TOKENS",
    "tokenizerConfig": None,
    "isLangfuseManaged": False,
    "createdAt": NOW,
    "prices": {},
    "pricingTiers": [
        {
            "id": "source-tier",
            "name": "default",
            "isDefault": True,
            "priority": 0,
            "conditions": [],
            "prices": {"input": 0.001},
        }
    ],
}
PROMPTS = [
    {
        "type": "text",
        "name": "folder/text",
        "version": 1,
        "prompt": "Hello {{name}}",
        "labels": ["production"],
        "tags": ["migrate"],
        "config": {},
    },
    {
        "type": "chat",
        "name": "folder/chat",
        "version": 1,
        "prompt": [{"role": "user", "content": "Hello {{name}}"}],
        "labels": [],
        "tags": [],
        "config": {},
    },
]
DATASET = {
    "id": "dataset-source",
    "name": "folder/dataset",
    "description": "Test",
    "metadata": {"test": True},
    "inputSchema": {"type": "object"},
    "expectedOutputSchema": {"type": "string"},
    "projectId": "source",
    "createdAt": NOW,
    "updatedAt": NOW,
}
ITEM = {
    "id": "item-source",
    "datasetId": DATASET["id"],
    "datasetName": DATASET["name"],
    "input": {"name": "A"},
    "expectedOutput": "answer",
    "mediaReferences": [],
    "metadata": {"test": True},
    "sourceTraceId": TRACE,
    "sourceObservationId": CHILD,
    "status": "ACTIVE",
    "createdAt": NOW,
    "updatedAt": NOW,
}


def observation(id, parent, kind, **extra):
    return dict(
        id=id,
        traceId=TRACE,
        projectId="source",
        parentObservationId=parent,
        type=kind,
        name=kind.lower(),
        startTime=NOW,
        endTime="2026-10-01T00:00:01Z",
        level="DEFAULT",
        statusMessage=None,
        version=None,
        environment="test",
        public=False,
        userId="test-user",
        sessionId="test-session",
        isRootObservation=parent is None,
        traceName="Trace name",
        tags=["migration"],
        release="test",
        input='{"name":"A"}',
        output='"answer"',
        metadata={"long": LONG_METADATA},
        **extra,
    )


OBSERVATIONS = [
    observation(
        CHILD,
        ROOT,
        "GENERATION",
        model="custom-model",
        modelParameters={"temperature": 0},
        usageDetails={"input": 4, "output": 2},
        costDetails={"input": 0.004},
        promptName="folder/text",
        promptVersion=1,
    ),
    observation(ROOT, None, "AGENT"),
    observation("embedding-source", ROOT, "EMBEDDING", model="custom-model"),
]


def score(id, kind, value, subject):
    return {
        "id": id,
        "projectId": "source",
        "name": "quality",
        "source": "API",
        "timestamp": NOW,
        "createdAt": NOW,
        "updatedAt": NOW,
        "environment": "test",
        "dataType": kind,
        "value": value,
        "subject": subject,
        "configId": "cfg-source",
        "metadata": {},
        "comment": "test",
    }


SCORES = [
    score(
        "score-number",
        "NUMERIC",
        0.8,
        {"kind": "observation", "id": CHILD, "traceId": TRACE},
    ),
    score("score-bool", "BOOLEAN", False, {"kind": "trace", "id": TRACE}),
    score(
        "score-category",
        "CATEGORICAL",
        "good",
        {"kind": "session", "id": "test-session"},
    ),
    score("score-text", "TEXT", "text", {"kind": "trace", "id": TRACE}),
    score(
        "score-correction", "CORRECTION", "replacement", {"kind": "trace", "id": TRACE}
    ),
    score(
        "score-experiment", "NUMERIC", 1, {"kind": "experiment", "id": "old-experiment"}
    ),
]
EVALUATORS = [
    {
        "id": "eval-llm",
        "name": "same name",
        "description": "test",
        "type": "llm_as_judge",
        "prompt": [{"role": "user", "content": "Judge {{output}}"}],
        "outputDefinition": {"dataType": "BOOLEAN"},
        "variableMapping": [{"variable": "output", "source": "output"}],
        "modelConfig": {"provider": "provider", "model": "model"},
        "version": 4,
        "evaluationRuleAssignments": [],
    },
    {
        "id": "eval-code",
        "name": "same name",
        "description": None,
        "type": "code",
        "sourceCode": "def evaluate(x): return True",
        "sourceCodeLanguage": "PYTHON",
    },
    {
        "id": "eval-default",
        "name": "default",
        "description": None,
        "type": "llm_as_judge",
        "prompt": [{"role": "user", "content": "Judge {{output}}"}],
        "outputDefinition": {"dataType": "NUMERIC", "minValue": 0, "maxValue": 1},
        "variableMapping": None,
        "modelConfig": None,
    },
]


class Fixture:
    def __init__(self):
        self.writes = []
        self.spans = []
        self.reads = []
        self.prompt_version = 10
        self.errors = []
        self.dataset_exists = False
        self.eval_failure = False
        self.eval_rate_limited = False

    def http(self, request):
        try:
            return self.handle(request)
        except Exception as exc:
            self.errors.append(exc)
            raise

    def handle(self, req):
        side = req.url.host.split(".")[0]
        assert side in ("source", "destination")
        auth = base64.b64encode(
            f"pk-lf-{side}-validation:fake-secret".encode()
        ).decode()
        assert req.headers["authorization"] == "Basic " + auth
        path = unquote(req.url.path)
        q = req.url.params
        method = req.method
        body = json.loads(req.content) if req.content else None
        if method == "GET":
            self.reads.append((side, path, dict(q)))
        else:
            assert side == "destination", "Source data must never be mutated"
            self.writes.append((path, body))

        def ok(value, status=200):
            return httpx.Response(status, json=value)

        if path == "/api/public/projects":
            return ok(
                {
                    "data": [
                        {
                            "id": side,
                            "name": side,
                            "metadata": {},
                            "organization": {"id": "org", "name": "org"},
                        }
                    ]
                }
            )
        if path == "/api/public/score-configs":
            page = int(q.get("page", "1"))
            if method == "GET":
                if side == "destination":
                    return ok(
                        paged(
                            [score_config("cfg-dest", "quality")] if page == 2 else [],
                            page,
                            2,
                        )
                    )
                return ok(paged(CONFIGS[:2] if page == 1 else CONFIGS[2:], page, 2))
            assert body["dataType"] != "BOOLEAN" or "categories" not in body
            return ok(
                score_config(
                    "new-" + body["name"],
                    body["name"],
                    body["dataType"],
                    **{k: v for k, v in body.items() if k not in ["name", "dataType"]},
                )
            )
        if path == "/api/public/models":
            if method == "GET":
                return ok(
                    paged([MODEL, dict(MODEL, id="managed", isLangfuseManaged=True)])
                )
            assert "inputPrice" not in body
            assert all("id" not in t for t in body["pricingTiers"])
            return ok(dict(MODEL, id="model-dest"))
        if path == "/api/public/v2/prompts" and method == "GET":
            return ok(
                paged(
                    [
                        {
                            "name": p["name"],
                            "type": p["type"],
                            "versions": [1],
                            "labels": p["labels"],
                            "tags": p["tags"],
                            "lastUpdatedAt": NOW,
                            "lastConfig": {},
                        }
                        for p in PROMPTS
                    ]
                )
            )
        if path.startswith("/api/public/v2/prompts/") and method == "GET":
            assert "%2F" in str(req.url), "Folder prompt path must be encoded"
            return ok(
                next(
                    p
                    for p in PROMPTS
                    if p["name"] == path.removeprefix("/api/public/v2/prompts/")
                )
            )
        if path == "/api/public/v2/prompts" and method == "POST":
            self.prompt_version += 1
            return ok(dict(body, version=self.prompt_version))
        if path == "/api/public/v2/evaluators":
            if method == "GET":
                if self.eval_rate_limited:
                    self.eval_rate_limited = False
                    return ok({"message": "rate limited"}, 429)
                return ok(
                    {
                        "data": EVALUATORS[2:] if q.get("cursor") else EVALUATORS[:2],
                        "meta": {} if q.get("cursor") else {"cursor": "eval-page-2"},
                    }
                )
            if self.eval_failure:
                raise httpx.ReadTimeout("ambiguous create timeout", request=req)
            fields = {"name", "description", "type"} | (
                {"prompt", "outputDefinition", "variableMapping", "modelConfig"}
                if body["type"] == "llm_as_judge"
                else {"sourceCode", "sourceCodeLanguage"}
            )
            assert set(body) == fields
            return ok(
                dict(body, id="new-eval-" + str(len(self.writes)), status="active"), 201
            )
        if path == "/api/public/v2/observations":
            if "traceId" not in q:
                assert json.loads(q["filter"])[0]["column"] == "isRootObservation"
                # Empty cursor pages and multiple app roots must not skip/duplicate traces.
                if not q.get("cursor"):
                    return ok({"data": [], "meta": {"cursor": "root-page-2"}})
                return ok(
                    {
                        "data": [
                            OBSERVATIONS[1],
                            dict(OBSERVATIONS[0], isRootObservation=True),
                        ],
                        "meta": {},
                    }
                )
            if not q.get("cursor"):
                return ok({"data": [], "meta": {"cursor": "obs-page-2"}})
            observations = OBSERVATIONS
            if q.get("expandMetadata") != "long":
                observations = [
                    dict(o, metadata={"long": LONG_METADATA[:200]})
                    for o in observations
                ]
            assert "trace_context" in q["fields"]
            return ok({"data": observations, "meta": {}})
        if path == "/api/public/v3/scores":
            if not q.get("cursor"):
                return ok(
                    {"data": [], "meta": {"cursor": "scores-page-2", "limit": 100}}
                )
            return ok({"data": SCORES, "meta": {"limit": 100}})
        if path == "/api/public/scores" and method == "POST":
            assert body["configId"] == "cfg-dest"
            return ok({"id": body["id"]})
        if path == "/api/public/v2/datasets":
            if method == "GET":
                return ok(paged([DATASET]))
            assert body["inputSchema"] == DATASET["inputSchema"]
            assert body["expectedOutputSchema"] == DATASET["expectedOutputSchema"]
            self.dataset_exists = True
            return ok(dict(DATASET, id="dataset-dest"))
        if path.startswith("/api/public/v2/datasets/"):
            assert "%2F" in str(req.url)
            return (
                ok(dict(DATASET, id="dataset-dest"))
                if self.dataset_exists
                else ok({"message": "not found"}, 404)
            )
        if path == "/api/public/dataset-items":
            if method == "GET":
                return ok(paged([ITEM]))
            return ok(dict(ITEM, **body))
        raise AssertionError(f"Unexpected request: {method} {side} {path}")

    def otlp(self, session, request, **kwargs):
        assert request.url == "https://destination.invalid/api/public/otel/v1/traces"
        payload = request.body
        if request.headers.get("Content-Encoding") == "gzip":
            payload = gzip.decompress(payload)
        msg = ExportTraceServiceRequest.FromString(payload)
        for resource in msg.resource_spans:
            for scope in resource.scope_spans:
                self.spans.extend(scope.spans)
        response = requests.Response()
        response.status_code = 200
        response._content = b""
        response.request = request
        return response


def main():
    fixture = Fixture()
    transport = httpx.MockTransport(fixture.http)
    original_init = httpx.Client.__init__

    def client_init(self, *args, **kwargs):
        kwargs.setdefault("transport", transport)
        original_init(self, *args, **kwargs)

    def send(session, request, **kwargs):
        return fixture.otlp(session, request, **kwargs)

    env = {
        f"LANGFUSE_{prefix}_{suffix}": value
        for prefix, label in [("SOURCE", "source"), ("DEST", "destination")]
        for suffix, value in [
            ("PUBLIC_KEY", f"pk-lf-{label}-validation"),
            ("SECRET_KEY", "fake-secret"),
            ("HOST", f"https://{label}.invalid"),
        ]
    }
    env.update(LANGFUSE_MIGRATE_FROM_TIMESTAMP="", LANGFUSE_MIGRATE_TO_TIMESTAMP="")
    namespace = {}
    notebook = json.loads(NOTEBOOK.read_text())
    nbformat.validate(nbformat.read(NOTEBOOK, as_version=4))
    output = io.StringIO()
    with (
        patch.dict(os.environ, env),
        patch.object(httpx.Client, "__init__", client_init),
        patch.object(requests.sessions.Session, "send", send),
        contextlib.redirect_stdout(output),
    ):
        for cell in notebook["cells"]:
            code = "".join(cell["source"])
            if cell["cell_type"] != "code" or code.startswith("%"):
                continue
            exec(compile(code, cell["id"], "exec"), namespace)
        assert not fixture.errors, fixture.errors
        assert "failed: 0" in output.getvalue(), output.getvalue()
        assert "  failed " not in output.getvalue().lower(), output.getvalue()
        assert len(fixture.spans) == len(OBSERVATIONS), (
            len(fixture.spans),
            output.getvalue(),
        )
        spans = {s.span_id.hex(): s for s in fixture.spans}
        ids = namespace["obs_id_map"]
        trace_id = namespace["trace_id_map"][TRACE]
        assert set(spans) == set(ids.values())
        child = spans[ids[CHILD]]
        root = spans[ids[ROOT]]
        assert child.trace_id.hex() == trace_id and child.parent_span_id == root.span_id
        assert root.parent_span_id == b""
        assert all(s.start_time_unix_nano == 1790812800000000000 for s in fixture.spans)
        attrs = {a.key: a.value for a in child.attributes}
        assert (
            attrs["langfuse.observation.prompt.version"].int_value
            == namespace["prompt_version_map"][("folder/text", 1)]
            == 12
        )
        assert attrs["langfuse.observation.metadata.long"].string_value == LONG_METADATA
        assert attrs["langfuse.observation.type"].string_value == "generation"
        root_attrs = {a.key: a.value for a in root.attributes}
        assert root_attrs["langfuse.observation.type"].string_value == "agent"
        assert root_attrs["langfuse.trace.name"].string_value == "Trace name"
        assert root_attrs["user.id"].string_value == "test-user"
        score_bodies = [b for path, b in fixture.writes if path == "/api/public/scores"]
        assert len(score_bodies) == 5
        assert (
            next(b for b in score_bodies if b["id"] == "score-number")["observationId"]
            == ids[CHILD]
        )
        assert next(b for b in score_bodies if b["id"] == "score-bool")["value"] == 0
        item = next(
            b for path, b in fixture.writes if path == "/api/public/dataset-items"
        )
        assert (
            item["sourceObservationId"] == ids[CHILD]
            and item["sourceTraceId"] == trace_id
        )
        assert namespace["evaluator_id_map"].keys() == {
            "eval-llm",
            "eval-code",
            "eval-default",
        }
        before = len(fixture.writes)
        eval_code = next(
            "".join(c["source"])
            for c in notebook["cells"]
            if c["id"] == "migration-evaluators-api"
        )
        exec(eval_code, namespace)
        assert len(fixture.writes) == before, (
            "Rerunning evaluator cell creates duplicates"
        )
        assert namespace["to_otel_trace_id"]("Case") != namespace["to_otel_trace_id"](
            "case"
        )
        # Read-only requests recover from rate limits, while ambiguous writes
        # are attempted once and leave successful ID mappings intact.
        fixture.eval_rate_limited = True
        with patch("time.sleep"):
            exec(eval_code, namespace)
        assert not fixture.eval_rate_limited and len(fixture.writes) == before
        del namespace["evaluator_id_map"]["eval-default"]
        fixture.eval_failure = True
        exec(eval_code, namespace)
        assert namespace["failed"] == 1 and namespace["skipped"] == 2
        assert len(fixture.writes) == before + 1
        assert "eval-default" not in namespace["evaluator_id_map"]
        fixture.eval_failure = False

        # Failed OTLP exports must stop the notebook before scores and datasets.
        namespace["otlp_provider"].shutdown()
        obs_code = next(
            "".join(c["source"]) for c in notebook["cells"] if c["id"] == "41dd7648"
        )
        from opentelemetry.sdk.trace.export import SpanExportResult

        with patch.object(
            namespace["OTLPSpanExporter"],
            "export",
            return_value=SpanExportResult.FAILURE,
        ):
            try:
                exec(obs_code, namespace)
            except AssertionError as exc:
                assert "OTLP export failed" in str(exc)
            else:
                raise AssertionError("Failed OTLP exports were reported as successful")
            finally:
                namespace["otlp_provider"].shutdown()
    print(
        f"PASS (langfuse {version('langfuse')}): every cookbook section executed with real SDK clients and OTLP serialization; pagination, folder names, evaluator definitions, model tiers, schemas, span IDs, parentage, metadata, prompt versions, and score/dataset references verified."
    )


if __name__ == "__main__":
    main()

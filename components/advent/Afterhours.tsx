"use client";

import { useEffect, useState } from "react";
import { Moon, Snowflake, Copy, ArrowUpRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Santa } from "./HeroFigures";
import type { MusicFrame } from "./jingles";

export function SceneSwitch({
  techno,
  onChange,
  getFrame,
}: {
  techno: boolean;
  onChange: (value: boolean) => void;
  getFrame: () => MusicFrame;
}) {
  const [stage, setStage] = useState("The evening is young");
  useEffect(() => {
    const update = () => {
      const { mix } = getFrame();
      setStage(
        techno
          ? mix < 0.2
            ? "Down the stairs…"
            : mix < 0.55
              ? "Somewhere beneath Berlin…"
              : mix < 0.95
                ? "Santa’s second shift…"
                : "You’re on the list"
          : mix > 0.65
            ? "Last track, then home…"
            : mix > 0.05
              ? "Back through the snow…"
              : "The evening is young",
      );
    };
    update();
    const timer = setInterval(update, 250);
    return () => clearInterval(timer);
  }, [techno, getFrame]);
  return (
    <div className="adv-scene-control">
      <div className="adv-scene-switch">
        <span>
          <Snowflake size={14} /> Christmas
        </span>
        <Switch
          id="advent-afterhours"
          checked={techno}
          onCheckedChange={onChange}
          aria-label="Berlin afterhours"
        />
        <label htmlFor="advent-afterhours">
          <Moon size={14} /> Afterhours
        </label>
      </div>
      <span className="adv-scene-status" role="status">
        {stage}
      </span>
      <span className="adv-scene-progress" aria-hidden>
        <span />
      </span>
    </div>
  );
}

export function AfterhoursPass({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [invite, setInvite] = useState("");
  useEffect(() => {
    if (!open) return;
    const url = new URL(window.location.href);
    url.search = "?afterhours=1";
    url.hash = "";
    setInvite(url.href);
    setCopied(false);
    setCopyFailed(false);
  }, [open]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(invite);
      setCopied(true);
    } catch {
      setCopyFailed(true);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="adv-pass sm:max-w-[440px]">
        <div className="adv-pass-eyebrow">Langfuse / Afterhours</div>
        <DialogTitle className="adv-pass-title">
          You’re on
          <br />
          the nice list.
        </DialogTitle>
        <DialogDescription className="adv-pass-description">
          The other one. Welcome to Santa’s second shift.
        </DialogDescription>
        <div className="adv-pass-art" aria-hidden>
          <span>24:00</span>
          <Santa />
        </div>
        <div className="adv-pass-stub">
          <div>
            <span>North Pole → Berlin</span>
            <strong>Admit one + your entire engineering team</strong>
          </div>
          <div className="adv-pass-barcode" aria-hidden />
        </div>
        <p className="adv-pass-dresscode">
          Leather optional. TypeScript required.
        </p>
        <Button
          onClick={copy}
          aria-label="Copy the secret invite"
          icon={<Copy size={14} />}
          wrapperClassName="w-full"
        >
          {copied ? "Invite copied" : "Copy the secret invite"}
        </Button>
        <span className="sr-only" role="status">
          {copied ? "Secret invite copied to clipboard" : ""}
        </span>
        {copyFailed ? (
          <label className="text-xs">
            Copy this link
            <input
              readOnly
              value={invite}
              onFocus={(e) => e.target.select()}
              className="mt-2 w-full rounded border border-current bg-transparent p-2"
            />
          </label>
        ) : null}
        <a className="adv-pass-careers" href="/careers">
          Harness engineers wanted <ArrowUpRight size={14} />
        </a>
      </DialogContent>
    </Dialog>
  );
}

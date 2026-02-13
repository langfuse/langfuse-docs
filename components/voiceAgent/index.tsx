"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ai-elements/loader";
import { getPersistedNanoId } from "@/components/qaChatbot/utils/persistedNanoId";
import { MicIcon, MicOffIcon, PhoneOffIcon } from "lucide-react";

type AgentState =
  | "idle"
  | "connecting"
  | "connected"
  | "listening"
  | "thinking"
  | "speaking"
  | "error"
  | "not-configured";

type VoiceAgentProps = HTMLAttributes<HTMLDivElement>;

export const VoiceAgent = ({ className, ...props }: VoiceAgentProps) => {
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const roomRef = useRef<any>(null);

  const userId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getPersistedNanoId({
      key: "voice-agent-user-id",
      prefix: "u-",
    });
  }, []);

  const connect = useCallback(async () => {
    if (!userId) return;

    setAgentState("connecting");
    setError(null);
    setTranscripts([]);

    try {
      // Get token from our API
      const res = await fetch("/api/voice-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 503) {
          setAgentState("not-configured");
          return;
        }
        throw new Error(data.error ?? "Failed to connect");
      }

      const { token, url } = await res.json();

      const { Room, RoomEvent, ConnectionState } = await import(
        "livekit-client"
      );

      const room = new Room();
      roomRef.current = room;

      // Listen for agent state changes via data messages
      room.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
        try {
          const text = new TextDecoder().decode(payload);
          const data = JSON.parse(text);
          if (data.type === "agent_state") {
            setAgentState(data.state as AgentState);
          }
          if (data.type === "transcript") {
            setTranscripts((prev) => [
              ...prev,
              { role: data.role, text: data.text },
            ]);
          }
        } catch {
          // ignore invalid messages
        }
      });

      room.on(
        RoomEvent.ConnectionStateChanged,
        (state) => {
          if (state === ConnectionState.Disconnected) {
            setAgentState("idle");
            roomRef.current = null;
          }
        }
      );

      room.on(RoomEvent.Disconnected, () => {
        setAgentState("idle");
        roomRef.current = null;
      });

      await room.connect(url, token);
      setAgentState("connected");

      // Enable microphone
      await room.localParticipant.setMicrophoneEnabled(true);
      setAgentState("listening");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect");
      setAgentState("error");
    }
  }, [userId]);

  const disconnect = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    setAgentState("idle");
  }, []);

  const isActive =
    agentState === "connecting" ||
    agentState === "connected" ||
    agentState === "listening" ||
    agentState === "thinking" ||
    agentState === "speaking";

  const stateLabel: Record<AgentState, string> = {
    idle: "Click to start a voice conversation",
    connecting: "Connecting...",
    connected: "Connected, starting...",
    listening: "Listening...",
    thinking: "Thinking...",
    speaking: "Speaking...",
    error: "Connection failed",
    "not-configured": "Voice agent is not configured",
  };

  return (
    <div className={cn("h-[62vh]", className)} {...props}>
      <div className="flex flex-col h-full border border-border/40 rounded-2xl bg-gradient-to-br from-background via-background/95 to-muted/20 backdrop-blur-md shadow-xl shadow-black/10 dark:shadow-black/30 p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-black/15 dark:hover:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-transparent before:to-transparent before:pointer-events-none">
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          {/* Not configured fallback */}
          {agentState === "not-configured" && (
            <div className="text-center space-y-3 max-w-md">
              <MicOffIcon className="size-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">
                Voice Agent
              </h3>
              <p className="text-sm text-muted-foreground">
                The voice agent demo is powered by{" "}
                <a
                  href="https://livekit.io"
                  className="underline hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LiveKit Agents
                </a>{" "}
                and traces real-time STT → LLM → TTS voice pipelines in
                Langfuse.
              </p>
              {error && (
                <p className="text-xs text-muted-foreground">{error}</p>
              )}
              <p className="text-xs text-muted-foreground">
                See the{" "}
                <a
                  href="/docs/integrations/livekit"
                  className="underline hover:text-foreground"
                >
                  LiveKit integration docs
                </a>{" "}
                for setup details.
              </p>
            </div>
          )}

          {/* Main voice UI */}
          {agentState !== "not-configured" && (
            <>
              {/* Mic button */}
              <div className="relative mb-6">
                {/* Pulsing ring when listening */}
                {agentState === "listening" && (
                  <div className="absolute inset-0 -m-3 rounded-full border-2 border-primary animate-ping opacity-30" />
                )}
                {/* Speaking ring */}
                {agentState === "speaking" && (
                  <div className="absolute inset-0 -m-3 rounded-full border-2 border-green-500 animate-pulse" />
                )}
                <button
                  onClick={isActive ? disconnect : connect}
                  disabled={agentState === "connecting"}
                  className={cn(
                    "relative size-20 rounded-full flex items-center justify-center transition-all duration-300",
                    isActive
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90",
                    agentState === "connecting" &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  {agentState === "connecting" ? (
                    <Loader size={24} />
                  ) : isActive ? (
                    <PhoneOffIcon className="size-8" />
                  ) : (
                    <MicIcon className="size-8" />
                  )}
                </button>
              </div>

              {/* State label */}
              <p
                className={cn(
                  "text-sm mb-4",
                  agentState === "error"
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {stateLabel[agentState]}
              </p>

              {/* Error details */}
              {error && agentState === "error" && (
                <p className="text-xs text-destructive mb-4">{error}</p>
              )}

              {/* Transcripts */}
              {transcripts.length > 0 && (
                <div className="w-full max-w-md space-y-2 overflow-y-auto max-h-48">
                  {transcripts.map((t, i) => (
                    <div
                      key={i}
                      className={cn(
                        "text-sm px-3 py-2 rounded-lg",
                        t.role === "user"
                          ? "bg-primary/10 text-foreground ml-8"
                          : "bg-muted text-foreground mr-8"
                      )}
                    >
                      <span className="text-xs text-muted-foreground font-medium">
                        {t.role === "user" ? "You" : "Agent"}:{" "}
                      </span>
                      {t.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Info when idle */}
              {agentState === "idle" && transcripts.length === 0 && (
                <p className="text-xs text-muted-foreground text-center max-w-sm mt-2">
                  Start a voice conversation with the AI agent. The full STT →
                  LLM → TTS pipeline is traced in Langfuse via{" "}
                  <a
                    href="/docs/integrations/livekit"
                    className="underline hover:text-foreground"
                  >
                    LiveKit Agents
                  </a>
                  .
                </p>
              )}
            </>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground text-center relative z-10 italic">
          Powered by LiveKit Agents. All voice interactions are traced in the
          public example project.
        </p>
      </div>
    </div>
  );
};

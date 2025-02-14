import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef } from "react";
import { memo } from "react";

export interface AudioChunkData {
  text: string;
  audio: Blob;
}

export interface AudioChunkProps extends AudioChunkData {
  active: boolean;
  playing: boolean;
  onClick: () => void;
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
}

export const AudioChunk = memo(function AudioChunk({
  text,
  audio,
  active,
  playing,
  onClick,
  onStart,
  onPause,
  onEnd,
  ...props
}: AudioChunkProps) {
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handlePlay = () => onStart?.();
    const handleEnded = () => onEnd?.();
    const handlePause = () => {
      if (audioRef.current?.ended) return;
      onPause?.();
    };

    audioEl.addEventListener("play", handlePlay);
    audioEl.addEventListener("pause", handlePause);
    audioEl.addEventListener("ended", handleEnded);
    return () => {
      audioEl.removeEventListener("play", handlePlay);
      audioEl.removeEventListener("pause", handlePause);
      audioEl.removeEventListener("ended", handleEnded);
    };
  }, [onStart, onPause, onEnd]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (!active) return;

    if (playing) {
      if (audioRef.current?.ended) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [active, playing]);

  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (!audio) return;
    if (!audioRef.current) return;

    if (active) {
      audioRef.current.play();
      audioRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audio, active]);

  const url = useMemo(() => URL.createObjectURL(audio), [audio]);

  return (
    <div
      {...props}
      className={cn(
        "p-3 rounded-lg transition-all hover:bg-blue-50 hover:border hover:border-blue-200 cursor-pointer",
        active
          ? "bg-blue-50 border border-blue-200"
          : "bg-gray-50 border border-transparent",
      )}
      onClick={onClick}
    >
      <p>{text}</p>
      {audio && (
        <audio ref={audioRef} src={url} controls className="w-full mt-2" />
      )}
    </div>
  );
});

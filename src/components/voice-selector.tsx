import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { KokoroTTS } from "kokoro-js";

export type Voices = KokoroTTS["voices"];

interface VoiceSelectorProps {
  voices: Voices;
  selectedVoice: string;
  onVoiceChange: (voice: keyof Voices) => void;
}

export function VoiceSelector({
  voices,
  selectedVoice,
  onVoiceChange,
}: VoiceSelectorProps) {
  return (
    <Select value={selectedVoice} onValueChange={onVoiceChange}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select voice" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(voices).map(([key, voice]) => (
          <SelectItem key={key} value={key}>
            {voice.name} ({voice.language === "en-us" ? "American" : "British"}{" "}
            {voice.gender})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

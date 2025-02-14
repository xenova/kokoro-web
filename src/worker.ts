import { KokoroTTS, TextSplitterStream } from "kokoro-js";
import { detectWebGPU } from "./utils";

// Device detection
const device = (await detectWebGPU()) ? "webgpu" : "wasm";
self.postMessage({ status: "device", device });

// Load the model
const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
const tts = await KokoroTTS.from_pretrained(model_id, {
  dtype: device === "wasm" ? "q8" : "fp32",
  device,
}).catch((e: Error) => {
  self.postMessage({ status: "error", error: e.message });
  throw e;
});
self.postMessage({ status: "ready", voices: tts.voices, device });

// Listen for messages from the main thread
self.addEventListener("message", async (e) => {
  const { text, voice, speed } = e.data;

  const streamer = new TextSplitterStream();
  streamer.push(text);
  streamer.close(); // Indicate we won't add more text

  const stream = tts.stream(streamer, { voice, speed });

  const chunks = [];
  for await (const { text, audio } of stream) {
    self.postMessage({
      status: "stream",
      chunk: {
        audio: audio.toBlob(),
        text,
      },
    });
    chunks.push(audio);
  }

  // Merge chunks
  let audio;
  if (chunks.length > 0) {
    const sampling_rate = chunks[0].sampling_rate;
    const length = chunks.reduce((sum, chunk) => sum + chunk.audio.length, 0);
    const waveform = new Float32Array(length);
    let offset = 0;
    for (const { audio } of chunks) {
      waveform.set(audio, offset);
      offset += audio.length;
    }

    // Create a new merged RawAudio
    // @ts-expect-error - So that we don't need to import RawAudio
    audio = new chunks[0].constructor(waveform, sampling_rate);
  }

  self.postMessage({ status: "complete", audio: audio.toBlob() });
});

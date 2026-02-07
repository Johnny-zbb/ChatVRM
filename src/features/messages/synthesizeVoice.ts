import { reduceTalkStyle } from "@/utils/reduceTalkStyle";
import { getTongyiTTSResponse } from "../tongyi/tts";
import { TalkStyle } from "../messages/messages";

// Removed unused synthesizeVoice function as it was replaced by Tongyi Qianwen TTS implementation

export async function synthesizeVoiceApi(
  message: string,
  speakerX: number,
  speakerY: number,
  style: TalkStyle,
  apiKey: string
) {
  // Limit emotions for Free tier
  const reducedStyle = reduceTalkStyle(style);

  try {
    const response = await getTongyiTTSResponse(message, apiKey);
    return { audio: response.audio };
  } catch (error) {
    console.error('Error calling Tongyi TTS API:', error);
    throw new Error('Failed to generate speech with Tongyi TTS');
  }
}

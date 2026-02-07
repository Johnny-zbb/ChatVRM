import { Message } from "../messages/messages";

export async function getTongyiTTSResponse(message: string, apiKey: string): Promise<{ audio: string }> {
  const response = await fetch(process.env.DASHSCOPE_API_BASE_URL || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "qwen3-tts-instruct-flash-realtime",
      input: {
        text: message,
        voice: "Cherry",
        language_type: "Chinese"
      }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { audio: data.output.audio_url }; // Assuming the API returns an audio URL
}
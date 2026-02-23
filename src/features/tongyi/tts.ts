/**
 * 阿里云通义千问 TTS 服务
 * 使用 qwen3-tts-flash 模型进行语音合成
 */

export interface TongyiTTSError {
  code: string;
  message: string;
}

export interface TongyiTTSResponse {
  output: {
    audio_url?: string;
    audio_data?: string;
  };
  usage: {
    audio_tokens: number;
  };
  request_id: string;
}

export interface TongyiTTSOptions {
  /**
   * API 密钥
   */
  apiKey: string;
  /**
   * API 基础 URL（可选，默认为官方地址）
   */
  baseUrl?: string;
  /**
   * 语音模型名称（默认为 qwen3-tts-flash-2025-11-27）
   */
  model?: string;
  /**
   * 语音名称（如：Cherry, Aimei, Xiaoxiao 等）
   */
  voice?: string;
  /**
   * 语言类型（默认为 Chinese）
   */
  languageType?: string;
}

/**
 * 默认 TTS 模型
 */
export const DEFAULT_TTS_MODEL = "qwen3-tts-flash";

/**
 * 阿里云 TTS 合成函数
 * 返回 base64 编码的音频数据
 */
export async function synthesizeTongyiTTS(
  text: string,
  options: TongyiTTSOptions
): Promise<{ audio: string }> {
  const {
    apiKey,
    baseUrl = "https://dashscope.aliyuncs.com",
    model = DEFAULT_TTS_MODEL,
    voice = "Cherry",
    languageType = "Chinese"
  } = options;

  if (!apiKey) {
    throw new Error("DASHSCOPE_API_KEY is required");
  }

  if (!text || text.trim() === "") {
    throw new Error("Text is required");
  }

  try {
    const response = await fetch(`${baseUrl}/api/v1/services/aigc/multimodal-generation/generation`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        input: {
          text: text,
          voice: voice,
          language_type: languageType
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TTS API error response:", errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      const error = errorData as TongyiTTSError;
      throw new Error(`TTS API error: ${error.code || response.status} - ${error.message || response.statusText}`);
    }

    const data = await response.json() as TongyiTTSResponse;

    // 检查返回的数据
    if (data.output?.audio_url) {
      // 如果返回的是音频 URL，需要下载并转换为 base64
      const audioResponse = await fetch(data.output.audio_url);
      const audioBlob = await audioResponse.blob();
      const audioBase64 = await blobToBase64(audioBlob);
      return { audio: audioBase64 };
    } else if (data.output?.audio_data) {
      // 如果直接返回 base64 数据
      return { audio: data.output.audio_data };
    } else {
      throw new Error("No audio data in response");
    }

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`TTS synthesis failed: ${error.message}`);
    }
    throw new Error("TTS synthesis failed: Unknown error");
  }
}

/**
 * 将 Blob 转换为 base64 字符串
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // 移除 data URL 前缀（如 "data:audio/mp3;base64,"）
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * 播放 base64 音频
 */
export function playBase64Audio(base64Audio: string): HTMLAudioElement {
  const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
  audio.play();
  return audio;
}

/**
 * 可用的语音列表
 */
export const AVAILABLE_VOICES = [
  { name: "Cherry", description: "樱桃 - 活泼可爱的女性声音" },
  { name: "Aimei", description: "爱美 - 温柔甜美的女性声音" },
  { name: "Xiaoxiao", description: "晓晓 - 清亮自然的女性声音" },
  { name: "Yunxi", description: "云希 - 沉稳冷静的男性声音" },
  { name: "Yunyang", description: "云阳 - 阳光开朗的男性声音" }
] as const;
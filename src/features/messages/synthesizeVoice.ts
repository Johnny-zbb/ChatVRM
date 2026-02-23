import { TalkStyle, EmotionType } from "./messages";
import { speakWithEmotion } from "../webSpeechTts/webSpeechTts";

/**
 * 语音合成 API - 使用 Web Speech API
 * 
 * @param message - 要合成的文本
 * @param style - 说话风格
 * @param emotion - 情感类型
 * @param lang - 语言代码
 * @param onStart - 开始播放回调
 * @param onEnd - 播放结束回调
 * @param onError - 错误回调
 */
export function synthesizeVoiceApi(
  message: string,
  style: TalkStyle,
  emotion: EmotionType = "neutral",
  lang: string = 'zh-CN',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (error: Error) => void
) {
  try {
    // 使用 Web Speech API 播放语音
    speakWithEmotion(
      message,
      emotion,
      lang,
      onStart,
      onEnd,
      onError
    );
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error("Unknown error in voice synthesis"));
  }
}
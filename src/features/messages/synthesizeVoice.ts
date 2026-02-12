import { TalkStyle, EmotionType } from "../messages/messages";
import { speakWithEmotion } from "../webSpeechTts/webSpeechTts";

/**
 * 语音合成 API - 使用 Web Speech API（免费，无需 API 密钥）
 */
export function synthesizeVoiceApi(
  message: string,
  speakerX: number,
  speakerY: number,
  style: TalkStyle,
  apiKey: string,
  emotion: EmotionType = "neutral",
  lang: string = 'zh-CN',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (error: Error) => void
) {
  // 使用 Web Speech API 播放语音
  speakWithEmotion(
    message,
    emotion,
    lang,
    onStart,
    onEnd,
    onError
  );
  
  // 返回空对象以保持接口兼容性
  return { audio: "" };
}

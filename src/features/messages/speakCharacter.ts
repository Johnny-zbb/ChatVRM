import { synthesizeVoiceApi } from "./synthesizeVoice";
import { Viewer } from "../vrmViewer/viewer";
import { Screenplay } from "./messages";

/**
 * 播放角色语音
 * 使用 Web Speech API 进行语音合成（免费，无需 API 密钥）
 */
export const speakCharacter = (
  screenplay: Screenplay,
  viewer: Viewer,
  koeiroApiKey: string = "",
  microsoftTtsOptions?: any,
  onStart?: () => void,
  onComplete?: () => void
) => {
  // 获取语言代码（根据当前区域设置）
  const lang = 'zh-CN'; // 默认中文，可以根据实际需求调整

  // 使用 Web Speech API 播放语音
  synthesizeVoiceApi(
    screenplay.talk.message,
    screenplay.talk.speakerX,
    screenplay.talk.speakerY,
    screenplay.talk.style,
    koeiroApiKey,
    screenplay.expression,
    lang,
    onStart,
    onComplete,
    (error) => {
      console.error('Error in speakCharacter:', error);
    }
  );
  
  // 如果有 VRM 模型，仍然播放表情动画
  if (viewer.model && screenplay.expression) {
    viewer.model.emotion = screenplay.expression;
  }
};

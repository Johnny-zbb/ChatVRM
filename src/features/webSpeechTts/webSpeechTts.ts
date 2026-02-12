/**
 * Web Speech API TTS Service
 * 使用浏览器内置的 SpeechSynthesis API 进行语音合成
 * 完全免费，无需 API 密钥
 */

export interface WebSpeechTTSOptions {
  /**
   * 语音名称（可选，会自动选择最佳匹配）
   */
  voiceName?: string;
  /**
   * 语速 (0.1-10, 默认 1.0)
   */
  rate?: number;
  /**
   * 音调 (0-2, 默认 1.0)
   */
  pitch?: number;
  /**
   * 音量 (0-1, 默认 1.0)
   */
  volume?: number;
  /**
   * 语言代码（如：zh-CN, en-US, ja-JP）
   */
  lang?: string;
}

/**
 * 获取可用的语音列表
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  return window.speechSynthesis.getVoices();
}

/**
 * 根据语言获取最佳语音
 */
export function getBestVoiceForLanguage(lang: string): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  
  // 首先尝试精确匹配
  let voice = voices.find(v => v.lang === lang);
  if (voice) return voice;
  
  // 尝试匹配语言前缀
  const langPrefix = lang.split('-')[0];
  voice = voices.find(v => v.lang.startsWith(langPrefix));
  if (voice) return voice;
  
  // 如果没有找到，返回第一个语音
  return voices.length > 0 ? voices[0] : null;
}

/**
 * 语音合成
 */
export function speakText(
  text: string,
  options: WebSpeechTTSOptions = {},
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (error: Error) => void
): void {
  const {
    voiceName,
    rate = 1.0,
    pitch = 1.0,
    volume = 1.0,
    lang = 'zh-CN'
  } = options;

  // 取消当前正在播放的语音
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // 设置语音
  if (voiceName) {
    const voice = getAvailableVoices().find(v => v.name === voiceName);
    if (voice) {
      utterance.voice = voice;
    }
  } else {
    utterance.voice = getBestVoiceForLanguage(lang);
  }

  // 设置参数
  utterance.rate = Math.max(0.1, Math.min(10, rate));
  utterance.pitch = Math.max(0, Math.min(2, pitch));
  utterance.volume = Math.max(0, Math.min(1, volume));
  utterance.lang = lang;

  // 事件监听
  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (event) => {
    const error = new Error(`Speech synthesis error: ${event.error}`);
    onError?.(error);
  };

  // 开始播放
  window.speechSynthesis.speak(utterance);
}

/**
 * 停止语音播放
 */
export function stopSpeech(): void {
  window.speechSynthesis.cancel();
}

/**
 * 暂停语音播放
 */
export function pauseSpeech(): void {
  window.speechSynthesis.pause();
}

/**
 * 恢复语音播放
 */
export function resumeSpeech(): void {
  window.speechSynthesis.resume();
}

/**
 * 检查是否正在播放
 */
export function isSpeaking(): boolean {
  return window.speechSynthesis.speaking;
}

/**
 * 检查是否已暂停
 */
export function isPaused(): boolean {
  return window.speechSynthesis.paused;
}

/**
 * 等待语音列表加载完成
 */
export function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = getAvailableVoices();
    
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // 监听语音列表加载事件
    window.speechSynthesis.onvoiceschanged = () => {
      const loadedVoices = getAvailableVoices();
      resolve(loadedVoices);
    };
  });
}

/**
 * 获取中文语音列表
 */
export function getChineseVoices(): SpeechSynthesisVoice[] {
  const voices = getAvailableVoices();
  return voices.filter(v => v.lang.startsWith('zh'));
}

/**
 * 获取英文语音列表
 */
export function getEnglishVoices(): SpeechSynthesisVoice[] {
  const voices = getAvailableVoices();
  return voices.filter(v => v.lang.startsWith('en'));
}

/**
 * 获取日语语音列表
 */
export function getJapaneseVoices(): SpeechSynthesisVoice[] {
  const voices = getAvailableVoices();
  return voices.filter(v => v.lang.startsWith('ja'));
}

/**
 * 根据情感调整语音参数
 */
export function getEmotionVoiceParams(emotion: string): Partial<WebSpeechTTSOptions> {
  const emotionMap: Record<string, Partial<WebSpeechTTSOptions>> = {
    neutral: { rate: 1.0, pitch: 1.0 },
    happy: { rate: 1.1, pitch: 1.2 },
    angry: { rate: 1.2, pitch: 0.8 },
    sad: { rate: 0.9, pitch: 0.9 },
    relaxed: { rate: 0.95, pitch: 1.0 },
    fear: { rate: 1.1, pitch: 1.3 },
    surprised: { rate: 1.15, pitch: 1.4 },
  };
  
  return emotionMap[emotion] || emotionMap.neutral;
}

/**
 * 使用情感表达播放语音
 */
export function speakWithEmotion(
  text: string,
  emotion: string,
  lang: string = 'zh-CN',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (error: Error) => void
): void {
  const emotionParams = getEmotionVoiceParams(emotion);
  
  speakText(
    text,
    {
      ...emotionParams,
      lang,
    },
    onStart,
    onEnd,
    onError
  );
}
import { getTongyiTTSResponse } from './src/features/tongyi/tts.js';

async function testTTS() {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  
  if (!apiKey) {
    console.error('DASHSCOPE_API_KEY is not set in environment variables');
    process.exit(1);
  }

  console.log('Testing Tongyi TTS API...');
  
  try {
    const result = await getTongyiTTSResponse('你好，这是一个测试。', apiKey);
    console.log('TTS API call successful!');
    console.log('Audio data length:', result.audio.length);
    console.log('Test passed!');
  } catch (error) {
    console.error('TTS API call failed:', error);
    process.exit(1);
  }
}

testTTS();
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testTongyiTTS() {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  const baseUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/audio/speech';
  
  if (!apiKey) {
    console.error('DASHSCOPE_API_KEY is not set in environment variables');
    process.exit(1);
  }

  console.log('Testing Tongyi TTS API...');
  console.log('Base URL:', baseUrl);
  
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "cosyvoice-v1",
        input: {
          text: "你好，这是一个测试。"
        },
        parameters: {
          voice: "longxiaochun"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log('API call successful!');
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.output && data.output.audio_url) {
      console.log('\nAudio URL:', data.output.audio_url);
      
      const audioResponse = await fetch(data.output.audio_url);
      if (audioResponse.ok) {
        const audioBuffer = await audioResponse.arrayBuffer();
        console.log('Audio data size:', audioBuffer.byteLength, 'bytes');
      } else {
        console.log('Failed to fetch audio data');
      }
    }
    
    console.log('\nTest passed!');
  } catch (error) {
    console.error('API call failed:', error);
    process.exit(1);
  }
}

testTongyiTTS();
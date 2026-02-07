import { getChatResponseStream } from './src/features/chat/openAiChat.js';

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set in environment variables');
    process.exit(1);
  }

  console.log('Testing OpenAI Chat API...');
  console.log('Base URL:', process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions');
  console.log('Model:', process.env.OPENAI_MODEL || 'gpt-3.5-turbo');
  
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, please say "API test successful" in Chinese.' }
  ];

  try {
    const stream = await getChatResponseStream(messages, apiKey);
    console.log('API call successful! Streaming response:');
    
    const reader = stream.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullResponse = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const text = decoder.decode(value, { stream: true });
      fullResponse += text;
      process.stdout.write(text);
    }
    
    console.log('\n\nFull response:', fullResponse);
    console.log('Test passed!');
  } catch (error) {
    console.error('API call failed:', error);
    process.exit(1);
  }
}

testOpenAI();
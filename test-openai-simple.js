import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set in environment variables');
    process.exit(1);
  }

  console.log('Testing OpenAI Chat API...');
  console.log('Base URL:', baseUrl);
  console.log('Model:', model);
  
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, please say "API test successful" in Chinese.' }
  ];

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log('API call successful!');
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('\nAssistant message:', data.choices[0].message.content);
    }
    
    console.log('\nTest passed!');
  } catch (error) {
    console.error('API call failed:', error);
    process.exit(1);
  }
}

testOpenAI();
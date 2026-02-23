import { Configuration, OpenAIApi } from "openai";
import { Message } from "../messages/messages";

// 默认配置：GLM API (智谱 AI)
const DEFAULT_BASE_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const DEFAULT_MODEL = "glm-4.5-air";

// 睡眠函数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getChatResponse(messages: Message[], apiKey: string) {
  if (!apiKey) {
    throw new Error("Invalid API Key");
  }

  const configuration = new Configuration({
    apiKey: apiKey,
    basePath: process.env.NEXT_PUBLIC_OPENAI_BASE_URL || DEFAULT_BASE_URL,
  });
  delete configuration.baseOptions.headers["User-Agent"];

  const openai = new OpenAIApi(configuration);

  const { data } = await openai.createChatCompletion({
    model: process.env.NEXT_PUBLIC_OPENAI_MODEL || DEFAULT_MODEL,
    messages: messages,
    thinking: {
      type: "disabled"
    }
  } as any);

  const [aiRes] = data.choices;
  const message = aiRes.message?.content || "エラーが発生しました";

  return { message: message };
}

export async function getChatResponseStream(
  messages: Message[],
  apiKey: string,
  maxRetries = 3
) {
  if (!apiKey) {
    throw new Error("Invalid API Key");
  }

  let retryCount = 0;
  let lastError: Error | null = null;

  while (retryCount < maxRetries) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      
      const requestBody = {
        model: process.env.NEXT_PUBLIC_OPENAI_MODEL || DEFAULT_MODEL,
        messages: messages,
        stream: true,
        max_tokens: 200,
        thinking: {
          type: "disabled"
        }
      };
      
      console.log("Sending request:", requestBody);
      
      const res = await fetch(
        process.env.NEXT_PUBLIC_OPENAI_BASE_URL || DEFAULT_BASE_URL,
        {
          headers: headers,
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Response status:", res.status);

      // 处理 429 错误（速率限制）
      if (res.status === 429) {
        retryCount++;
        const retryAfter = res.headers.get("Retry-After");
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 2000 * retryCount;
        
        console.warn(`Rate limited (429). Retry ${retryCount}/${maxRetries} after ${waitTime}ms`);
        
        if (retryCount < maxRetries) {
          await sleep(waitTime);
          continue;
        }
        
        throw new Error("API 请求过于频繁，请稍后再试");
      }

      // 处理其他错误
      if (res.status !== 200) {
        const errorText = await res.text();
        console.error("API Error response:", errorText);
        throw new Error(`API 错误 (${res.status}): ${errorText}`);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("无法获取响应流");
      }

      const stream = new ReadableStream({
        async start(controller: ReadableStreamDefaultController) {
          const decoder = new TextDecoder("utf-8");
          let buffer = "";
          
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                console.log("Stream completed");
                break;
              }
              
              const data = decoder.decode(value, { stream: true });
              buffer += data;
              
              // 处理 SSE 格式的数据
              const lines = buffer.split("\n");
              buffer = lines.pop() || ""; // 保留最后一个不完整的行
              
              for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || trimmedLine.startsWith(":")) continue;
                
                if (trimmedLine.startsWith("data:")) {
                  const dataStr = trimmedLine.slice(5).trim();
                  if (dataStr === "[DONE]") {
                    console.log("Received [DONE] signal");
                    continue;
                  }
                  
                  try {
                    const json = JSON.parse(dataStr);
                    console.log("Parsed chunk:", json);
                    
                    // GLM API 可能使用不同的字段名
                    const messagePiece = json.choices?.[0]?.delta?.content || 
                                       json.choices?.[0]?.content ||
                                       json.content;
                    
                    if (messagePiece) {
                      console.log("Enqueuing message piece:", messagePiece);
                      controller.enqueue(messagePiece);
                    }
                  } catch (e) {
                    console.warn("Failed to parse chunk:", dataStr, e);
                  }
                }
              }
            }
          } catch (error) {
            console.error("Stream error:", error);
            controller.error(error);
          } finally {
            reader.releaseLock();
            controller.close();
          }
        },
      });

      return stream;

    } catch (error) {
      lastError = error as Error;
      console.error("Request error:", error);
      retryCount++;
      
      if (retryCount < maxRetries) {
        const waitTime = 2000 * retryCount;
        console.warn(`请求失败，${waitTime}ms 后重试 (${retryCount}/${maxRetries}):`, error);
        await sleep(waitTime);
      }
    }
  }

  // 所有重试都失败了
  throw lastError || new Error("API 请求失败，请检查网络连接和 API 密钥");
}

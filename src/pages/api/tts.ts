import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  audio: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // 从 Authorization header 获取 API Key
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const dashscopeApiKey = authHeader?.toString().replace("Bearer ", "");
  
  console.log('dashscopeApiKey exists:', !!dashscopeApiKey);
  
  if (!dashscopeApiKey) {
    return res.status(400).json({ audio: "", error: "Authorization header is required" });
  }

  try {
    // 直接转发 body 到阿里云 API
    const response = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${dashscopeApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TTS API error:", errorText);
      return res.status(response.status).json({ audio: "", error: errorText });
    }

    const data = await response.json();
    console.log("TTS API success");
    
    // 提取音频数据
    if (data.output?.audio_url) {
      const audioResponse = await fetch(data.output.audio_url);
      const audioBlob = await audioResponse.blob();
      const audioBuffer = await audioBlob.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString("base64");
      return res.status(200).json({ audio: audioBase64 });
    } else if (data.output?.audio_data) {
      return res.status(200).json({ audio: data.output.audio_data });
    } else {
      return res.status(500).json({ audio: "", error: "No audio data in response" });
    }
  } catch (error) {
    console.error("TTS error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ audio: "", error: errorMessage });
  }
}

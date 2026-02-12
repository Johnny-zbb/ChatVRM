import { useCallback, useContext, useEffect, useState } from "react";
import VrmViewer from "@/components/vrmViewer";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import {
  Message,
  textsToScreenplay,
  Screenplay,
} from "@/features/messages/messages";
import { speakCharacter } from "@/features/messages/speakCharacter";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { SYSTEM_PROMPT, SYSTEM_PROMPT_ZH, SYSTEM_PROMPT_EN } from "@/features/constants/systemPromptConstants";
import { KoeiroParam, DEFAULT_PARAM } from "@/features/constants/koeiroParam";
import { getChatResponseStream } from "@/features/chat/openAiChat";
import { Introduction } from "@/components/introduction";
import { Menu } from "@/components/menu";
import { GitHubLink } from "@/components/githubLink";
import { Meta } from "@/components/meta";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import enMessages from '@/i18n/locales/en.json';
import zhMessages from '@/i18n/locales/zh.json';

const i18nMessages = {
  en: enMessages,
  zh: zhMessages,
};

export default function Home() {
  const router = useRouter();
  const [locale, setLocale] = useState('zh'); // 默认中文
  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT_ZH); // 默认中文提示词
  const t = locale === 'en'
    ? i18nMessages.en.index
    : i18nMessages.zh.index;
  const { viewer } = useContext(ViewerContext);

  useEffect(() => {
    const savedLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'zh';
    setLocale(savedLocale);
    // 根据语言设置系统提示词
    setSystemPrompt(savedLocale === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_ZH);
  }, []);

  const [openAiKey, setOpenAiKey] = useState("");
  const [koeiroParam, setKoeiroParam] = useState<KoeiroParam>(DEFAULT_PARAM);
  const [chatProcessing, setChatProcessing] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem("chatVRMParams")) {
      const params = JSON.parse(
        window.localStorage.getItem("chatVRMParams") as string
      );
      
      // 获取当前语言的默认提示词
      const defaultPrompt = locale === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_ZH;
      
      // 检测存储的提示词是否是日文（包含日文字符）
      const isJapanesePrompt = /[\u3040-\u309F\u30A0-\u30FF]/.test(params.systemPrompt || '');
      
      // 如果是日文提示词或没有存储提示词，使用当前语言的默认提示词
      if (isJapanesePrompt || !params.systemPrompt) {
        setSystemPrompt(defaultPrompt);
        // 更新 localStorage，移除日文提示词
        params.systemPrompt = defaultPrompt;
        process.nextTick(() =>
          window.localStorage.setItem(
            "chatVRMParams",
            JSON.stringify(params)
          )
        );
      } else {
        setSystemPrompt(params.systemPrompt);
      }
      
      setKoeiroParam(params.koeiroParam ?? DEFAULT_PARAM);
      setChatLog(params.chatLog ?? []);
    } else {
      // 如果没有 localStorage 数据，使用当前语言的默认提示词
      const defaultPrompt = locale === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_ZH;
      setSystemPrompt(defaultPrompt);
    }
  }, [locale]);

  useEffect(() => {
    process.nextTick(() =>
      window.localStorage.setItem(
        "chatVRMParams",
        JSON.stringify({
          systemPrompt,
          koeiroParam,
          chatLog,
        })
      )
    );
  }, [systemPrompt, koeiroParam, chatLog]);

  const handleChangeChatLog = useCallback(
    (targetIndex: number, text: string) => {
      const newChatLog = chatLog.map((v: Message, i) => {
        return i === targetIndex ? { role: v.role, content: text } : v;
      });

      setChatLog(newChatLog);
    },
    [chatLog]
  );

/**
   * Generate and play audio for each sentence in sequence
   */
  const handleSpeakAi = useCallback(
    async (
      screenplay: Screenplay,
      onStart?: () => void,
      onEnd?: () => void
    ) => {
      // 使用 Web Speech API 播放语音（免费，无需 API 密钥）
      speakCharacter(
        screenplay,
        viewer,
        "",
        undefined,
        onStart,
        onEnd
      );
    },
    [viewer]
  );

/**
   * Conduct conversation with the assistant
   */
const handleSendChat = useCallback(
    async (text: string) => {
      if (!openAiKey) {
        setAssistantMessage(i18nMessages[locale as keyof typeof i18nMessages].index.noApiKey);
        return;
      }

      // 清除之前的错误
      setErrorMessage("");

      const newMessage = text;

      if (newMessage == null) return;

setChatProcessing(true);
      // Add and display user's message
      const messageLog: Message[] = [
        ...chatLog,
        { role: "user", content: newMessage },
      ];
setChatLog(messageLog);

      // Send to ChatGPT
      const messages: Message[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messageLog,
      ];

      let stream;
      try {
        stream = await getChatResponseStream(messages, openAiKey).catch(
          (e) => {
            console.error(e);
            throw e;
          }
        );
      } catch (e) {
        const error = e as Error;
        setErrorMessage(error.message);
        setChatProcessing(false);
        return;
      }
      
      if (stream == null) {
        setErrorMessage("无法获取 AI 响应");
        setChatProcessing(false);
        return;
      }

      const reader = stream.getReader();
      let receivedMessage = "";
      let aiTextLog = "";
      let tag = "";
      const sentences = new Array<string>();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // 流结束时，处理剩余的内容
            if (receivedMessage.trim()) {
              sentences.push(receivedMessage.trim());
              
              // 添加到显示
              const currentAssistantMessage = sentences.join(" ");
              setAssistantMessage(currentAssistantMessage);
              
              // 添加到日志
              const aiText = `${tag} ${receivedMessage.trim()}`;
              aiTextLog += aiText;
            }
            break;
          }

receivedMessage += value;

          // Detect tag part in response content
          const tagMatch = receivedMessage.match(/^\[(.*?)\]/);
          if (tagMatch && tagMatch[0]) {
            tag = tagMatch[0];
receivedMessage = receivedMessage.slice(tag.length);
          }

          // Extract and process response sentence by sentence
          const sentenceMatch = receivedMessage.match(
            /^(.+[。．！？\n]|.{10,}[、,])/
          );
          if (sentenceMatch && sentenceMatch[0]) {
            const sentence = sentenceMatch[0];
            sentences.push(sentence);
            receivedMessage = receivedMessage
              .slice(sentence.length)
.trimStart();

            // Skip if string is not needed/cannot be spoken
            if (
              !sentence.replace(
                /^[\s\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]]+$/g,
                ""
              )
            ) {
              continue;
            }

            const aiText = `${tag} ${sentence}`;
const aiTalks = textsToScreenplay([aiText], koeiroParam);
            aiTextLog += aiText;

            // Generate and play audio for each sentence, display response
            const currentAssistantMessage = sentences.join(" ");
            handleSpeakAi(aiTalks[0], () => {
              setAssistantMessage(currentAssistantMessage);
            });
          }
        }
      } catch (e) {
        setErrorMessage(`处理响应时出错: ${(e as Error).message}`);
        setChatProcessing(false);
        console.error(e);
      } finally {
reader.releaseLock();
      }

      // Add assistant's response to log
      const messageLogAssistant: Message[] = [
        ...messageLog,
        { role: "assistant", content: aiTextLog },
      ];

      setChatLog(messageLogAssistant);
setChatProcessing(false);
    },
    [systemPrompt, chatLog, handleSpeakAi, openAiKey, koeiroParam, t, locale]
  );

return (
    <div className={"font-M_PLUS_2"}>
      <Meta />
      <Introduction
        openAiKey={openAiKey}
        onChangeAiKey={setOpenAiKey}
        locale={locale}
      />
      <VrmViewer />
      <MessageInputContainer
        isChatProcessing={chatProcessing}
        onChatProcessStart={handleSendChat}
      />
      <Menu
        openAiKey={openAiKey}
        systemPrompt={systemPrompt}
        chatLog={chatLog}
        koeiroParam={koeiroParam}
        assistantMessage={assistantMessage}
        onChangeAiKey={setOpenAiKey}
        onChangeSystemPrompt={setSystemPrompt}
        onChangeChatLog={handleChangeChatLog}
        onChangeKoeiroParam={setKoeiroParam}
        handleClickResetChatLog={() => setChatLog([])}
        handleClickResetSystemPrompt={() => setSystemPrompt(locale === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_ZH)}
        locale={locale}
      />
      <GitHubLink />
      {errorMessage && (
        <div className="absolute bottom-24 left-24 right-24 bg-red-500 text-white p-16 rounded-8 z-50">
          <div className="flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage("")}
              className="ml-16 px-8 py-4 bg-white text-red-500 rounded-4 font-bold"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

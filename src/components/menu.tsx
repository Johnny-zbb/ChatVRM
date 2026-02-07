import { IconButton } from "./iconButton";
import { Message } from "@/features/messages/messages";
import { KoeiroParam } from "@/features/constants/koeiroParam";
import { ChatLog } from "./chatLog";
import React, { useCallback, useContext, useRef, useState } from "react";
import { Settings } from "./settings";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import { AssistantText } from "./assistantText";
import enMessages from '@/i18n/locales/en.json';
import zhMessages from '@/i18n/locales/zh.json';

const i18nMessages = {
  en: enMessages,
  zh: zhMessages,
};

type Props = {
  openAiKey: string;
  systemPrompt: string;
  chatLog: Message[];
  koeiroParam: KoeiroParam;
  assistantMessage: string;
  koeiromapKey: string;
  onChangeSystemPrompt: (systemPrompt: string) => void;
  onChangeAiKey: (key: string) => void;
  onChangeChatLog: (index: number, text: string) => void;
  onChangeKoeiromapParam: (param: KoeiroParam) => void;
  handleClickResetChatLog: () => void;
  handleClickResetSystemPrompt: () => void;
  onChangeKoeiromapKey: (key: string) => void;
  locale?: string;
};
export const Menu = ({
  openAiKey,
  systemPrompt,
  chatLog,
  koeiroParam,
  assistantMessage,
  koeiromapKey,
  onChangeSystemPrompt,
  onChangeAiKey,
  onChangeChatLog,
  onChangeKoeiromapParam,
  handleClickResetChatLog,
  handleClickResetSystemPrompt,
  onChangeKoeiromapKey,
  locale = 'en',
}: Props) => {
  const t = i18nMessages[locale as keyof typeof i18nMessages].menu;
  const [showSettings, setShowSettings] = useState(false);
  const [showChatLog, setShowChatLog] = useState(false);
  const { viewer } = useContext(ViewerContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeSystemPrompt = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeSystemPrompt(event.target.value);
    },
    [onChangeSystemPrompt]
  );

  const handleAiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeAiKey(event.target.value);
    },
    [onChangeAiKey]
  );

  const handleChangeKoeiromapKey = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeKoeiromapKey(event.target.value);
    },
    [onChangeKoeiromapKey]
  );

  const handleChangeKoeiroParam = useCallback(
    (x: number, y: number) => {
      onChangeKoeiromapParam({
        speakerX: x,
        speakerY: y,
      });
    },
    [onChangeKoeiromapParam]
  );

  const handleClickOpenVrmFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChangeVrmFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const file = files[0];
      if (!file) return;

      const file_type = file.name.split(".").pop();

      if (file_type === "vrm") {
        const blob = new Blob([file], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        viewer.loadVrm(url);
      }

      event.target.value = "";
    },
    [viewer]
  );

return (
    <>
      <div className="absolute z-50 m-24">
<div className="grid grid-flow-col gap-[8px]">
          <IconButton
            iconName="24/Menu"
            label={t.settings}
            isProcessing={false}
            onClick={() => setShowSettings(true)}
          ></IconButton>
          {showChatLog ? (
            <IconButton
              iconName="24/CommentOutline"
              label={t.chatLog}
              isProcessing={false}
              onClick={() => setShowChatLog(false)}
            />
          ) : (
            <IconButton
              iconName="24/CommentFill"
              label={t.chatLog}
              isProcessing={false}
              disabled={chatLog.length <= 0}
              onClick={() => setShowChatLog(true)}
            />
          )}
          <button
            onClick={() => {
              const nextLocale = locale === 'en' ? 'zh' : locale === 'zh' ? 'ja' : 'en';
              document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
              location.reload();
            }}
            className="bg-primary hover:bg-primary-hover active:bg-primary-press text-white rounded-16 text-sm p-8 text-center inline-flex items-center mr-2"
          >
            <div className="mr-2 font-bold">{locale === 'en' ? 'EN' : locale === 'zh' ? '中' : '日'}</div>
          </button>
        </div>
      </div>
      {showChatLog && <ChatLog messages={chatLog} />}
      {showSettings && (
        <Settings
          openAiKey={openAiKey}
          chatLog={chatLog}
          systemPrompt={systemPrompt}
          koeiroParam={koeiroParam}
          koeiromapKey={koeiromapKey}
          onClickClose={() => setShowSettings(false)}
          onChangeAiKey={handleAiKeyChange}
          onChangeSystemPrompt={handleChangeSystemPrompt}
          onChangeChatLog={onChangeChatLog}
          onChangeKoeiroParam={handleChangeKoeiroParam}
          onClickOpenVrmFile={handleClickOpenVrmFile}
          onClickResetChatLog={handleClickResetChatLog}
          onClickResetSystemPrompt={handleClickResetSystemPrompt}
          onChangeKoeiromapKey={handleChangeKoeiromapKey}
        />
      )}
      {!showChatLog && assistantMessage && (
        <AssistantText message={assistantMessage} />
      )}
      <input
        type="file"
        className="hidden"
        accept=".vrm"
        ref={fileInputRef}
        onChange={handleChangeVrmFile}
      />
    </>
  );
};

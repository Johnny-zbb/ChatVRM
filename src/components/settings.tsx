import React from "react";
import { IconButton } from "./iconButton";
import { TextButton } from "./textButton";
import { Message } from "@/features/messages/messages";
import {
  KoeiroParam,
  PRESET_A,
  PRESET_B,
  PRESET_C,
  PRESET_D,
} from "@/features/constants/koeiroParam";
import { Link } from "./link";
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
  onClickClose: () => void;
  onChangeAiKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSystemPrompt: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeChatLog: (index: number, text: string) => void;
  onChangeKoeiroParam: (x: number, y: number) => void;
  onClickOpenVrmFile: () => void;
  onClickResetChatLog: () => void;
  onClickResetSystemPrompt: () => void;
  locale?: string;
};
export const Settings = ({
  openAiKey,
  chatLog,
  systemPrompt,
  koeiroParam,
  onClickClose,
  onChangeSystemPrompt,
  onChangeAiKey,
  onChangeChatLog,
  onChangeKoeiroParam,
  onClickOpenVrmFile,
  onClickResetChatLog,
  onClickResetSystemPrompt,
  locale = 'en',
}: Props) => {
  const t = i18nMessages[locale as keyof typeof i18nMessages].settings;
  const chatLogT = i18nMessages[locale as keyof typeof i18nMessages].chatLog;
return (
    <div className="absolute z-[60] w-full h-full bg-white/80 backdrop-blur" onClick={onClickClose}>
      <div className="absolute m-24 z-[70]">
        <IconButton
          iconName="24/Close"
          isProcessing={false}
          onClick={(e) => {
            e.stopPropagation();
            onClickClose();
          }}
        ></IconButton>
      </div>
      <div className="max-h-full overflow-auto">
<div className="text-text1 max-w-3xl mx-auto px-24 py-64 " onClick={(e) => e.stopPropagation()}>
          <div className="my-24 typography-32 font-bold">{t.title}</div>
          <div className="my-24">
            <div className="my-16 typography-20 font-bold">{t.openaiApiKey.title}</div>
            <input
              className="text-ellipsis px-16 py-8 w-col-span-2 bg-surface1 hover:bg-surface1-hover rounded-8"
              type="text"
              placeholder={t.openaiApiKey.placeholder}
              value={openAiKey}
              onChange={onChangeAiKey}
            />
            <div>
              {t.openaiApiKey.getFrom}
              <Link
                url={t.openaiApiKey.platformUrl}
                label={t.openaiApiKey.openaiSite}
              />
              {t.openaiApiKey.enterKey}
            </div>
            <div className="my-16">
              {t.openaiApiKey.directAccess}
              <br />
              {t.openaiApiKey.modelNote}
            </div>
          </div>
          <div className="my-40">
            <div className="my-16 typography-20 font-bold">{t.characterModel.title}</div>
            <div className="my-8">
              <TextButton onClick={onClickOpenVrmFile}>{t.characterModel.openVrm}</TextButton>
            </div>
          </div>
          <div className="my-40">
            <div className="my-8">
              <div className="my-16 typography-20 font-bold">
                {t.characterSettings.title}
              </div>
              <TextButton onClick={onClickResetSystemPrompt}>
                {t.characterSettings.reset}
              </TextButton>
            </div>

            <textarea
              value={systemPrompt}
              onChange={onChangeSystemPrompt}
              className="px-16 py-8  bg-surface1 hover:bg-surface1-hover h-168 rounded-8 w-full"
            ></textarea>
          </div>

          {chatLog.length > 0 && (
            <div className="my-40">
              <div className="my-8 grid-cols-2">
                <div className="my-16 typography-20 font-bold">{t.chatHistory.title}</div>
                <TextButton onClick={onClickResetChatLog}>
                  {t.chatHistory.reset}
                </TextButton>
              </div>
              <div className="my-8">
                {chatLog.map((value, index) => {
                  return (
                    <div
                      key={index}
                      className="my-8 grid grid-flow-col  grid-cols-[min-content_1fr] gap-x-fixed"
                    >
                      <div className="w-[64px] py-8">
                        {value.role === "assistant" ? chatLogT.character : chatLogT.you}
                      </div>
                      <input
                        key={index}
                        className="bg-surface1 hover:bg-surface1-hover rounded-8 w-full px-16 py-8"
                        type="text"
                        value={value.content}
                        onChange={(event) => {
                          onChangeChatLog(index, event.target.value);
                        }}
                      ></input>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

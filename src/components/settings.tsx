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
  koeiromapKey: string;
  onClickClose: () => void;
  onChangeAiKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSystemPrompt: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeChatLog: (index: number, text: string) => void;
  onChangeKoeiroParam: (x: number, y: number) => void;
  onClickOpenVrmFile: () => void;
  onClickResetChatLog: () => void;
  onClickResetSystemPrompt: () => void;
  onChangeKoeiromapKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
  locale?: string;
};
export const Settings = ({
  openAiKey,
  chatLog,
  systemPrompt,
  koeiroParam,
  koeiromapKey,
  onClickClose,
  onChangeSystemPrompt,
  onChangeAiKey,
  onChangeChatLog,
  onChangeKoeiroParam,
  onClickOpenVrmFile,
  onClickResetChatLog,
  onClickResetSystemPrompt,
  onChangeKoeiromapKey,
  locale = 'en',
}: Props) => {
  const t = i18nMessages[locale as keyof typeof i18nMessages].settings;
return (
    <div className="absolute z-30 w-full h-full bg-white/80 backdrop-blur">
      <div className="absolute m-24 z-40">
        <IconButton
          iconName="24/Close"
          isProcessing={false}
          onClick={onClickClose}
        ></IconButton>
      </div>
      <div className="max-h-full overflow-auto">
<div className="text-text1 max-w-3xl mx-auto px-24 py-64 ">
          <div className="my-24 typography-32 font-bold">{t.title}</div>
          <div className="my-24">
            <div className="my-16 typography-20 font-bold">{t.openaiApiKey.title}</div>
            <input
              className="text-ellipsis px-16 py-8 w-col-span-2 bg-surface1 hover:bg-surface1-hover rounded-8"
              type="text"
              placeholder="sk-..."
              value={openAiKey}
              onChange={onChangeAiKey}
            />
            <div>
              APIキーは
              <Link
                url="https://platform.openai.com/account/api-keys"
                label="OpenAIのサイト"
              />
              で取得できます。取得したAPIキーをフォームに入力してください。
            </div>
            <div className="my-16">
              ChatGPT
              APIはブラウザから直接アクセスしています。また、APIキーや会話内容はピクシブのサーバには保存されません。
              <br />
              ※利用しているモデルはChatGPT API (GPT-3.5)です。
            </div>
          </div>
          <div className="my-40">
            <div className="my-16 typography-20 font-bold">
              キャラクターモデル
            </div>
            <div className="my-8">
              <TextButton onClick={onClickOpenVrmFile}>VRMを開く</TextButton>
            </div>
          </div>
          <div className="my-40">
            <div className="my-8">
              <div className="my-16 typography-20 font-bold">
                キャラクター設定（システムプロンプト）
              </div>
              <TextButton onClick={onClickResetSystemPrompt}>
                キャラクター設定リセット
              </TextButton>
            </div>

            <textarea
              value={systemPrompt}
              onChange={onChangeSystemPrompt}
              className="px-16 py-8  bg-surface1 hover:bg-surface1-hover h-168 rounded-8 w-full"
            ></textarea>
          </div>
<div className="my-40">
            <div className="my-16 typography-20 font-bold">声の調整</div>
            <div>
              阿里云通义千問のTTS APIを使用しています。詳しくは
              <Link
                url="https://www.aliyun.com/product/dashscope"
                label="https://www.aliyun.com/product/dashscope"
              />
              をご覧ください。
            </div>
            <div className="mt-16 font-bold">API キー</div>
            <div className="mt-8">
              <input
                className="text-ellipsis px-16 py-8 w-col-span-2 bg-surface1 hover:bg-surface1-hover rounded-8"
                type="text"
                placeholder="sk-..."
                value={koeiromapKey}
                onChange={onChangeKoeiromapKey}
              />
</div>
          </div>
          {chatLog.length > 0 && (
            <div className="my-40">
              <div className="my-8 grid-cols-2">
                <div className="my-16 typography-20 font-bold">会話履歴</div>
                <TextButton onClick={onClickResetChatLog}>
                  会話履歴リセット
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
                        {value.role === "assistant" ? "Character" : "You"}
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

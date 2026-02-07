import { useState, useCallback } from "react";
import { Link } from "./link";
import enMessages from '@/i18n/locales/en.json';
import zhMessages from '@/i18n/locales/zh.json';

const i18nMessages = {
  en: enMessages,
  zh: zhMessages,
};

type Props = {
  openAiKey: string;
  koeiroMapKey: string;
  onChangeAiKey: (openAiKey: string) => void;
  onChangeKoeiromapKey: (koeiromapKey: string) => void;
  locale?: string;
};

export const Introduction = ({
  openAiKey,
  koeiroMapKey,
  onChangeAiKey,
  onChangeKoeiromapKey,
  locale = 'en',
}: Props) => {
  const [opened, setOpened] = useState(true);
  const t = i18nMessages[locale as keyof typeof i18nMessages].introduction;

  const handleAiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeAiKey(event.target.value);
    },
    [onChangeAiKey]
  );

  const handleKoeiromapKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeKoeiromapKey(event.target.value);
    },
    [onChangeKoeiromapKey]
  );

return opened ? (
    <div className="absolute z-40 w-full h-full px-24 py-40  bg-black/30 font-M_PLUS_2">
<div className="mx-auto my-auto max-w-3xl max-h-full p-24 overflow-auto bg-white rounded-16">
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary ">
            {t.title}
          </div>
          <div>
            {t.description}
          </div>
        </div>
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            {t.techIntro.title}
          </div>
          <div>
            {t.techIntro.description}
            <Link
              url={"https://github.com/pixiv/three-vrm"}
              label={t.techIntro.vrmLibrary}
            />
            {t.techIntro.forConversation}
            <Link
              url={
                "https://openai.com/blog/introducing-chatgpt-and-whisper-apis"
              }
              label={t.techIntro.chatGPT}
            />
            {t.techIntro.forVoice}
            <Link url={"https://www.aliyun.com/product/dashscope"} label={t.techIntro.tongyi} />
            {t.techIntro.ttsApi}
            <Link
              url={
                "https://help.aliyun.com/zh/dashscope/developer-reference/quick-start"
              }
              label={t.techIntro.from}
            />
            {t.techIntro.details}
            <Link
              url={"https://inside.pixiv.blog/2023/04/28/160000"}
              label={t.techIntro.techArticle}
            />
            {t.techIntro.forDetails}
          </div>
          <div className="my-16">
            {t.techIntro.githubDesc}
            <br />
            {t.techIntro.repository}
            <Link
              url={"https://github.com/pixiv/ChatVRM"}
              label={"https://github.com/pixiv/ChatVRM"}
            />
          </div>
        </div>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            {t.usageNotes.title}
          </div>
          <div>
            {t.usageNotes.description}
          </div>
        </div>

<div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            {t.dashscopeApiKey.title}
          </div>
          <input
            type="text"
            placeholder={t.dashscopeApiKey.placeholder}
            value={koeiroMapKey}
            onChange={handleKoeiromapKeyChange}
            className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
          ></input>
          <div>
            {t.dashscopeApiKey.getFrom}
            <Link
              url={t.dashscopeApiKey.consoleUrl}
              label={t.dashscopeApiKey.console}
            />
            {t.dashscopeApiKey.forDetails}
            <Link
              url={t.dashscopeApiKey.detailsUrl}
              label={t.dashscopeApiKey.detailsLink}
            />
          </div>
        </div>
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            {t.openaiApiKey.title}
          </div>
          <input
            type="text"
            placeholder={t.openaiApiKey.placeholder}
            value={openAiKey}
            onChange={handleAiKeyChange}
            className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
          ></input>
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
<div className="my-24">
          <button
            onClick={() => {
              setOpened(false);
            }}
            className="font-bold bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled text-white px-24 py-8 rounded-oval"
          >
            {t.startButton}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

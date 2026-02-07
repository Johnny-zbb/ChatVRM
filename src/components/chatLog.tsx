import { useEffect, useRef } from "react";
import { Message } from "@/features/messages/messages";
import enMessages from '@/i18n/locales/en.json';
import zhMessages from '@/i18n/locales/zh.json';

const i18nMessages = {
  en: enMessages,
  zh: zhMessages,
};

type Props = {
  messages: Message[];
  locale?: string;
};
export const ChatLog = ({ messages: msgs, locale = 'en' }: Props) => {
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({
      behavior: "auto",
      block: "center",
    });
  }, []);

useEffect(() => {
    chatScrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [msgs]);
return (
    <div className="absolute w-col-span-6 max-w-full h-[100svh] pb-64 z-20">
      <div className="max-h-full px-16 pt-104 pb-64 overflow-y-auto scroll-hidden">
        {msgs.map((msg, i) => {
          return (
            <div key={i} ref={msgs.length - 1 === i ? chatScrollRef : null}>
              <Chat role={msg.role} message={msg.content} locale={locale} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Chat = ({ role, message, locale = 'en' }: { role: string; message: string; locale: string }) => {
  const t = i18nMessages[locale as keyof typeof i18nMessages].chatLog;
  const roleColor =
    role === "assistant" ? "bg-secondary text-white " : "bg-base text-primary";
  const roleText = role === "assistant" ? "text-secondary" : "text-primary";
  const offsetX = role === "user" ? "pl-40" : "pr-40";

  return (
    <div className={`mx-auto max-w-sm my-16 ${offsetX}`}>
      <div
        className={`px-24 py-8 rounded-t-8 font-bold tracking-wider ${roleColor}`}
      >
        {role === "assistant" ? t.character : t.you}
      </div>
      <div className="px-24 py-16 bg-white rounded-b-8">
        <div className={`typography-16 font-bold ${roleText}`}>{message}</div>
      </div>
    </div>
  );
};

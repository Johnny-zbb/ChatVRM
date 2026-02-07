import { IconButton } from "./iconButton";
import { useTranslations, useLocale } from 'next-intl';

type Props = {
  onLocaleChange: (locale: string) => void;
};

export const LanguageSwitcher = ({ onLocaleChange }: Props) => {
  const t = useTranslations();
  const locale = useLocale();

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
  ];

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLocaleChange(lang.code)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            locale === lang.code
              ? 'bg-secondary text-white'
              : 'bg-surface1 hover:bg-surface1-hover text-primary'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
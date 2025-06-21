import { useLanguage } from '@/lib/hooks/use-language';

export function LanguageDropdown() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <select
      value={language}
      onChange={handleLanguageChange}
      className="rounded-md border px-2 py-1"
    >
      <option value="en-US">English</option>
      <option value="es">Spanish (Español)</option>
      <option value="fr">French (Français)</option>
      <option value="zh-CN">Chinese (中国人)</option>
      <option value="hi">Hindi (हिंदी)</option>
      <option value="ar">Arabic (عربي)</option>
      <option value="de">German (Deutsch)</option>
      <option value="pt">Portuguese (Português)</option>
      <option value="ja">Japanese (日本語)</option>
      <option value="ru">Russian (Русский)</option>
      {/* Add more languages here */}
    </select>
  );
}
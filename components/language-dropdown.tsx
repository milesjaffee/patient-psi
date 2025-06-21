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
      <option value="es">Spanish</option>
      <option value="fr">French</option>
      {/* Add more languages here */}
    </select>
  );
}
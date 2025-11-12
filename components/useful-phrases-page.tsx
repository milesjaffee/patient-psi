'use client';
import { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { IconSun } from "@/components/ui/icons";

interface UsefulPhrasesProps {
    usefulPhrases: any;
    phraseListNames: string[];
}

export default function UsefulPhrasesPage({usefulPhrases, phraseListNames}: UsefulPhrasesProps) {
  const [ language, setLanguage ] = useState("es-ES");
  const [ phraseList, setPhraseList ] = useState(0);
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
    console.log('Language changed to:', event.target.value);
  };
  const handlePhraseListChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPhraseList(event.target.value);
    console.log('PhraseList changed to:', event.target.value);
  };

  const speak = (text: string, lang?: string) => {

    if ('speechSynthesis' in window) {
      //console.log("Available voices:", window.speechSynthesis.getVoices());
      // console.log('Speaking:', text)
      window.speechSynthesis.cancel() // Cancel any ongoing speech synthesis
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang?? language;
      utterance.rate = 1
      window.speechSynthesis.speak(utterance)
    } else {
      console.error('TTS is not supported in this browser.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-xl font-semibold">
          Useful Phrases in Each Language
        </h1>
         <p className="leading-normal pt-4 font-medium text-zinc-500">
                    Use the first dropdown to select the target language and the second to select the topic (sample phrases addressing {phraseListNames.length} important subject matters are included!)
                </p>


    <select
      value={language}
      onChange={handleLanguageChange}
      className="rounded-md border px-2 py-1 bg-background"
    >
      <option value="en-US">English</option>
      <option value="es-ES">Spanish (Español)</option>
      <option value="fr-FR">French (Français)</option>
      <option value="zh-CN">Chinese (中国人)</option>
      <option value="de-DE">German (Deutsch)</option>
      <option value="pt-PT">Portuguese (Português)</option>
      <option value="ja-JP">Japanese (日本語)</option>
      <option value="ru-RU">Russian (Русский)</option>
    </select>
    <select
      value={phraseListNames[phraseList+1]}
      onChange={handlePhraseListChange}
      className="rounded-md border px-2 py-1 bg-background"
    >
    {
      phraseListNames.map((listName, index) => (
        <option value={index} key={index}>{listName}</option>

      ))
    }
    </select>
      <div className="overflow-auto">
        <table className="table-fixed min-w-full border border-black">

            <thead>
              <tr>
                <th className="w-1/2">English</th>
                <th className="w-1/2">{language}</th>
              </tr>
            </thead>
            <tbody>
              {
                usefulPhrases[phraseList]["en-US"].map((phrase, index) => (
                  <tr className="border border-black">
                    <td className="border-r-2 border-black">
                      <div className="flex justify-between">
                      <div>{phrase}</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                              type="button"
                              size="icon"
                              //title="Speak response"
                              onClick={() => {
                                console.log('Speak button clicked! Language: en-US');
                                speak(phrase, 'en-US');
                              }}
                            >
                          <IconSun /> {/* TODO: Make icon a speaker */}
                          <span className="sr-only">Speak response</span>
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent>Speak response</TooltipContent>
                      </Tooltip>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-between">
                      <div>{usefulPhrases[phraseList][language] ? usefulPhrases[phraseList][language][index] : "Support for language not yet added!"} </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                              type="button"
                              size="icon"
                              //title="Speak response"
                              onClick={() => {
                                console.log('Speak button clicked! Language:', language);
                                speak(usefulPhrases[phraseList][language] ? usefulPhrases[phraseList][language][index] : "Support for language not yet added!");
                              }}
                            >
                          <IconSun /> {/* TODO: Make icon a speaker */}
                          <span className="sr-only">Speak response</span>
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent>Speak response</TooltipContent>
                      </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>


        </table>
        {
          language === 'es-ES' ? <div>
            <h2 className="font-semibold">More Useful Resources</h2>
            <div className="text-blue-500"><a href="https://commongroundinternational.com/medical-spanish/mental-health-conversations-in-spanish/">Mental Health Conversations in Spanish</a>
            </div>
            <div className="text-blue-500"><a href="https://commongroundinternational.com/medical-spanish/mental-health-conversation-in-spanish-listening-comprehension/">Mental Health Conversations in Spanish: Listening Comprehension</a>
            </div>
          </div> : <div></div>

        }
        </div>
    </div>
  );
}
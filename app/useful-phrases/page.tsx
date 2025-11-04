'use client';
import { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { IconSun } from "@/components/ui/icons";

export default function UsefulPhrases() {
  const [ language, setLanguage ] = useState("es-ES");
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
    console.log('Language changed to:', event.target.value);
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

  const usefulPhrases = {
    "en-US": [
      "Hello",
      "Good morning",
      "Good afternoon",
      "Good evening",
      "How are you?",
      "Nice to meet you",
      "Are you close with your parents?",
      "Do you spend a lot of time with your parents? " ,
      "Do you get along well with your siblings?",
      "Do you get along well with your brother?",
      "Do you get along well with your sister?",
      "Do you get along well with your housemates?",
      "Do you get along well with your classmates?",
      "Tell me more why you are worried.",
      "Tell me more why you are always fatigued",
      "Tell me more why you feel hopeless",
      "Tell me more why you cannot focus on your study",
      "Tell me more why you can’t get along well with your boss",
      "What makes you happy?",
    ],
    "es-ES": [
      "Hola",
      "Buenas dias",
      "Buenas tardes",
      "Buenos noches",
      "Como estas?",
      "Mucho gusto",
      "¿Tienes una relación cercana con tus padres?",
      "¿Pasas mucho tiempo con tus padres?",
      "¿Te llevas bien con tus hermanos/as?",
      "¿Te llevas bien con tu hermano?",
      "¿Te llevas bien con tu hermana?",
      "¿Te llevas bien con tus compañeros/as de casa?",
      "¿Te llevas bien con tus compañeros/as?",
      "Dime más por qué estás preocupado.",
      "Cuéntame más por qué siempre estás fatigado.",
      "Cuéntame más por qué te sientes desesperanzado.",
      "Cuéntame más por qué no puedes concentrarte en tus estudios.",
      "Cuéntame más por qué no te llevas bien con tu jefe.",
      "¿Qué te hace feliz?",
    ]
  }

  return (
    <div className="mx-auto max-w-2xl px-4 flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-xl font-semibold">
          Useful Phrases in Each Language
        </h1>


    <select
      value={language}
      onChange={handleLanguageChange}
      className="rounded-md border px-2 py-1"
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
                usefulPhrases["en-US"].map((phrase, index) => (
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
                      <div>{usefulPhrases[language] ? usefulPhrases[language][index] : "Support for language not yet added!"} </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                              type="button"
                              size="icon"
                              //title="Speak response"
                              onClick={() => {
                                console.log('Speak button clicked! Language:', language);
                                speak(usefulPhrases[language] ? usefulPhrases[language][index] : "Support for language not yet added!");
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
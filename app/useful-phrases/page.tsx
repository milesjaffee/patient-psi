'use client';
import { LanguageDropdown } from '@/components/language-dropdown';
import { useLanguage } from '@/lib/hooks/use-language';

export default function UsefulPhrases() {
  const { language } = useLanguage();
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
        <LanguageDropdown />

        <table className="table-auto border border-black">

            <thead>
              <tr>
                <th>English</th>
                <th>{language}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border">
                  <td>Hello</td>
                  <td>{language === "es-ES" ? "Hola" : ""}</td>
                  
              </tr>
               <tr className="border">
                  <td>Some other stuff like a really long sentence maybe even the longest</td>
                  <td>{language === "es-ES" ? "Hola hold hold I made it out of clay" : ""}</td>
                  
              </tr>
            </tbody>


        </table>
    </div>
  );
}
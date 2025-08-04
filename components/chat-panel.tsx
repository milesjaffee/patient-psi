import * as React from 'react'

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './message'
import { useLanguage } from '@/lib/hooks/use-language';
import { setChatLanguage, getChatLanguage } from '@/app/api/getDataFromKV'


export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)

  const { language }: { language: string } = useLanguage();
  console.log('ChatPanel language:', language);

  const exampleMessages: Record<string, { heading: string; subheading: string; message: string }[]> = {
    "en-US": [ // English (US)
      {
        heading: 'Example greeting message:',
        subheading: 'How are you feeling today?',
        message: `How are you feeling today?`
      }
    ],
    "es-ES": [ // Spanish
      {
        heading: 'Ejemplo de mensaje de saludo:',
        subheading: '¿Cómo te sientes hoy?',
        message: `¿Cómo te sientes hoy?`
      }
    ],
    "fr-FR": [ // French
      {
        heading: 'Exemple de message de bienvenue :',
        subheading: `Comment te sens-tu aujourd'hui ?`,
        message: `Comment te sens-tu aujourd'hui ?`
      }
    ],
    "zh-CN": [ // Chinese
      {
        heading: '问候语示例：',
        subheading: `你今天感觉怎么样？`,
        message: `你今天感觉怎么样？`
      }
    ],
    // "hi": [ // Hindi
    //   {
    //     heading: 'उदाहरण शुभकामना संदेश:',
    //     subheading: `आज आप कैसा महसूस कर रहे हैं?`,
    //     message: `आज आप कैसा महसूस कर रहे हैं?`
    //   }
    // ],
    // "ar": [ // Arabic
    //   {
    //     heading: 'مثال لرسالة الترحيب:',
    //     subheading: `كيف تشعر اليوم؟`,
    //     message: `كيف تشعر اليوم؟`
    //   }
    // ],
    "de-DE": [ // German
      {
        heading: 'Beispiel einer Begrüßungsnachricht:',
        subheading: `Wie fühlen Sie sich heute?`,
        message: `Wie fühlen Sie sich heute?`
      }
    ],
    "pt-PT": [ // Portuguese
      {
        heading: 'Exemplo de mensagem de saudação:',
        subheading: `Como você está se sentindo hoje?`,
        message: `Como você está se sentindo hoje?`
      }
    ],
    
    "ja-JP": [ // Japanese
      {
        heading: '挨拶メッセージの例:',
        subheading: `今日は気分はどうですか？`,
        message: `今日は気分はどうですか？`
      }
    ],
    "ru-RU": [ // Russian
      {
        heading: 'Пример приветственного сообщения:',
        subheading: `Как вы себя чувствуете сегодня?`,
        message: `Как вы себя чувствуете сегодня?`
      }
    ],
    
  }

  if (id) getChatLanguage(id).then((chatLang) => {
    console.log('ChatPanel getChatLanguage:', chatLang, 'for chat ID:', id);
    if (!chatLang && messages.length === 0) {
      console.log('Setting chat language from KV:', language);
      //setInput(''); // Clear input to avoid confusion
      setChatLanguage(id, language); // Update chat language in KV
    }
    else if (chatLang) {
      console.log('Chat language from KV:', chatLang);
      if (chatLang !== language) {
        console.warn(`Chat language mismatch: KV=${chatLang}, Current=${language}`);
      }
    }
  });

  
  // const exampleMessages: any[] = []

  return (
    <div className="fixed bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages[language].map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${index > 1 && 'hidden md:block'
                  }`}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message
                  )

                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
                <div className="text-sm font-semibold">
                  Click to begin conversation!
                </div>
              </div>
            ))}
        </div>

        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages: aiState.messages
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm input={input} setInput={setInput} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}

import 'server-only'

import {
  createAI,
  getMutableAIState,
  getAIState,
  render,
  createStreamableValue
} from 'ai/rsc'
import OpenAI from 'openai'
// import { playAudio } from 'openai/helpers/audio'

import {
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage, BotMessage } from '@/components/message'
import { Chat } from '@/lib/types'
import { auth } from '@/auth'

import { getChatLanguage, setMsgTranslation, getPrompt } from '@/app/api/getDataFromKV'

import { Translate } from '@google-cloud/translate/build/src/v2';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})


async function submitUserMessage(content: string, type: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()
  const translate = new Translate();

  const translateMessage = async (text: string, id: string) => {

    const language = await getChatLanguage(aiState.get().chatId);

    if (!language || language === 'en-US' || language === 'en') {
      return text; // No translation needed
    }
    const message = await translate.translate(text, language as string);

    setMsgTranslation(id, message as unknown as string);
    
    return message;
  }

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content,
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode
  let botResponse: string = '';
  
  const ui = render({
    model: 'gpt-4',
    provider: openai,
    initial: <SpinnerMessage />,
    messages: [
      {
        role: 'system',
        content: await getPrompt()
      },
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: async ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} isDone={done} />
      }

      if (done) {
        textStream.done()
        const newId = nanoid();

        const translatedMessage = await translateMessage(content, newId); // Placeholder for translation function    

        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: newId,
              role: 'assistant',
              content,
            }
          ],
        })

        textNode = <BotMessage content={content} isDone={done} id={newId}/>
        botResponse = content

      } else {
        textStream.update(delta)
      }

      return textNode
    }
  })

  return {
    id: nanoid(),
    display: ui,
    content: botResponse
  }
}

export type Message = {
  role: "data" | "system" | "user" | "assistant" | "function" | "tool"
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState as Chat)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state, done }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  //console.log('Translations: '+aiState.translations);
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage 
            content={message.content} 
            isDone={true} 
            id={message.id}
          />
        )
    }))
}

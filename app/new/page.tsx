import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '../actions'
import { LanguageProvider } from '@/lib/hooks/use-language'

export const metadata = {
  title: 'Patient Psi'
}

export default async function NewPage() {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  return (
    <LanguageProvider>
      <AI initialAIState={{ chatId: id, messages: [] }}>
        <Chat id={id} session={session} missingKeys={missingKeys} />
      </AI>
    </LanguageProvider>
  )
}
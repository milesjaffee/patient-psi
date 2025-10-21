import { nanoid } from '@/lib/utils'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '../actions'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { IconPlus, IconUsers } from '@/components/ui/icons'



export const metadata = {
  title: 'Patient Psi'
}

export default async function IndexPage() {

  return (
      <div className="mx-auto max-w-2xl px-4">
          <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
              <h1 className="text-xl font-semibold">
                  CBT session with a simulated client powered by AI
              </h1>
              <p className="leading-normal pt-4 font-medium text-zinc-500">
                  In this CBT session, you will talk to a client simulated by AI with a virtual patient profile. Your goal is to identify the cognitive conceptualization diagram of the client by communicating with them and using CBT skills.
              </p>

              <p className="leading-normal pt-4 font-medium text-zinc-500">
                  Select 'New Chat' to start a chat, or 'Useful Phrases' to review common phrases in the target language. 
              </p>

          
          <div className="grid grid-cols-2 mt-3 space-between gap-5">
            <Link
              href="/new"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10'
              )}
            >
              <IconPlus className="-translate-x-2 stroke-2" />
              New Chat
            </Link>

            <Link
              href="/useful-phrases"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10'
              )}
            >
              <IconUsers className="-translate-x-2 stroke-2" />
              Useful Phrases
            </Link>

          
          </div>
      </div >
  </div>
  )
}

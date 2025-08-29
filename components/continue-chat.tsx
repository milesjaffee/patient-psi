'use server';

import { getChats } from '@/app/actions'
import { ContinueChatItems } from '@/components/continue-chat-items'
import { cache } from 'react'
import { auth } from 'auth'


const loadChats = cache(async (userId?: string) => {
  return await getChats(userId)
})

export async function ContinueChat() {

  const session = await auth();
  const chats = (session && session.user)? await loadChats(session.user.id) : [] //this is the key!!

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {chats?.length ? (
          <div className="space-y-2 px-2">
            <ContinueChatItems chats={chats} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
        )}
      </div>
    </div>
  )
}
import { Chat } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'

import { SidebarActions } from '@/components/sidebar-actions'
import { ContinueChatItem } from '@/components/continue-chat-item'

interface SidebarItemsProps {
  chats?: Chat[]
}

export function ContinueChatItems({ chats }: SidebarItemsProps) {
  if (!chats?.length) return null

  return (
    <div>
      {chats.map(
        (chat, index) =>
          chat && (
            <div key={chat.id}>
              {chat.title}
              <ContinueChatItem index={index} chat={chat}>
              </ContinueChatItem>
            </div>
          )
      )}
    </div>
  )
}

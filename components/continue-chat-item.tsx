import * as React from 'react'

import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

import { type Chat } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  index: number
  chat: Chat
  children?: React.ReactNode
}

export function ContinueChatItem({ index, chat, children }: SidebarItemProps) {

  if (!chat?.id) return null

  return (

      <div className="left-2 top-1 flex" key={chat.id}>
      
      <Link
        href={chat.path}
        className={cn(
          'group h-full flex px-8 py-1 transition-colors hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10',
        )}
      >
        <p
          className="text-m max-h-5 w-full flex-1 select-none overflow-hidden text-ellipsis break-all"
        >
           {chat.title}
        </p>
              {children && <div className="absolute right-2 top-1">{children}</div>}
      </Link>
      </div>

  )
}

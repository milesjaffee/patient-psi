import * as React from 'react'

import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { IconMessage, IconUsers } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

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

      <div className="absolute left-2 top-1 flex size-6 items-center justify-center" key={chat.id}>
        {chat.sharePath ? (
          <Tooltip delayDuration={1000}>
            <TooltipTrigger
              tabIndex={-1}
              className="focus:bg-muted focus:ring-1 focus:ring-ring"
            >
              <IconUsers className="mr-2 mt-1 text-zinc-500" />
            </TooltipTrigger>
            <TooltipContent>This is a shared chat.</TooltipContent>
          </Tooltip>
        ) : (
          <IconMessage className="mr-2 mt-1 text-zinc-500" />
        )}
      
      <Link
        href={chat.path}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'group w-full px-8 transition-colors hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10',
        )}
      >
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={chat.title}
        >
          <span className="whitespace-nowrap">
            <span>{chat.title}</span>
          </span>
        </div>
              {children && <div className="absolute right-2 top-1">{children}</div>}
      </Link>
      </div>

  )
}

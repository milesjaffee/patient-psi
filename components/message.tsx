'use client'

import { IconOpenAI, IconUser, IconSun } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { CodeBlock } from './ui/codeblock'
import { MemoizedReactMarkdown } from './markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { StreamableValue } from 'ai/rsc'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'

import { Button } from '@/components/ui/button'
import { IconArrowElbow } from '@/components/ui/icons'

import { useEffect } from 'react'
import { useLanguage } from '@/lib/hooks/use-language';

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {children}
      </div>
    </div>
  )
}

export function BotMessage({
  content,
  isDone,
  className
}: {
  content: string | StreamableValue<string>
  isDone: boolean,
  className?: string
}) {
  const text = useStreamableText(content);
  const { language }: { language: string } = useLanguage();

  const speak = (text: string) => {

    if ('speechSynthesis' in window) {
      console.log("Available voices:", window.speechSynthesis.getVoices());
      // console.log('Speaking:', text)
      window.speechSynthesis.cancel() // Cancel any ongoing speech synthesis
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language;
      utterance.rate = 1
      window.speechSynthesis.speak(utterance)
    } else {
      console.error('TTS is not supported in this browser.')
    }
  }

  useEffect(() => {
    console.log('Attempting to speak:', text, 'isDone:', isDone)
    if (isDone) {
      // console.log('calling speak with text:', text)
      speak(text)
    }
  }, [isDone])

  return (
    <div className={cn('group relative flex items-start md:-ml-12', className)}>
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 flex-1 flex items-center space-y-2 overflow-hidden px-1">
        <div className="flex-1">
          <MemoizedReactMarkdown
            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>
              },


              // this code part seems to be unnecessary
              code({ node, inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] == '▍') {
                    return (
                      <span className="mt-1 animate-pulse cursor-default">▍</span>
                    )
                  }

                  children[0] = (children[0] as string).replace('`▍`', '▍')
                }

                const match = /language-(\w+)/.exec(className || '')

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ''}
                    value={String(children).replace(/\n$/, '')}
                    {...props}
                  />
                )
              }
              // end of code part

            }}
          >
            {text}
          </MemoizedReactMarkdown>
        </div>
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Button
              type="button"
              size="icon"
              onClick={() => console.log('Action button clicked!')}
            >
          <IconSun /> {/* TODO: Make icon a speaker */}
          <span className="sr-only">Speak response</span>
        </Button>
      </div>
    </div>
  )
}


export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
}

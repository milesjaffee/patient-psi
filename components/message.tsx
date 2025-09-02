'use client'

import { IconOpenAI, IconUser, IconSun, IconMessage } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { CodeBlock } from './ui/codeblock'
import { MemoizedReactMarkdown } from './markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { StreamableValue } from 'ai/rsc'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { Button } from '@/components/ui/button'
import { IconArrowElbow } from '@/components/ui/icons'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/hooks/use-language';

import { getMsgTranslation } from '@/app/api/getDataFromKV'

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
  className,
  id,
}: {
  content: string | StreamableValue<string>
  isDone: boolean,
  className?: string,
  translation?: string
  id?: string
}) {
  const [ shownText, setShownText ] = useState('Loading...');
  useEffect(() => {
  if (id) {
    getMsgTranslation(id)
      .then((translation) => {
        if (translation) {
          setShownText(translation[0] as string);
        } else {
          
          setShownText(content as string);
        }
      })
      .catch((error) => {
        console.error('Error fetching message translation:', error);
        setShownText(content as string);
      });
  } else {
    setShownText(content as string);
  }
}, [id, content]);

  //const translationOk = translation && translation.trim() !== '';
  //const text = translationOk? translation : kvTranslation || content;
  const [showOriginal, setShowOriginal] = useState(false);
  const { language }: { language: string } = useLanguage();

  const speak = (text: string) => {

    if ('speechSynthesis' in window) {
      //console.log("Available voices:", window.speechSynthesis.getVoices());
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

  /*useEffect(() => { //TODO only speak when text is done and not on reload of preexisting chat
    console.log('Attempting to speak:', text, 'isDone:', isDone)
    if (isDone) {
      // console.log('calling speak with text:', text)
      speak(text)
    }
  }, [isDone])*/

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
                return <p className="mb-2 last:mb-0">{children
                  }
                </p>
              },


              // this code part seems to be unnecessary
              /*code({ node, inline, className, children, ...props }) {
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
              }*/
              // end of code part

            }}
          >
            {shownText}
          </MemoizedReactMarkdown>
          {showOriginal && (
            <div className="mt-2 text-sm text-gray-500">
              <p><strong>Original:</strong> {content}</p>
              <strong>Message ID:</strong> {id? id: 'n/a'}
            </div>
          )}
        </div>
      </div>

      <div className="relative right-1 flex flex-col">
        
        <Tooltip>
            <TooltipTrigger asChild>
              <Button
                  type="button"
                  size="icon"
                  //title="Speak response"
                  onClick={() => {
                    console.log('Speak button clicked! Language:', language);
                    speak(shownText);
                  }}
                >
              <IconSun /> {/* TODO: Make icon a speaker */}
              <span className="sr-only">Speak response</span>
            </Button>
            </TooltipTrigger>
            <TooltipContent>Speak response</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                  type="button"
                  size="icon"
                  //title="Speak response"
                  onClick={() => {
                    console.log('Translation toggle clicked!');
                    setShowOriginal(!showOriginal);
                  }}
                >
              <IconMessage /> {/* TODO: Make icon a speaker */}
              <span className="sr-only">Show English</span>
            </Button>
            </TooltipTrigger>
            <TooltipContent>Show English</TooltipContent>
          </Tooltip>
      </div>
    </div>
  )
}


export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-gray-500 bg-zinc-100'
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

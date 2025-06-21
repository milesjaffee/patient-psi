'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { useActions, useUIState } from 'ai/rsc'

import { UserMessage } from './message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconMoon } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { Stopwatch } from './stopwatch'

export function PromptForm({
  input,
  setInput
}: {
  input: string
  setInput: (value: string) => void
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()
  const [isListening, setIsListening] = React.useState(false); // Track speech recognition state
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, []);

  // Speech recognition setup
  React.useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false; // Only capture final results
    recognition.maxAlternatives = 1;
    recognition.continuous = false; // Keep recognition active until stopped (otherwise it stops automatically)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Recognized speech:', transcript);
      setInput((prevInput) => `${prevInput} ${transcript}`.trim()); // Append recognized text to the input
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended.');
      if (isListening) {
        console.log('Restarting speech recognition...');
        recognition.start(); // Automatically restart recognition if still listening
      } else {
        console.log('Speech recognition stopped by user.');
      }
    };

    recognitionRef.current = recognition; // Store the recognition instance
  }, []);

  // Toggle Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      // Stop speech recognition
      recognitionRef.current?.stop();
      console.log('Speech recognition stopped.');
    } else {
      // Start speech recognition
      recognitionRef.current?.start();
      console.log('Speech recognition started...');
    }
    setIsListening(!isListening); // Toggle listening state
  };

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        // Optimistically add user message UI
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])

        // Submit and get response message
        const responseMessage = await submitUserMessage(value)
        setMessages(currentMessages => [...currentMessages, responseMessage])

        // if ('speechSynthesis' in window) {
        //   if (responseMessage.content !== '') {
        //     const utterance = new SpeechSynthesisUtterance(responseMessage.content)
        //     utterance.lang = 'en-US'
        //     utterance.rate = 1
        //     console.log('Speaking:', responseMessage.content)
        //     window.speechSynthesis.speak(utterance)
        //   }
        // }
        // else {
        //   console.warn('Speech synthesis is not supported in this browser.')
        // }

      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 pr-[60px] sm:rounded-md sm:border sm:px-12">
        <Stopwatch />
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-[calc(100%-30px)] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4">
        <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                onClick={toggleSpeechRecognition}
                className={isListening ? 'bg-primary text-white' : ''}
              >
                <IconMoon /> {/*TODO: Make icon a microphone*/}
                <span className="sr-only">{isListening ? 'Stop listening' : 'Speak message'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isListening ? 'Stop listening' : 'Speak message'}</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={input === ''}>
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}

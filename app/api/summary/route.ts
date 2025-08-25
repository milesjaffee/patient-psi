
import { NextResponse, NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

    console.log("Received data for summary:", data);

    /*const instructionString = `You are a helpful assistant. Your task is to summarize the following psychological chat data in a few sentences. \n
  The summary should be concise and focus on the key points of the conversation, including any significant insights or developments in the patient's condition.\n
  \nChat: ${(data.messages).map((item: { role: string; content: string; }) => (`${item.role[0] == 'u' ? 'Therapist' : 'Patient'}: ${item.content}\n`)).join('')}
    \n(You may reference the patient's psychological profile, but only as supplemental material to the chat. Important: Avoid bringing up items from the profile that have not explicitly been shown in the chat!     

  `;

    console.log("Instructions String for OpenAI:", instructionString);*/
    
    const response = await openai.chat.completions.create({
  model: "gpt-5-nano",
  messages: [
    {
      role: "system",
      content: `You are summarizing a conversation in one paragraph with no line breaks. Follow these rules:
      1. PRIMARY FOCUS: The conversation content (95% weight)
      2. SECONDARY: Background info (5% weight) - use ONLY when conversation is unclear
      3. If background info seems relevant but distracts from main conversation, ignore it
      4. Prioritize what was actually said over contextual assumptions
      5. Your response should be in a single paragraph with no line breaks
      6. Your response should start with "In this conversation, ..."`
    },
    {
      role: "user",
      content: `Conversation: ${(data.messages).map((item: { role: string; content: string; }) => (`${item.role[0] == 'u' ? 'Therapist' : 'Patient'}: ${item.content}\n`)).join('')}
      \n\nContext: ${JSON.stringify(data.ccdTruth)}`
    }
  ]
})

    return NextResponse.json(response);

    //return NextResponse.json(inputString);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
import { Rewind } from 'lucide-react';
import { NextResponse, NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

    console.log("Received data for summary:", data);

    const instructionString = `You are a helpful assistant. Your task is to summarize the following psychological chat data in a few sentences. \n
  The summary should be concise and focus on the key points of the conversation, including any significant insights or developments in the patient's condition.\n
    \n(You may reference the patient's psychological profile, but only as supplemental material to the chat. Important: Avoid bringing up items from the profile that have not explicitly been shown in the chat! ${JSON.stringify(data.ccdTruth)}    
  \nChat: ${(data.messages).map((item: { role: string; content: string; }) => (`${item.role[0] == 'u' ? 'Therapist' : 'Patient'}: ${item.content}\n`)).join('')}`;

    console.log("Instructions String for OpenAI:", instructionString);
    
    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: instructionString,

  }); 

    return NextResponse.json(response);

    //return NextResponse.json(inputString);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
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

    const inputString = `You are a helpful assistant. Your task is to summarize the following psychological chat data. 'U' is the therapist, and 'A' is the patient. The summary should be concise and focus on the key points of the conversation, including any significant insights or developments in the patient's condition.\n
        ${(data.messages).map((item: { role: string; content: string; }) => (`User: ${item.role[0]}, Message: ${item.content}\n`)).join('')}
        \nYou may reference the patient's psychological profile: ${JSON.stringify(data.ccdTruth)}
    `;

    console.log("Input String for OpenAI:", inputString);
    
    /*const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    })

    return NextResponse.json(completion.choices[0].message)*/

    return NextResponse.json(inputString);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { NextResponse, NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

    console.log("Received data for Analysis feedback:", data);

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
      /*content: `You are giving feedback on a therapist's performance in a therapy session. Focus on the therapist's approach message by message, . Follow these rules:
      1. Prioritize what was actually said over contextual assumptions
      2. Your response should be in a single paragraph with no line breaks
      3. Your response should start with "In this conversation, ..."
      4. Assess according to Hill's Helping Skills model - questions, reflections, empathy, suggestions, and session management.`*/

      content: `
      You are giving feedback on a therapist's performance in a therapy session. Return a JSON object with the following parameters:
      Ratings out of 10 for effectiveness, patient satisfaction, sensitivity, question quality, patient's starting distress, resolution level, empowerment, and likelihood to return.
      Freeform short text on what worked well, areas for improvement, cultural considerations, and clear action items given to the patient.

      Format example (COPY THIS JSON FORMAT EXACTLY, ONLY CHANGE NUMBERS AND TEXT, ):
      {
        effectiveness: 7,
        patientSatisfaction: 8,
        sensitivity: 10,
        questionQuality: 5,
        startingDistress: 7,
        resolutionLevel: 4,
        empowerment: 6,
        likelihoodToReturn: 8,
        whatWorkedWell: "Several things the therapist did well.",
        areasForImprovement: "Things the therapist could improve upon; missed opportunities for creating good moments.",
        culturalConsiderations: "Cultural considerations unique to this particular patient's background.",
        actionItems: "A list of specific action items the therapist has given to the patient to act on.",
      }
      `
      
    },
    {
      role: "user",
      content: `Conversation: ${(data.messages).map((item: { role: string; content: string; }) => (`${item.role[0] == 'u' ? 'Therapist' : item.role[0] == 'a' ? 'Patient' : 'SYSTEM'}: ${item.content}\n`)).join('')}
     \n` //+Context: ${JSON.stringify(data.ccdTruth)}
    }
  ]
})

console.log(response);

    return NextResponse.json(response);

    //return NextResponse.json(inputString);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
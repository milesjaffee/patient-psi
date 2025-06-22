import { NextResponse } from 'next/server';
import { getChat } from '@/app/actions';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const chatId = url.searchParams.get('chatId');
  const userId = url.searchParams.get('userId');

  // Validate query parameters
  if (!chatId || !userId) {
    return NextResponse.json({ error: 'Missing chatId or userId' }, { status: 400 });
  }

  // Retrieve the chat data
  const chat = await getChat(chatId, userId);

  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  }

  // Set headers for file download
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Content-Disposition': `attachment; filename="chat-${chatId}.json"`,
  });

  // Send the chat data as JSON
  return new NextResponse(JSON.stringify(chat, null, 2), { headers });
}
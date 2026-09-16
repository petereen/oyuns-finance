import { createDirectus, createItem, rest, staticToken } from '@directus/sdk';
import { NextResponse } from 'next/server';

type MessageInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://api.oyuns.mn';
const directusToken = process.env.DIRECTUS_STATIC_TOKEN;

export async function POST(request: Request) {
  if (!directusToken) {
    console.error('DIRECTUS_STATIC_TOKEN is not configured');
    return NextResponse.json({ error: 'Message service is not configured' }, { status: 503 });
  }

  let body: Partial<MessageInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
  }

  try {
    const client = createDirectus(directusUrl)
      .with(staticToken(directusToken))
      .with(rest());

    await client.request(createItem('messages', {
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || null,
      message: body.message.trim(),
      status: 'new',
    }));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating message in Directus:', error);
    return NextResponse.json({ error: 'Unable to send message' }, { status: 502 });
  }
}

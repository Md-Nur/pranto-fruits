import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import crypto from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

// Helper to hash user data as required by Meta Advanced Matching
function hashData(data?: string) {
  if (!data) return undefined;
  const normalized = data.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

export async function POST(request: Request) {
  if (!PIXEL_ID || PIXEL_ID === 'YOUR_FACEBOOK_PIXEL_ID_HERE' || !ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Facebook CAPI credentials not configured.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { event_name, event_time, event_id, event_source_url, custom_data, user_data } = body;

    // Await headers() and cookies() functions as required in newer Next.js versions
    const headersList = await headers();
    const cookieStore = await cookies();

    // 1. Capture Client IP and User Agent
    const client_ip_address =
      headersList.get('x-forwarded-for')?.split(',')[0] ||
      headersList.get('x-real-ip') ||
      '';
    const client_user_agent = headersList.get('user-agent') || '';

    // 2. Capture First-Party Cookies
    const fbp = cookieStore.get('_fbp')?.value;
    const fbc = cookieStore.get('_fbc')?.value;

    // 3. Prepare User Data (Hash PII)
    // Note: external_id, fbp, fbc, client_ip_address, and client_user_agent should NOT be hashed
    const processedUserData = {
      client_ip_address,
      client_user_agent,
      ...(fbp && { fbp }),
      ...(fbc && { fbc }),
      ...(user_data?.external_id && { external_id: user_data.external_id }), // Usually DB user ID
      ...(user_data?.em && { em: hashData(user_data.em) }),
      ...(user_data?.ph && { ph: hashData(user_data.ph) }),
      ...(user_data?.fn && { fn: hashData(user_data.fn) }),
      ...(user_data?.ln && { ln: hashData(user_data.ln) }),
    };

    // 4. Construct CAPI Payload
    const capiData = [
      {
        event_name: event_name,
        event_time: event_time,
        action_source: 'website',
        event_source_url: event_source_url,
        event_id: event_id, // Crucial for Deduplication
        user_data: processedUserData,
        custom_data: custom_data || {},
      },
    ];

    // 5. Send to Facebook
    const fbResponse = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: capiData }),
      }
    );

    const fbResult = await fbResponse.json();

    if (!fbResponse.ok) {
      console.error('Facebook CAPI Error:', fbResult);
      return NextResponse.json(
        { error: 'Failed to send event to Facebook', details: fbResult },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, event_id });
  } catch (error) {
    console.error('CAPI Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

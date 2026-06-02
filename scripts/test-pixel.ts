import dotenv from 'dotenv';

dotenv.config();

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const TEST_EVENT = process.env.TEST_EVENT;

console.log('--- FB Pixel Configuration Check ---');
console.log('PIXEL_ID:', PIXEL_ID);
console.log('ACCESS_TOKEN:', ACCESS_TOKEN ? `${ACCESS_TOKEN.substring(0, 15)}... (length: ${ACCESS_TOKEN.length})` : 'MISSING');
console.log('TEST_EVENT:', TEST_EVENT || 'MISSING');

if (!PIXEL_ID || PIXEL_ID === 'YOUR_FACEBOOK_PIXEL_ID_HERE') {
  console.error('Error: NEXT_PUBLIC_FACEBOOK_PIXEL_ID is not configured.');
  process.exit(1);
}

if (!ACCESS_TOKEN) {
  console.error('Error: FACEBOOK_ACCESS_TOKEN is not configured.');
  process.exit(1);
}

async function testSendEvent() {
  const event_id = `test_${Date.now()}`;
  const eventTime = Math.floor(Date.now() / 1000);
  
  // Dummy event payload
  const capiData = [
    {
      event_name: 'PageView',
      event_time: eventTime,
      action_source: 'website',
      event_source_url: 'https://www.villageorganicfruits.com/test-pixel',
      event_id: event_id,
      user_data: {
        client_ip_address: '127.0.0.1',
        client_user_agent: 'Antigravity Verification Script',
      },
      custom_data: {
        testing: true,
      },
    },
  ];

  console.log('\nSending test event (PageView) to Meta Graph API...');
  
  const payload = {
    data: capiData,
    ...(TEST_EVENT && { test_event_code: TEST_EVENT }),
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log('\nResponse status from Meta:', response.status);
    console.log('Response body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\nSUCCESS! The event was successfully accepted by Meta.');
      if (TEST_EVENT) {
        console.log(`Please check your Meta Events Manager (Test Events tab) for event code: ${TEST_EVENT}`);
      }
    } else {
      console.error('\nFAILURE: Meta Graph API returned an error.');
    }
  } catch (error) {
    console.error('\nError connecting to Meta Graph API:', error);
  }
}

testSendEvent();

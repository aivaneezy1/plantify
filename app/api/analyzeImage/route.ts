import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    organization: 'org-7OKIVSJRuYz8TFcgIwkoNjz2',
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set
});

export const POST = async (request: NextRequest) => {
  try {
    const { image } = await request.json();

    // Call the OpenAI API with the specified model
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Ensure this is the correct model
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: "What's in this image?" },
            {
              type: 'image_url',
              image_url: {
                url: image, // Dynamically use the image URL from the request
              },
            },
          ],
        },
      ],
    });

    // Check if response has choices and return the first choice
    if (response && response.choices && response.choices.length > 0) {
      return NextResponse.json(response.choices[0]);
    } else {
      return NextResponse.json({ error: 'No choices found in the response' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
  }
};

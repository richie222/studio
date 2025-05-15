import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.PEXELS_API_KEY || process.env.NEXT_PUBLIC_PEXELS_API_KEY;
  const query = 'pets';
  const perPage = 5;

  if (!apiKey) {
    return NextResponse.json({ error: 'Pexels API key not configured. Set PEXELS_API_KEY or NEXT_PUBLIC_PEXELS_API_KEY in your environment variables.' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}`, {
      headers: {
        Authorization: apiKey,
      },
      // Add cache: 'no-store' to prevent caching during development if needed
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Pexels API Error:', response.status, error);
      return NextResponse.json({ error: `Error fetching images from Pexels: ${response.status} - ${error.message || 'Unknown error'}` }, { status: response.status });
    }

    const data = await response.json();
    const imageUrls = data.photos.map((photo: any) => photo.src.large);

    // Return only the first image URL
 return NextResponse.json({ imageUrls});

  } catch (error: any) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong fetching images' }, { status: 500 });
  }
}
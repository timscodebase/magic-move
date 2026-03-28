import type { RequestHandler } from '@sveltejs/kit';
import { PRIVATE_NINJA_QUOTES_API } from '$env/static/private';

export const GET: RequestHandler = async ({ url }) => {
	const categories = (url.searchParams.get('categories') || 'success,wisdom')
		.split(',')
		.map((cat) => cat.trim())
		.join(',');
	const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '10'), 1), 20);

	if (!PRIVATE_NINJA_QUOTES_API) {
		return new Response('API key not set', { status: 500 });
	}

	const response = await fetch(
		`https://api.api-ninjas.com/v2/quotes?categories=${encodeURIComponent(categories)}&limit=${limit}`,
		{
			headers: {
				'X-Api-Key': PRIVATE_NINJA_QUOTES_API
			},
			cache: 'no-store'
		}
	);

	if (!response.ok) {
		return new Response(`Quote API error: ${response.statusText}`, { status: response.status });
	}

	const data = await response.json();
	const quotes = Array.isArray(data) ? data.filter((item) => item && item.quote) : [];
	const selected =
		quotes.length > 0
			? quotes[Math.floor(Math.random() * quotes.length)]
			: { quote: 'No quotes available right now', author: 'Unknown' };

	return new Response(JSON.stringify(selected), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store'
		}
	});
};

import type { RequestHandler } from '@sveltejs/kit';
import { PRIVATE_NINJA_API } from '$env/static/private';

interface QuoteItem {
	quote: string;
	author: string;
}

const quoteCache = new Map<string, { quotes: QuoteItem[]; timestamp: number }>();

export const GET: RequestHandler = async ({ url }) => {
	const categories = (url.searchParams.get('categories') || 'success,wisdom')
		.split(',')
		.map((cat) => cat.trim())
		.join(',');
	const key = categories;
	let quotes: QuoteItem[] = [];
	const cached = quoteCache.get(key);
	if (cached) {
		quotes = cached.quotes;
	}
	if (quotes.length === 0) {
		const fetchLimit = 20;
		if (!PRIVATE_NINJA_API) {
			return new Response('API key not set', { status: 500 });
		}
		const response = await fetch(
			`https://api.api-ninjas.com/v2/quotes?categories=${encodeURIComponent(categories)}&limit=${fetchLimit}`,
			{
				headers: {
					'X-Api-Key': PRIVATE_NINJA_API
				},
				cache: 'no-store'
			}
		);
		if (!response.ok) {
			return new Response(`Quote API error: ${response.statusText}`, { status: response.status });
		}
		const data = await response.json();
		quotes = Array.isArray(data)
			? data.filter(
					(item): item is QuoteItem =>
						item && typeof item.quote === 'string' && typeof item.author === 'string'
				)
			: [];
	}
	const selected =
		quotes.length > 0
			? quotes[Math.floor(Math.random() * quotes.length)]
			: { quote: 'No quotes available right now', author: 'Unknown' };
	if (quotes.length > 0) {
		quotes.splice(quotes.indexOf(selected), 1);
		quoteCache.set(key, { quotes, timestamp: Date.now() });
	}
	return new Response(JSON.stringify(selected), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store'
		}
	});
};

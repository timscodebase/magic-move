import type { RequestHandler } from '@sveltejs/kit';
import { PRIVATE_NINJA_API } from '$env/static/private';

interface UserItem {
	name: string;
	[key: string]: unknown;
}

const userCache = new Map<string, { users: UserItem[]; timestamp: number }>();

export const GET: RequestHandler = async () => {
	let users: UserItem[] = [];
	const cached = userCache.get('users');
	if (cached) {
		users = cached.users;
	}
	if (users.length === 0) {
		const fetchCount = 10;
		if (!PRIVATE_NINJA_API) {
			return new Response('API key not set', { status: 500 });
		}
		const response = await fetch(`https://api.api-ninjas.com/v2/randomuser?count=${fetchCount}`, {
			headers: {
				'X-Api-Key': PRIVATE_NINJA_API
			},
			cache: 'no-store'
		});
		if (!response.ok) {
			return new Response(`User API error: ${response.statusText}`, { status: response.status });
		}
		const data = await response.json();
		users = Array.isArray(data)
			? data.filter((item): item is UserItem => item && typeof item.name === 'string')
			: [];
	}
	const selected =
		users.length > 0
			? users[Math.floor(Math.random() * users.length)]
			: { name: 'No users available right now' };
	if (users.length > 0) {
		users.splice(users.indexOf(selected), 1);
		userCache.set('users', { users, timestamp: Date.now() });
	}
	return new Response(JSON.stringify(selected), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store'
		}
	});
};

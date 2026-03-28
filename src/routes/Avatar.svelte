<script lang="ts">
	import { onMount } from 'svelte';

	type User = {
		img: string;
		name: string;
		email: string;
		phone: string;
		company: string;
		role: string;
	};

	let user = $state<User | null>(null);
	let loading = $state(true);
	let error = $state('');

	async function loadUser(): Promise<void> {
		loading = true;
		error = '';

		try {
			const response = await fetch('/api/random-user', { cache: 'no-store' });
			if (!response.ok) throw new Error(`Failed to fetch user (${response.status})`);

			const data = await response.json();
			user = {
				img: data.avatar || 'https://via.placeholder.com/150',
				name:
					data.name ||
					`${data.first_name || ''} ${data.last_name || ''}`.trim() ||
					data.username ||
					'Unknown',
				email: data.email || '',
				phone: data.cell || data.phone || '',
				company: data.company || '',
				role: data.job || ''
			};
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
			user = null;
		} finally {
			loading = false;
		}
	}

	onMount(loadUser);
</script>

{#snippet avatar({ img, name, email, phone, company, role }: User)}
	<div class="avatar-container">
		<img class="avatar-image" src={img} alt={name} />
		<div class="avatar-info">
			<h3 class="avatar-name">{name}</h3>
			<p class="avatar-email">{email}</p>
			<p class="avatar-phone">{phone}</p>
			<p class="avatar-company">{company}</p>
			<p class="avatar-role">{role}</p>
		</div>
	</div>
{/snippet}

<h2>Random User Avatar</h2>

{#if loading}
	<div class="loading">Loading user...</div>
{:else if error}
	<div class="error">Error: {error}</div>
{:else if user}
	{@render avatar(user)}
{/if}

<style>
	h2 {
		text-align: center;
		margin-bottom: 1rem;
	}
	.avatar-container {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background: #f9f9f9;
		max-width: 400px;
		margin: 1rem auto;
	}

	.avatar-image {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #ccc;
		box-sizing: border-box;
	}

	.avatar-info {
		flex: 1;
	}

	.avatar-name {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 1.2rem;
	}

	.avatar-email,
	.avatar-phone,
	.avatar-company,
	.avatar-role {
		margin: 0.25rem 0;
		color: #666;
		font-size: 0.9rem;
	}

	.avatar-email::before {
		content: '📧 ';
	}

	.avatar-phone::before {
		content: '📞 ';
	}

	.avatar-company::before {
		content: '🏢 ';
	}

	.avatar-role::before {
		content: '👤 ';
	}

	.loading {
		text-align: center;
		padding: 2rem;
		color: #666;
		font-style: italic;
	}

	.error {
		text-align: center;
		padding: 2rem;
		color: #d32f2f;
		background: #ffebee;
		border: 1px solid #ffcdd2;
		border-radius: 4px;
		margin: 1rem auto;
		max-width: 400px;
	}
</style>

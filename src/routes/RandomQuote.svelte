<script lang="ts">
	import { onMount } from 'svelte';

	type Quote = { quote: string; author: string };

	let quote = $state<Quote>({ quote: '', author: '' });
	let loading = $state(true);
	let error = $state('');

	async function loadQuote(): Promise<void> {
		loading = true;
		error = '';

		try {
			const response = await fetch('/api/random-quote', { cache: 'no-store' });
			if (!response.ok) throw new Error(`Failed to fetch quote (${response.status})`);

			const data = await response.json();
			quote = { quote: data.quote ?? '', author: data.author ?? 'Unknown' };
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
			quote = { quote: '', author: '' };
		} finally {
			loading = false;
		}
	}

	onMount(loadQuote);
</script>

<div>
	{#if loading}
		<p>Loading quote...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else}
		<p>"{quote.quote}"</p>
		<p>- {quote.author}</p>
	{/if}

	<button onclick={loadQuote}>New quote</button>
</div>

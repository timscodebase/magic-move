<script lang="ts">
	import { fly, fade } from 'svelte/transition';
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

<div class="container">
	<h2>Random Quote Generator</h2>
	{#if loading}
		<p class="loading">Loading quote...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else}
		<p class="quote" in:fly={{ y: -50, opacity: 0 }} out:fade>"{quote.quote}"</p>
		<p class="author" in:fly={{ y: -50, opacity: 0 }} out:fade>- {quote.author}</p>
	{/if}

	<button onclick={loadQuote}>New quote</button>
</div>

<style>
	.container {
		max-width: 600px;
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #f9f9f9;
		font-family: 'Georgia', serif;
		text-align: center;
	}

	.loading,
	.error {
		font-size: 18px;
		color: #666;
	}

	.error {
		color: #d9534f;
	}

	.quote {
		font-size: 24px;
		font-style: italic;
		color: #333;
		margin: 20px 0;
		line-height: 1.4;
	}

	.author {
		font-size: 18px;
		color: #555;
		margin-bottom: 20px;
		font-weight: bold;
	}

	button {
		padding: 10px 20px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
		margin-top: 10px;
	}

	button:hover {
		background-color: #0056b3;
	}
</style>

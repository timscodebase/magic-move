<script lang="ts">
	import TempConverter from './TempConverter.svelte';
	import PasswordStrength from './PasswordStrength.svelte';
	import RandomQuote from './RandomQuote.svelte';
</script>

<div class="container">
	<h1>Fun Tools</h1>

	<div class="tool-section">
		<TempConverter />
	</div>

	<hr />

	<div class="tool-section">
		<PasswordStrength />
	</div>

	<hr />

	<div class="tool-section">
		<RandomQuote />
	</div>
</div>

<style>
	:global(body) {
		font-family: Arial, sans-serif;
		margin: 0;
		padding: 0;
		background-color: #f4f4f4;
		color: #333;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	h1 {
		text-align: center;
		font-size: 2.5em;
		margin-bottom: 40px;
		color: #007bff;
	}

	.tool-section {
		margin-bottom: 60px;
	}

	hr {
		border: none;
		height: 2px;
		background: linear-gradient(to right, #007bff, #28a745);
		margin: 40px 0;
	}
</style>

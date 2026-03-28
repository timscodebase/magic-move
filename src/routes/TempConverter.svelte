<script lang="ts">
	let celsius = $state(0);

	let fahrenheit = $derived.by(() => (celsius * 9) / 5 + 32);

	function temperatureInput(
		node: HTMLInputElement,
		params: { value: number; onInput: (value: number) => void }
	) {
		const updateValue = () => (node.value = params.value.toString());
		updateValue();

		const handleInput = (e: Event) => {
			const target = e.target as HTMLInputElement;
			params.onInput(+target.value);
		};

		node.addEventListener('input', handleInput);

		return {
			update(newParams: { value: number; onInput: (value: number) => void }) {
				params = newParams;
				updateValue();
			},
			destroy() {
				node.removeEventListener('input', handleInput);
			}
		};
	}
</script>

<div class="container">
	<h2>Temperature Converter</h2>
	<div class="input-group">
		<label for="celsius">Celsius</label>
		<input
			id="celsius"
			type="number"
			use:temperatureInput={{ value: celsius, onInput: (v) => (celsius = v) }}
		/>
	</div>

	<div class="input-group">
		<label for="fahrenheit">Fahrenheit</label>
		<input
			id="fahrenheit"
			type="number"
			use:temperatureInput={{ value: fahrenheit, onInput: (v) => (celsius = ((v - 32) * 5) / 9) }}
		/>
	</div>
</div>

<style>
	.container {
		max-width: 400px;
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #f9f9f9;
		font-family: Arial, sans-serif;
	}

	.input-group {
		margin-bottom: 15px;
	}

	label {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
		color: #333;
	}

	input {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 16px;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
	}
</style>

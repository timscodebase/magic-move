<script lang="ts">
	let password = $state('');
	let strenthPercent = $state(0);
	let strenthDescription = $derived.by(() => {
		if (strenthPercent < 20) return 'Weak: Are you sure?';
		if (strenthPercent < 40) return 'Better: But still weak';
		if (strenthPercent < 60) return 'Medium: Could be stronger';
		if (strenthPercent < 80) return 'Strong: Strong, but crackable';
		return 'Bingo: Very strong password!';
	});

	const calculateStrength = (password: string) => {
		let strength = 0;
		if (password.length > 5) strength += 20;
		if (password.length > 10) strength += 20;
		if (/[A-Z]/.test(password)) strength += 20;
		if (/[0-9]/.test(password)) strength += 20;
		if (/[^A-Za-z0-9]/.test(password)) strength += 20;
		return strength;
	};

	const togglePasswordVisibility = () => {
		const input = document.getElementById('password') as HTMLInputElement;
		input.type = input.type === 'password' ? 'text' : 'password';
	};
</script>

<div class="container">
	<h2>Password Strength Checker</h2>
	<label for="password">Password:</label>
	<input
		id="password"
		type="password"
		bind:value={password}
		oninput={() => (strenthPercent = calculateStrength(password))}
	/>
	<button onclick={togglePasswordVisibility}>Show Password</button>
	<div class="strength-bar">
		<div class="strength-fill" style:width={`${strenthPercent}%`}></div>
	</div>
	<p>Password Strength: {strenthDescription}</p>
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

	label {
		display: block;
		margin-bottom: 8px;
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

	button {
		margin-top: 10px;
		padding: 10px 15px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
	}

	button:hover {
		background-color: #0056b3;
	}

	.strength-bar {
		margin-top: 15px;
		width: 100%;
		height: 20px;
		background-color: #eee;
		border-radius: 5px;
		overflow: hidden;
	}

	.strength-fill {
		height: 100%;
		background-color: #28a745;
		border-radius: 5px;
		transition: width 0.3s ease;
	}

	p {
		margin-top: 15px;
		font-size: 16px;
		color: #333;
	}
</style>

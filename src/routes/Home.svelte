<script lang="ts">
	import { navigateTo } from '$lib/shared/ui/atoms/Router.svelte';
</script>

<div class="home">
	<header>
		<h1>🎲 Event Sourcing Game Collection</h1>
		<p>Experience classic games with time travel and branching timelines!</p>
	</header>

	<div class="games">
		<div class="game-card">
			<h2>🎯 Tic-Tac-Toe</h2>
			<p>Classic 3x3 grid game with event sourcing superpowers</p>
			<div class="features">
				<span class="feature">⚡ Time Travel</span>
				<span class="feature">🌿 Timeline Branching</span>
				<span class="feature">📈 Event History</span>
			</div>
			<button class="play-button" onclick={() => navigateTo('tictactoe')}>
				Play Tic-Tac-Toe
			</button>
		</div>

		<div class="game-card">
			<h2>⚫⚪ Baduk (Go)</h2>
			<p>Strategic board game with territory control</p>
			<div class="features">
				<span class="feature">⚡ Time Travel</span>
				<span class="feature">🌿 Timeline Branching</span>
				<span class="feature">📊 Territory Analysis</span>
			</div>
			<button class="play-button" onclick={() => navigateTo('baduk')}> Play Baduk </button>
		</div>
	</div>
</div>

<style>
	.home {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
	}

	header h1 {
		font-size: 3rem;
		font-weight: bold;
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 1rem;
	}

	header p {
		font-size: 1.25rem;
		color: #6b7280;
	}

	.games {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
		margin-top: 3rem;
	}

	.game-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}

	.game-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	}

	.game-card h2 {
		font-size: 1.875rem;
		font-weight: bold;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	.game-card p {
		color: #6b7280;
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.features {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.feature {
		background: #f3f4f6;
		color: #374151;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.play-button {
		width: 100%;
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 0.75rem;
		font-size: 1.125rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s;
		position: relative;
	}

	.play-button:hover {
		transform: scale(1.02);
		box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
	}

	@media (max-width: 768px) {
		.games {
			grid-template-columns: 1fr;
		}

		header h1 {
			font-size: 2rem;
		}
	}
</style>

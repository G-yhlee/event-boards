<script lang="ts">
	import type { Player } from '$lib/baduk/domain/events/BadukEvents';
	import type { GameStatus } from '$lib/baduk/domain/aggregates/BadukAggregate';

	interface Props {
		currentPlayer: Player;
		status: GameStatus;
		winner?: Player;
		consecutivePasses: number;
		capturedStones: { black: number; white: number };
		komi: number;
		boardSize: number;
	}

	let { currentPlayer, status, winner, consecutivePasses, capturedStones, komi, boardSize }: Props =
		$props();

	let statusMessage = $derived(() => {
		if (status === 'waiting') return 'Click "Start Game" to begin';
		if (status === 'finished') {
			if (winner) return `${winner === 'black' ? 'Black' : 'White'} wins!`;
			return 'Game ended';
		}
		if (status === 'scoring') return 'Calculating final score...';
		if (consecutivePasses === 1) {
			return `${currentPlayer === 'black' ? 'White' : 'Black'} passed. ${currentPlayer === 'black' ? 'Black' : 'White'} to play`;
		}
		return `${currentPlayer === 'black' ? 'Black' : 'White'} to play`;
	});
</script>

<div class="game-status">
	<div class="status-message" class:winner={!!winner}>
		{statusMessage()}
	</div>

	<div class="game-info">
		<div class="board-info">
			<span class="label">Board:</span>
			<span class="value">{boardSize}×{boardSize}</span>
			<span class="label">Komi:</span>
			<span class="value">{komi}</span>
		</div>

		<div class="captures">
			<div class="capture-info">
				<div class="stone-indicator black"></div>
				<span class="label">Captured:</span>
				<span class="value">{capturedStones.black}</span>
			</div>
			<div class="capture-info">
				<div class="stone-indicator white"></div>
				<span class="label">Captured:</span>
				<span class="value">{capturedStones.white}</span>
			</div>
		</div>

		{#if consecutivePasses > 0}
			<div class="pass-info">
				<span class="pass-count"
					>{consecutivePasses} consecutive pass{consecutivePasses > 1 ? 'es' : ''}</span
				>
				{#if consecutivePasses >= 2}
					<span class="game-end-warning">Game will end!</span>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.game-status {
		background: white;
		border-radius: 0.75rem;
		padding: 1.5rem;
		margin: 1rem 0;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.status-message {
		font-size: 1.5rem;
		font-weight: 600;
		text-align: center;
		margin-bottom: 1rem;
		color: #1f2937;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
	}

	.status-message.winner {
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
		animation: celebration 2s ease-in-out;
	}

	.game-info {
		display: grid;
		gap: 1rem;
	}

	.board-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.captures {
		display: flex;
		justify-content: center;
		gap: 2rem;
	}

	.capture-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.stone-indicator {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1px solid #ccc;
	}

	.stone-indicator.black {
		background: radial-gradient(circle at 30% 30%, #555, #000);
	}

	.stone-indicator.white {
		background: radial-gradient(circle at 30% 30%, #fff, #ddd);
	}

	.label {
		font-weight: 500;
		color: #6b7280;
	}

	.value {
		font-weight: 600;
		color: #1f2937;
	}

	.pass-info {
		text-align: center;
		padding: 0.5rem;
		background: #fef3c7;
		border-radius: 0.375rem;
	}

	.pass-count {
		font-weight: 500;
		color: #92400e;
	}

	.game-end-warning {
		display: block;
		font-weight: 600;
		color: #dc2626;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	@keyframes celebration {
		0%,
		100% {
			transform: scale(1);
		}
		25% {
			transform: scale(1.05);
		}
		75% {
			transform: scale(0.95);
		}
	}

	@media (max-width: 768px) {
		.captures {
			flex-direction: column;
			gap: 0.5rem;
		}

		.board-info {
			font-size: 0.875rem;
		}
	}
</style>

<script lang="ts">
	import Button from '../atoms/Button.svelte';

	interface Props {
		onStartGame?: () => void;
		onResetGame?: () => void;
		canStart: boolean;
		canReset: boolean;
	}

	let { onStartGame, onResetGame, canStart, canReset }: Props = $props();
</script>

<div class="controls">
	{#if canStart}
		<Button onclick={onStartGame}>
			{#snippet children()}Start New Game{/snippet}
		</Button>
	{/if}

	{#if canReset}
		<Button onclick={onResetGame} variant="secondary">
			{#snippet children()}Reset Game{/snippet}
		</Button>
	{/if}
</div>

<style>
	.controls {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin: 1rem 0;
	}
</style>

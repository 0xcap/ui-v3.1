<script>

	import { onMount } from 'svelte';

	import Account from './account/Account.svelte'
	import NewOrder from './new-order/NewOrder.svelte'
	import Trades from './trades/Trades.svelte'

	onMount(() => {
		window.scroll(0, 0)
	}) 

</script>

<style>
	.grid {
		display: grid;
		grid-template-rows: auto auto;
		grid-template-columns: 280px 1fr;
		grid-template-areas: 
			"account newOrder"
			"trades trades";
		grid-gap: 8px;
		max-width: var(--container-width);
		margin: 0 auto;
	}
	@media (max-width: 799px) {
		.grid {
			width: 100vw;
			max-width: 100vw;
			margin: 0px 0px;
			overflow-x: hidden;
		}
	}
	@media (max-width: 650px) {
		.grid {
			display: grid;
			grid-template-rows: auto;
			grid-template-columns: 100vw;
			grid-template-areas: 
				"newOrder"
				"account"
				"trades";
			width: 100vw;
			max-width: 100vw;
			margin: 0px 0px;
			overflow-x: hidden;
		}
	}
	.new-order {
		grid-area: newOrder;
		background-color: var(--layer50);
		border: 1px solid var(--layerDark);
	}
	.trades {
		grid-area: trades;
		background-color: var(--layer50);
		border: 1px solid var(--layerDark);
	}
	.account {
		grid-area: account;
		background-color: var(--layer50);
		border: 1px solid var(--layerDark);
	}
</style>

<div class='grid'>
	<div class='account'><Account /></div>
	<div class='new-order'><NewOrder /></div>
	<div class='trades'><Trades /></div>
</div>
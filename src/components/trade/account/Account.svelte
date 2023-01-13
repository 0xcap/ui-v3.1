<script>
	import { onDestroy } from 'svelte';

	import { formatForDisplay } from '@lib/formatters'
	import { address, balance, upl, equity, lockedMargin, freeMargin, marginLevel } from '@lib/stores'

	import tooltip from '@lib/tooltip'

	import { showModal } from '@lib/ui'
	import { getUserBalance, getUserLockedMargin, getUserUpl } from '@api/account'

	let dataTimeout;
	function fetchData() {
		if (!$address) return;
		clearTimeout(dataTimeout)
		getUserBalance();
		getUserLockedMargin();
		getUserUpl();
		dataTimeout = setTimeout(fetchData, 10*1000);
	}

	$: fetchData($address);

	onDestroy(() => {
		clearTimeout(dataTimeout);
	});

</script>

<style>
	.header {
		height: 60px;
		display: flex;
		align-items: center;
		padding: 0 20px;
		border-bottom: 1px solid var(--layerDark);
		font-weight: 600;
	}
	.data {
		display: flex;
		flex-direction: column;
		row-gap: 10px;
		padding: 20px;
	}
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.label, .value {
		font-size: 14px;
	}
	button {
		flex: 50%;
		padding: 10px 5px;
		width: 75%;
	}
	.buttons {
		display: flex;
    	justify-content: space-around;
		align-items: center;
		margin: 0 20px;
		column-gap: 10px;
	}
	.gray {
		background-color: var(--layer200);
		color: white;
	}
	.gray:hover {
		background-color: var(--layer300);
	}
	@media (max-width: 650px) {
		.buttons {
			flex-direction: column;
			margin: 0;
		}
		button {
			flex: 50%;
			margin: 5px 10px;
			padding: 10px 5px;
			width: 90%;
		}
		.account {
			width: 100vw;
		}
		.header {
			padding: 0 10px;
		}
		.data {
			padding: 20px 10px;
		}
		.buttons {
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin: 0 -10px;
			margin-bottom: 10px;
		}
	}
</style>

<div class="account">
	<div class="header">Account</div>
	<div class="data">
		<div class="row">
			<div class="label" use:tooltip={{content: 'Equals Deposits - Withdrawals + Profits or Losses.'}}>Balance</div>
			<div class="value">${formatForDisplay($balance)}</div>
		</div>
		<div class="row">
			<div class="label" use:tooltip={{content: 'Unrealized profit / loss incurred by open positions.'}}>UP/L</div>
			{#if $upl > 0}
				<div class="value green">+${formatForDisplay($upl)}</div>
			{:else if $upl < 0}
				<div class="value red">-${formatForDisplay($upl * -1)}</div>
			{:else}
				<div class="value">${formatForDisplay($upl)}</div>
			{/if}
		</div>
		<div class="row">
			<div class="label" use:tooltip={{content: 'Equals Balance + UP/L.'}}>Equity</div>
			<div class="value">${formatForDisplay($equity)}</div>
		</div>
		<div class="row">
			<div class="label" use:tooltip={{content: 'Margin currently locked in open positions.'}}>Locked Margin</div>
			<div class="value">${formatForDisplay($lockedMargin)}</div>
		</div>
		<div class="row">
			<div class="label" use:tooltip={{content: 'Margin available to open new positions, equal to Equity - Locked Margin.'}}>Free Margin</div>
			{#if $freeMargin >= 0}
				<div class="value">${formatForDisplay($freeMargin)}</div>
			{:else}
				<div class="value">-${formatForDisplay($freeMargin * -1)}</div>
			{/if}
		</div>
		<div class="row">
			<div class="label" use:tooltip={{content: 'Equals Equity / Locked Margin. When < 100%, you can no longer open new positions. When < 20%, your account is liquidated.'}}>Margin Level</div>
			{#if $marginLevel == Infinity || formatForDisplay($marginLevel) >= 100}
				<div class="value green">{$marginLevel == Infinity ? "∞" : `${formatForDisplay($marginLevel)}%`}</div>
			{:else if formatForDisplay($marginLevel) < 100 && formatForDisplay($marginLevel) > 30}
				<div class="value orange">{`${formatForDisplay($marginLevel)}%`}</div>
			{:else if formatForDisplay($marginLevel) <= 30 && formatForDisplay($marginLevel) > 0}
				<div class="value red">{`${formatForDisplay($marginLevel)}%`}</div>
			{:else}
				<div class="value">{`${formatForDisplay($marginLevel)}%`}</div>
			{/if}
		</div>
	</div>
	<div class='buttons'>
		<button class="primary gray" on:click|stopPropagation={() => {showModal('Deposit')}}>Deposit</button>
		<button class="primary gray" on:click|stopPropagation={() => {showModal('Withdraw')}}>Withdraw</button>
	</div>
</div>
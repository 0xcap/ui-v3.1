<script>
	import { onMount } from 'svelte'

	import { CHECKMARK_CIRCLE_ICON, GEAR_ICON } from '@lib/icons'
	import { checkMetamaskSession, switchChains } from '@lib/connect'
	import { address, unsupportedNetwork, chainId } from '@lib/stores'
	import { showModal } from '@lib/ui'
	import { shortAddress } from '@lib/utils'

	import { CHAINDATA } from '@lib/config'

	onMount(async () => {
		await checkMetamaskSession();
	});

	let _chainId = $chainId

	let windowWidth

</script>

<style>

	.connect {
		display: flex;
		align-items: center;
		gap: 10px; 
	}
	.settings {
		margin-left: 20px;
		display: flex;
		align-items: center;
		color: var(--text0);
	}
	.settings:hover {
		color: var(--text100);
	}
	.settings :global(svg) {
		fill: currentColor;
		height: 20px;
	}
	.address {
		display: flex;
		align-items: center;
		justify-content: end;
		text-align: right;
		white-space: nowrap;
		padding: 8px 16px;
		font-weight: 500;
		border-radius: var(--base-radius);
		background-color: var(--layer1);
	}
	.address :global(svg) {
		fill:  var(--primary);
		height: 16px;
		margin-right: 8px;
	}
	.wrong-network {
		color: var(--secondary);
		padding-right: var(--base-padding);
		white-space: nowrap;
		cursor: pointer;
	}
	a.connect {
		color: var(--primary-darkest);
		text-decoration: none;
		padding: 8px 16px;
		border-radius: var(--base-radius);
		transition: all 100ms ease-in-out;
		background-color: var(--primary);
		font-weight: 500;
	}

	@media (max-width: 650px) {
		.connect {
			gap: 6px;
		}
		.address {
			padding: 8px 10px;
		}
		.address :global(svg) {
			margin-right: 4px;
		}
	}

</style>

<svelte:window bind:innerWidth={windowWidth}/>

<div class='connect'>

	<a class='address' on:click|stopPropagation={() => {showModal('ChainSelect')}}>{windowWidth > 650 ? [CHAINDATA[_chainId]['chainName']] : [CHAINDATA[_chainId]['chainNameShort']]}</a>

	{#if $address}
		{#if $unsupportedNetwork}
		<div class='address wrong-network' on:click={() => {switchChains()}}>
			Wrong Network
		</div>
		{:else}
		<div class='address'>
			{@html CHECKMARK_CIRCLE_ICON}
			{shortAddress($address, true)}
		</div>
		{/if}

	{:else}
		<a class='connect' on:click|stopPropagation={() => {showModal('Connect')}}>Connect</a>
	{/if}
</div>
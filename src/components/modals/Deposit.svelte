<script>
	
	import Modal from './Modal.svelte'
	import Input from '@components/layout/Input.svelte'
	import Button from '@components/layout/Button.svelte'

	import { onMount } from 'svelte'

	import { deposit, approveCurrency, getUserAllowance } from '@api/account'
	import { currencyName, allowance, address } from '@lib/stores'
	import { focusInput, hideModal } from '@lib/ui'
	import { getCurrencyInUserWallet } from '@lib/utils'
	import { formatForDisplay } from '@lib/formatters'

	let amount, isSubmitting;

	async function submit() {
		if (!amount) return focusInput('Amount');
		isSubmitting = true;
		const success = await deposit(amount);
		if (success) hideModal();
		isSubmitting = false;
	}

	let userCurrency = 0

	async function getUserCurrency() {
		userCurrency = await getCurrencyInUserWallet($address)
	}

	function setAmountToMax() {
		if (userCurrency > 0)
		{
			amount = userCurrency
		}
	}

	onMount(() => {
		getUserAllowance();
		getUserCurrency();
		focusInput('Amount');
	});

</script>

<style>
	.available-currency {
		margin-top: -6px;
		margin-bottom: 16px;
		display: flex;
	}
	.label {
		display: flex;
		justify-content: flex-start;
		flex-grow: 1;
	}
	.available-amount {
		display: flex;
		justify-content: flex-end;
		flex-grow: 0;
		color: var(--primary);
		cursor: pointer;
	}
</style>

<Modal title='Deposit' width={300}>
	
	<div class='container'>

		<form on:submit|preventDefault={submit}>

		<div class="group">
			<Input label='Amount' bind:value={amount} />
		</div>

		<div class='available-currency'>
			<div class='label'>Wallet Balance:</div>
			<div class='available-amount' on:click={setAmountToMax}>{`${formatForDisplay(userCurrency)} ${$currencyName}`}</div>
		</div>

		<div>
			{#if $allowance * 1 <= amount * 1}
			<Button noSubmit={true} label={`Approve ${$currencyName}`} on:click={approveCurrency} />
			{:else}
			<Button isLoading={isSubmitting} label={`Deposit ${$currencyName}`} />
			{/if}
		</div>

	</form>

	</div>

</Modal>

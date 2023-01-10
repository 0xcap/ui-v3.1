<script>
	
	import Modal from './Modal.svelte'
	import Input from '@components/layout/Input.svelte'
	import Button from '@components/layout/Button.svelte'

	import { onMount } from 'svelte'

	import { withdraw } from '@api/account'
	import { formatForDisplay } from '@lib/formatters'
	import { currencyName, freeMargin } from '@lib/stores'
	import { focusInput, hideModal } from '@lib/ui'

	let amount, isSubmitting;

	async function submit() {
		if (!amount) return focusInput('Amount');
		isSubmitting = true;
		const success = await withdraw(amount);
		if (success) hideModal();
		isSubmitting = false;
	}

	function setAmountToMax() {
      if ($freeMargin * 1 > 0) amount = $freeMargin.toFixed(6)
	}

	onMount(() => {
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

<Modal title='Withdraw' width={280}>
	
	<div class='container'>

		<form on:submit|preventDefault={submit}>

		<div class="group">
			<Input label='Amount' bind:value={amount} />
		</div>

		<div class='available-currency'>
			<div class='label'>Free Margin:</div>
			<div class='available-amount' on:click={setAmountToMax}>{$freeMargin >= 0 ? `$${formatForDisplay($freeMargin)}` : `-$${formatForDisplay($freeMargin) * -1}`}</div>
		</div>

		<div>
			<Button isLoading={isSubmitting} label={`Withdraw ${$currencyName}`} />
		</div>

	</form>

	</div>

</Modal>

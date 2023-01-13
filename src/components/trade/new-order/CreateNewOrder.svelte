<!-- svelte-ignore a11y-click-events-have-key-events -->
<script>
  import { onMount } from "svelte";
  import Button from "@components/layout/Button.svelte";
  import Input from "@components/layout/Input.svelte";
  import Slider from "@components/layout/Slider.svelte";
	import { getUserBalance } from '@api/account'
  import { selectedMarketInfo } from '@lib/stores'
  import { BPS_DIVIDER } from '@lib/config'
	import { selectedMarket, size, price, currencyName, margin, maxSize, tpPrice, slPrice, hasTPSL, isReduceOnly, orderType, isLong } from '@lib/stores'
  import { submitOrder } from '@api/orders'
  import { formatForDisplay } from '@lib/formatters'
  import { showModal } from '@lib/ui'

  let sellLoading, buyLoading;

  onMount(() => {
    getUserBalance()
    price.set()
  });

  async function submitOrderType(type) {
    if ($size == 0) return;
    if (type == 'short') {
      isLong.set(false);
      sellLoading = true;
    } else {
      isLong.set(true);
      buyLoading = true;
    }
    const success = await submitOrder(
      {
        market: $selectedMarket,
        isLong: $isLong,
        margin: $margin,
        size: $size,
        price: $price,
        hasTPSL: $hasTPSL,
        isReduceOnly: $isReduceOnly,
        orderType: $orderType,
        tpPrice: $tpPrice,
        slPrice: $slPrice
      }
    );
    if (success) {
      // reset form
      size.set()
      price.set()
      isReduceOnly.set(false)
      orderType.set(0)
      tpPrice.set()
      slPrice.set()
    }
    sellLoading = false;
    buyLoading = false;
  }
  
  let windowWidth

</script>

<svelte:window bind:innerWidth={windowWidth}/>
<!-- svelte-ignore a11y-missing-attribute -->
<div class="create-new-order">
  <div class='new-order'>  
    <div class="header">
      <div class="max-size-container">
        <div class='max-size-label'>Available:</div>
        <a on:click={() => (size.set($maxSize))}>{formatForDisplay($maxSize)} {$currencyName}</a>
      </div>
      <div class="trigger-tpsl-container">
        <a class='trigger-price' on:click|stopPropagation={() => showModal('TriggerPrice')}>
          {#if $orderType == 0 || !$price || $price == 0}
            {#if windowWidth > 650}
              +Trigger Price
            {:else}
              Set Trigger Price
            {/if}
          {:else}
            {#if windowWidth > 650}
              {#if $orderType == 1}Limit: {$price}{/if}
              {#if $orderType == 2}Stop: {$price}{/if}
            {:else}
              {#if $orderType == 1}<div>Limit Price</div><div>{$price}</div>{/if}
              {#if $orderType == 2}<div>Stop Price</div><div>{$price}</div>{/if}
            {/if}
          {/if}
        </a>
        <a class='tpsl' on:click|stopPropagation={() => showModal('TPSL')}>
          {#if $hasTPSL == false}
            {#if windowWidth > 650}
              +TP/SL
            {:else}
              <div>Set Take Profit</div>
              <div>Set Stop Loss</div>
            {/if}
          {:else}
            {#if windowWidth > 650}
              {`${$tpPrice ? `TP: ${$tpPrice}` : `+TP`} / ${$slPrice ? `SL: ${$slPrice}` : `+SL`}`}
            {:else}
              <div>{`${$tpPrice ? `TP: ${$tpPrice}` : `Set Take Profit`}`}</div><div>{$slPrice ? `SL: ${$slPrice}` : `Set Stop Loss`}</div>
            {/if}
          {/if}
        </a>
      </div>
    </div>
    <div class='input-container'>
      <Input label={`Size (${$currencyName})`} bind:value={$size} />
    </div>
    <div class='buttons'>
        <Button isRed={true} isLoading={sellLoading} on:click={() => submitOrderType('short')} label="Sell/Short" />
        <Button isLoading={buyLoading} on:click={() => submitOrderType('long')} label="Buy/Long" />
    </div>
  </div>
  <div class='margin-fee-container'>
    <div class='margin'>
      <div>Margin:</div>
      <div>{formatForDisplay($margin)} {$currencyName}</div>
    </div>
    <div class='fee'>
      <div>{$selectedMarketInfo.fee ? `Fee (${(100 * $selectedMarketInfo.fee) / BPS_DIVIDER}%)` : 'Fee (---)'}:</div>
      <div>{$selectedMarketInfo.fee ? `${formatForDisplay($size * ($selectedMarketInfo.fee / BPS_DIVIDER))} ${$currencyName}` : `0 ${$currencyName}`}</div>
    </div>
  </div>
</div>

<style>
  a {
    color: var(--primary);
  }
  .header {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: -10px;
    font-weight: 600;
    font-size: 85%;
    justify-content: space-between;
  }
  .max-size-container {
    display: flex;
    flex-direction: row;
  }
  .new-order {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .max-size-label {
    margin-right: 6px;
  }
  .trigger-tpsl-container {
    display: flex;
    flex-direction: row;
    gap: 12px;
  }
  .input-container {
    display: flex;
    flex-direction: row;
  }
	.buttons {
		display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: space-around;
		align-items: center;
	}
  .margin-fee-container {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    gap: 10px;
  }
  .fee {
    display: flex;
    justify-content: space-between;
    flex-basis: 50%;
    width: 150px;
    max-width: 50%;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-right: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .margin {
    display: flex;
    justify-content: space-between;
    flex-basis: 50%;
    width: 150px;
    max-width: 50%;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 650px) {
    .header {
      flex-direction: column;
      font-size: 100%;
      height: auto;
    }
    .margin-fee-container {
      flex-direction: column;
      margin: 6px 10px 6px 10px;
      gap: 0px; 
    }
    .fee {
      max-width: 100%;
      width: auto;
      margin-right: 0px;
    }
    .margin {
      max-width: 100%;
      width: auto;
      margin-left: 0px;
    }
    a {
      color: white;
    }
    .max-size-container,
    .trigger-tpsl-container {
      width: 100%;
      justify-content: center;
      margin-top: 10px;
    }
    .max-size-container {
      background-color: var(--layer200);
      height: 42px;
      justify-self: center;
      align-items: center;
      border-radius: var(--base-radius);
    }
    .trigger-tpsl-container {
      display: flex;
      flex-direction: row;
      gap: 10px;
      margin-bottom: 10px;
    }
    .trigger-price, .tpsl {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-basis: 50%;
      height: 62px;
      background-color: var(--layer200);
      border-radius: var(--base-radius);
      text-align: center;
    }
  }

</style>

<script>
	/* TODO
	- For a boilerplate, see Account.svelte
	- Should display History a list of past positions
		- Orders and Positions should take up 2/3, History 1/3
	- These are pulled from the @apis
	- No sorting or column customization (keeping things simple)
	- History should show direction, market, close price, and P/L. Click on a history item to show all details in a modal.
	*/

  import { onDestroy } from 'svelte';

  import Table from '@components/layout/table/Table.svelte'
  import Row from '@components/layout/table/Row.svelte'
  import Cell from '@components/layout/table/Cell.svelte'

  import { formatMarketName, formatSide, formatUnits, formatDate, formatForDisplay } from '@lib/formatters'
  import { address } from '@lib/stores'
  import { getUserHistory } from '@api/history'
  import { showModal } from "@lib/ui";

  export let allColumns;

  let columns = allColumns;

  let historyItems = []

async function getHistory() {
  try {
    let _history = await getUserHistory()
    if (_history.length > 0)
    {
      historyItems = _history
    }
  } catch (err) {
  console.log(err)
  }
}

let isLoading = true, t;

async function fetchData() {
  clearTimeout(t);
  const done = await getHistory();
  if (done) isLoading = false;
  t = setTimeout(fetchData, 10*1000);
}

$: fetchData($address);

  onDestroy(() => {
      clearTimeout(t);
  });

</script>

  <Table
  columns={columns}
  isLoading={false}
  isEmpty={historyItems.length == 0}
  >
    <div class='history-table'>
      {#each historyItems as history}
      <div class='row' on:click|stopPropagation={() => showModal("HistoryDetails", history)}>
        <Row hasScrollbar={historyItems.length > 4}>
          <Cell>{formatMarketName(history.market)}</Cell>
          {#if history.status == 'liquidated'}
            <Cell hasClass={history.isLong ? 'green' : 'red'}>{`Liquidated ${formatSide(history.isLong)}`}</Cell>
          {:else if history.status == 'executed'}
            {#if history.isReduceOnly}
              <Cell hasClass={!history.isLong ? 'green' : 'red'}>{formatSide(history.isLong, history.isReduceOnly, history.pnl)}</Cell>
            {:else}  
              <Cell hasClass={history.isLong ? 'green' : 'red'}>{`Open ${formatSide(history.isLong)}`}</Cell>
            {/if}
          {:else if history.status == 'cancelled'}
            <Cell hasClass={history.isLong ? 'green' : 'red'}>{`Cancel ${formatSide(history.isLong, history.isReduceOnly, history.pnl)}`}</Cell>
          {/if}
          <Cell>{formatForDisplay(formatUnits(history.price, 18))}</Cell>
          {#if Number(formatUnits(history.pnl,6)) == 0}
            {#if history.isReduceOnly}
              {#if history.status == 'cancelled'}
              <Cell>-</Cell>
              {:else}
              <Cell>{formatForDisplay(formatUnits(history.pnl, 6))}</Cell>
              {/if}
            {:else}
              <Cell>-</Cell>
            {/if}
          {:else}
            <Cell hasClass={history.pnl >= 0 ? 'green' : 'red'}>{#if history.pnl > 0}+{/if}{formatForDisplay(formatUnits(history.pnl, 6))}</Cell>
          {/if}
        </Row>
      </div>
      {/each}
    </div>
  </Table>

<style>

@media (max-width: 650px) {
	.history-table {
		width: 100vw;
		overflow-x: auto;
	}
}

  .row {
    user-select: none;
  }

  .row:hover {
    background-color: var(--layer100);
    cursor: pointer;
  }

</style>
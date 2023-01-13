<script>
	/* TODO
	- For a boilerplate, see Account.svelte
	- Should display Positions
		- Orders and Positions should take up 2/3, History 1/3
	- These are pulled from the @apis
	- No sorting or column customization (keeping things simple)
	- Position should show the market, direction, entry price, size, and P/L, as well as X to close. Click on a position to show all details in a modal.
		- The UPLs are pulled directly from the contract (in @api/positions: getUserPositionsWithUpls). No need to calculate them client side.
	*/

	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store'
    import { address, positions } from '@lib/stores'
    import { getUserPositionsWithUpls } from '@api/positions'
    import { formatUnits, formatDate, formatSide, formatForDisplay, formatMarketName } from '@lib/formatters'
    import { XMARK_ICON, PENCIL_ICON } from '@lib/icons'
    import { DEFAULT_POSITIONS_SORT_KEY } from '@lib/config'

	import { showModal } from '@lib/ui'

    import Table from '@components/layout/table/Table.svelte'
	import Row from '@components/layout/table/Row.svelte'
	import Cell from '@components/layout/table/Cell.svelte'

    export let allColumns;

	let isLoading = true, t;

	async function fetchData() {
		clearTimeout(t);
		const done = await getUserPositionsWithUpls();
		if (done) isLoading = false;
		t = setTimeout(fetchData, 5*1000);
	}

	$: fetchData($address);

	let sortKey = "timestamp"

	let columns = allColumns

	onDestroy(() => {
		clearTimeout(t);
	});
	
</script>

<Table
	columns={columns}
	isLoading={false}
	isEmpty={$positions.length == 0}
>
  <div class='positions'>
	{#each $positions as position}
		<Row hasScrollbar={$positions.length > 4}>
			<Cell>{formatDate(position.timestamp)}</Cell>
			<Cell hasClass={position.isLong ? 'green' : 'red'}>{formatSide(position.isLong)}</Cell>
			<Cell><a href={`/trade/${position.market}`}>{formatMarketName(position.market)}</a></Cell>
			<Cell>{formatForDisplay(formatUnits(position.price, 18))}</Cell>
			<Cell>${formatForDisplay(formatUnits(position.size, 6))}</Cell>
			<Cell>${formatForDisplay(formatUnits(position.margin, 6))}</Cell>
			<Cell hasClass={position.upl >= 0 ? 'green' : 'red'}>{#if position.upl > 0}+{/if}{formatForDisplay(formatUnits(position.upl, 6))}</Cell>
			<!--<Cell>{formatForDisplay(position.fundingTracker)}</Cell>-->
			<Cell isTools={true}>
						<!--<a >{@html PENCIL_ICON}</a>-->
				<a on:click|stopPropagation={() => { showModal('ClosePosition', position) }}>{@html XMARK_ICON}</a>
			</Cell>
		</Row>
	{/each}
	</div>
</Table>

<style>

a {
		color: var(--primary);
		text-decoration: none;
}

@media (max-width: 650px) {
	.positions {
		width: 800px;
	}
}

</style>

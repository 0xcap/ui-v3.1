<script>
  import { getChainlinkPriceHistory } from "@api/markets";
  import { onMount } from "svelte";
  import { formatUnits } from '@lib/formatters';
  import { getLatestBlock, delay } from '@lib/utils';
  import { selectedMarketInfo, chainId } from "@lib/stores"
  import { LOADING_ICON } from '@lib/icons'

  import { CHAINDATA } from '@lib/config'

  import { createChart } from 'lightweight-charts';
 
  let chart
  let chartContainer
  let areaSeries
  let currentSymbol
  let lastChartUpdateTimestamp = 0
  let loadingChart
  let currentPrice


	onMount(async () => {

    loadingChart = true

    chartContainer = document.getElementById('lightweight-graph')
    chart = createChart(chartContainer,
    {
      layout: {
            background: { color: '#24292e' },
            textColor: '#DDD',
        },
        grid: {
            vertLines: { visible: false }, //maybe #16191c
            horzLines: { visible: false }, //maybe #16191c
        },
    }
    )

    areaSeries = chart.addAreaSeries({
      topColor: 'rgba( 7, 201,255, 0.6)',
      bottomColor: 'rgba( 7, 201,255, 0)',
      lineColor: '#07C9FF'
    })

    chart.priceScale().applyOptions({
      borderColor: '#1e2226',
    });

    chart.timeScale().applyOptions({
      borderColor: '#444444',
      timeVisible: false,
      secondsVisible: false,
      fixLeftEdge: true,
      fixRightEdge: true,
      visible: false,
    });

    getChartData()

  });

  async function getChartData() {

    let currentTime = Date.now() / 1000
    let marketAtStart = $selectedMarketInfo.symbol

    if (currentSymbol !== $selectedMarketInfo.symbol || ((currentTime - lastChartUpdateTimestamp) > 60))
    {
      try {

        let priceHistory = await getChainlinkPriceHistory(
          CHAINDATA[$chainId]['chainlinkContracts'][$selectedMarketInfo.symbol]
        );

        if (!priceHistory) return;

        priceHistory = priceHistory.priceHistory.nodes;
        priceHistory.reverse()

        let latestBlock = await getLatestBlock()
        let latestBlockNumber = latestBlock.number
        let latestBlockTimestamp = latestBlock.timestamp
        let averageBlockTime = 0.4; //2 blocks/s on arbitrum at the moment

        areaSeries.setData([])

        for (let i = 0; i < priceHistory.length; i++)
        {
          let historyBlockNumber = Number(priceHistory[i].blockNumber)
          let blockDiff = latestBlockNumber - historyBlockNumber
          let timeDiff = Math.floor(blockDiff * averageBlockTime)
          let estimatedHistoryTimestamp = latestBlockTimestamp - timeDiff
          let dataPoint = {
            time: estimatedHistoryTimestamp,
            value: Number(formatUnits(priceHistory[i].latestAnswer, 8))
          }
          areaSeries.update(dataPoint)
          chart.timeScale().fitContent();
        }

        if (marketAtStart !== $selectedMarketInfo.symbol)
        {
          currentSymbol = null
          getChartData()
        }
        else
        {
          currentSymbol = $selectedMarketInfo.symbol
          lastChartUpdateTimestamp = Date.now() / 1000
          loadingChart = false
        }

      } catch (err) {
      console.log(err);
      }
    }
  }

  function setLoadingChart() {

    if (!currentSymbol)
    {
      currentSymbol = $selectedMarketInfo.symbol
    }
    
    if (currentSymbol !== $selectedMarketInfo.symbol)
    {
      loadingChart = true
    }

  }

  $: getChartData($selectedMarketInfo.symbol)
  $: setLoadingChart($selectedMarketInfo.symbol)

  window.onresize = function() {
        chartContainer = document.getElementById('lightweight-graph')
        
        if (window.screen.availWidth >= 800)
        {
          chart.applyOptions({ 
              width: 510,
          });
        }

        if (window.screen.availWidth < 800 && window.screen.availWidth > 650)
        {
          chart.applyOptions({ 
              width: (window.screen.availWidth -  289),
          });
        }

        if (window.screen.availWidth <= 650)
        {
          chart.applyOptions({ 
              width: window.screen.availWidth
          });
        }
        
        chart.timeScale().fitContent();
  }

  async function quickChartUpdate() {
    lastChartUpdateTimestamp = 0
    await delay(1000) //delay by a second to increase chances of chart update containing the latest price
    getChartData()
    currentPrice = $selectedMarketInfo.price
  }

  $: if ($selectedMarketInfo.price !== currentPrice) {
        quickChartUpdate()
      }

</script>

<!--<svg on:mousemove={onMouseMove} on:mouseleave={() => activeIndex = null}>
  <g>
		<path class="path-line-longs" d={linePath} />
		<path class="path-area-longs" d={areaPath} fill="url(#chart-line)"/>
	</g>
  {#if activeIndex > 0}
    <circle cx={xScale(activeIndex)} cy={yScale(pointsY[activeIndex])} r="4" class="active-circle"/>
    <rect x={toolTipCoords()[0] - 50} y={toolTipCoords()[1]} />      
    <text x={toolTipCoords()[0]} y={toolTipCoords()[1]} dy="1em" text-anchor="middle" fill="red">${(pointsY[activeIndex] || 0).toFixed(2)}</text>
  {/if}
	<linearGradient id="chart-line"gradientTransform="rotate(90)">
		<stop offset="50%" stop-color="var(--primary)" />
		<stop offset="90%" stop-color="var(--layer50)" />
	</linearGradient>
</svg> -->

<div class={loadingChart ? 'loading' : 'spinner-hidden'}>
  <span class='spinner'>{@html LOADING_ICON}</span>
</div>
<div class={loadingChart ? 'chart-hidden' : 'chart'} id='lightweight-graph'></div>
<style>
  .chart {
    margin-right: -1px;
    margin-bottom: 0px;
		min-height: 100px;
  }
  .chart-hidden {
    height: 0px;
		visibility: collapse;
  }
  .spinner-hidden {
    visibility: hidden;
    height: 0px;
  }
  .spinner {
    width: 42px;
  }
  .loading {
		min-height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

</style>
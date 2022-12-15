import { ethers } from 'ethers'
import { Alchemy } from "alchemy-sdk"
import { get } from 'svelte/store'
import { EVENT_ABIS } from '@lib/abis'
import { getContract } from '@lib/contracts'
import { address } from '@lib/stores'
import { getUserOrders, orderSubmitted, closeOrderSubmitted } from '@api/orders'
import { getUserPositionsWithUpls } from '@api/positions'
import { getPoolBalance, getUserPoolBalance } from '@api/pool'
import { showToast } from '@lib/ui'
import { getChainData } from '@lib/utils'

let eventCache = {};

function inCache(log) {
	if (!log || !log.transactionHash) return false;
	if (eventCache[`${log.transactionHash}:${log.transactionIndex}`]) return true;
	eventCache[`${log.transactionHash}:${log.transactionIndex}`] = true;
	return false;
}

export async function listenToEvents() {

	const alchemySettings = getChainData('alchemy');
	if (!alchemySettings) return;
	const alchemy = new Alchemy({network: alchemySettings.wsNetwork, apiKey: alchemySettings.key});

	//const ws = ethers.providers.AlchemyProvider.getWebSocketProvider(ALCHEMY_SETTINGS.network, ALCHEMY_SETTINGS.apiKey);

	const ws = alchemy.ws;

	// console.log('p', ws);

	// ws.removeAllListeners();

	const _address = get(address);
	if (!_address) return;

	let iface = new ethers.utils.Interface(EVENT_ABIS)

	// const orders = await getContract('Orders');
	// ws.on(orders.filters.OrderCreated(null, _address), (log) => {
	// 	// console.log('log', log);
	// 	if (inCache(log)) return;
	// 	getUserOrders();
	// 	const parsedLog = iface.parseLog(log);
	// 	if (parsedLog?.args?.isReduceOnly) {
	// 		closeOrderSubmitted();
	// 	} else {
	// 		orderSubmitted();
	// 	}
	// });
	// ws.on(orders.filters.OrderCancelled(null, _address), (log) => {
	// 	if (inCache(log)) return;
	// 	getUserOrders();
	// });

	// const positions = await getContract('Positions');
	// ws.on(positions.filters.PositionIncreased(null, _address), (log) => {
	// 	if (inCache(log)) return;
	// 	getUserPositionsWithUpls();
	// 	getUserOrders();
	// 	const parsedLog = iface.parseLog(log);
	// 	// console.log('parsedLog', parsedLog);
	// 	if (parsedLog?.args?.size) {
	// 		if (parsedLog.args.size.eq(parsedLog.args.positionSize)) {
	// 			showToast('Position Opened.', 1);
	// 			return;
	// 		}
	// 	}
	// 	showToast('Position Increased.', 1);
	// });
	// ws.on(positions.filters.PositionDecreased(null, _address), (log) => {
	// 	if (inCache(log)) return;
	// 	getUserPositionsWithUpls();
	// 	getUserOrders();
	// 	const parsedLog = iface.parseLog(log);
	// 	if (parsedLog?.args?.size) {
	// 		if (parsedLog.args.positionSize.isZero()) {
	// 			showToast('Position Closed.', 1);
	// 			return;
	// 		}
	// 	}
	// 	showToast('Position Decreased.', 1);
	// });

	// const processor = await getContract('Processor');
	// ws.on(processor.filters.PositionLiquidated(_address), (log) => {
	// 	if (inCache(log)) return;
	// 	getUserPositionsWithUpls();
	// 	showToast('Position Liquidated.', 1);
	// });

	// const pool = await getContract('Pool');
	// ws.on(pool.filters.PoolPayIn(), (log) => {
	// 	if (inCache(log)) return;
	// 	getPoolBalance();
	// 	getUserPoolBalance();
	// });
	// ws.on(pool.filters.PoolPayOut(), (log) => {
	// 	if (inCache(log)) return;
	// 	getPoolBalance();
	// 	getUserPoolBalance();
	// });

}
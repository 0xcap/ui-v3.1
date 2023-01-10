// Error strings

const DEFAULT_ERROR = "Unidentified error. Check browser console or show details for more.";

const ERROR_STRINGS = {
	'user denied': null,
	'user rejected': null,
	'insufficient balance': "You have insufficient funds to complete this transaction.",
	'exceeds balance': "You have insufficient funds to complete this transaction.",
	'allowance': "You have to approve spending this ERC20 before depositing.",
	'!amount': 'Amount is required.',
	'!market': 'Market does not exist.',
	'!equity': 'Not enough equity available.',
	'!margin': 'Not enough free margin available.',
	'!min-size': 'The order size is below the minimum size ($20).',
	'!chainlink': 'Chainlink is unavailable.',
	'!orderType': 'The order type or price is incorrect relative to the market price.',
	'!user': 'User is unauthorized.',
	'!market-order': 'Cannot update or cancel market order.',
	'!position': 'Position not found.',
	'!price': 'Price is unavailable.',
	'pnl < 0': 'Only positive UP/L positions can be closed without profit.',
	'!empty': 'Pool is empty.',
	'!pool-balance': 'Not enough balance is available in the pool.',
	'gas': "Insufficient funds or gas. Deposit more funds into your wallet or try adjusting the gas limit.",
	'nonce': 'Invalid transaction nonce. Please try again or try resetting your Metamask account.',
	'insufficienttxfunds': "You don't have enough funds to complete this transaction."
};

export function parseError(e) {
	console.log('e', typeof(e), e);
	if (!e) return DEFAULT_ERROR;
	if (typeof(e) == 'string') return e;
	let error_string = '';
	if (e.data && e.data.message) {
		error_string = e.data.message;
	} else if (e.message) {
		error_string = e.message;
	} else {
		return DEFAULT_ERROR;
	}
	error_string = error_string.toLowerCase();
	for (const key in ERROR_STRINGS) {
		if (error_string.includes(key)) return ERROR_STRINGS[key];
	}
	console.error(e);
	return DEFAULT_ERROR;
}

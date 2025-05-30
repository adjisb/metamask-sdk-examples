import {Address} from "viem";

const abi = [{
    "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
    "name": "SafeERC20FailedOperation",
    "type": "error"
}, {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "balances",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "contract IERC20",
        "name": "tokenAddress",
        "type": "address"
    }, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "lock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "contract IERC20", "name": "tokenAddress", "type": "address"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}]

export const FakeStacking = {
    abi,
    address: "0xCB0ce37DE72c97A7c8f6977D9d2310Bf361009dA" as Address
}
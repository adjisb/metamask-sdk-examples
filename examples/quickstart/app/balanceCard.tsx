import * as React from 'react'
import {useAccount, useReadContracts, useWriteContract} from 'wagmi'
import {FakeStacking} from "@/app/contracts/FakeStacking";
import {Sand} from "@/app/contracts/Sand";
import {formatEther} from "viem";

export function BalanceCard() {
    const {data: hash} = useWriteContract()
    const account = useAccount();
    const {data: balances, isError: isBalanceError, isLoading: isBalanceLoading} = useReadContracts({
        contracts: [{
            abi: Sand.abi,
            address: Sand.address,
            functionName: "balanceOf",
            args: [account.address],
        }, {
            abi: FakeStacking.abi,
            address: FakeStacking.address,
            functionName: "balances",
            args: [account.address],
        }, {
            abi: Sand.abi,
            address: Sand.address,
            functionName: "allowance",
            args: [account.address, FakeStacking.address],
        },
        ],
        query: {
            enabled: !!account,
        },
    });
    const results = balances?.map(b => (b.result ? formatEther(b.result as bigint) : 0n).toString());
    return (
        <div className="grid grid-cols-2 gap-4">
            {hash && <div className="col-span-2 p-3 bg-gray-100 rounded-md">Last Transaction Hash: {hash}</div>}
            {isBalanceError ? (
                <div className="col-span-2 p-3 bg-red-100 rounded-md">Error getting balance</div>
            ) : isBalanceLoading ? (
                <div className="col-span-2 p-3 bg-gray-100 rounded-md">Loading balance</div>
            ) : (
                <>
                    <div className="p-3 bg-gray-100 rounded-md">
                        <div className="text-sm text-gray-500">Sand balance</div>
                        <div className="font-medium">{results && results[0]}</div>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-md">
                        <div className="text-sm text-gray-500">Staking balance</div>
                        <div className="font-medium">{results && results[1]}</div>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-md">
                        <div className="text-sm text-gray-500">Allowance for fake staking</div>
                        <div className="font-medium">{results && results[2]}</div>
                    </div>
                </>
            )}
        </div>)
}
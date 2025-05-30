import * as React from 'react'
import {useState} from 'react'
import {type BaseError, useAccount, useWaitForTransactionReceipt, useWriteContract} from 'wagmi'
import {EIP7702StatelessDeleGator, encodeExecutions, ModeCodeBatchTry} from "@/app/contracts/EIP7702StatelessDeleGator";
import {Button} from "@/components/ui/button";
import {encodeFunctionData, parseEther, toFunctionSelector} from "viem";
import {Sand} from "@/app/contracts/Sand";
import {FakeStacking} from "@/app/contracts/FakeStacking";

export function TransactionCard() {
    const [amount, setAmount] = useState("123");
    const account = useAccount();
    const {
        data: hash,
        error,
        isPending: isTxPending,
        writeContract
    } = useWriteContract()

    async function approveAndLockAction() {
        if (!account || !account.address) {
            return;
        }
        const a = parseEther(amount);
        const executionCallData = encodeExecutions([
            {
                target: Sand.address,
                callData: encodeFunctionData({
                    abi: Sand.abi,
                    functionName: 'approve',
                    args: [FakeStacking.address, a],
                }),
            },
            {
                target: FakeStacking.address,
                callData: encodeFunctionData({
                    abi: FakeStacking.abi,
                    functionName: 'lock',
                    args: [Sand.address, a],
                }),
            }
        ]);
        // don't let me send data for EOA
        writeContract({
            address: account.address,
            abi: EIP7702StatelessDeleGator.abi,
            functionName: toFunctionSelector('execute(bytes32,bytes)'),
            args: [ModeCodeBatchTry, executionCallData],
        })
    }

    async function approveAction() {
        if (!account || !account.address) {
            return;
        }
        writeContract({
            address: Sand.address,
            abi: Sand.abi,
            functionName: 'approve',
            args: [FakeStacking.address, parseEther(amount)],
        })
    }

    async function lockAction() {
        if (!account || !account.address) {
            return;
        }
        writeContract({
            address: FakeStacking.address,
            abi: FakeStacking.abi,
            functionName: 'lock',
            args: [Sand.address, parseEther(amount)],
        })
    }

    async function withdrawAction() {
        if (!account || !account.address) {
            return;
        }
        writeContract({
            address: FakeStacking.address,
            abi: FakeStacking.abi,
            functionName: 'withdraw',
            args: [Sand.address],
        })
    }

    const {isLoading: isConfirming, isSuccess: isConfirmed} =
        useWaitForTransactionReceipt({
            hash,
        })
    const isPending = isTxPending || !account || !account.address;
    const buttons: { [title: string]: () => void } = {
        Withdraw: withdrawAction,
        Approve: approveAction,
        Lock: lockAction,
    }
    return (
        <div className="max-w-md mx-auto p-6 space-y-6 rounded-lg border border-gray-200">
            <form onSubmit={approveAndLockAction} className="flex flex-col space-y-4">
                <label htmlFor="amount" className="text-sm font-medium">Amount</label>
                <input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="0"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border rounded-md"
                />
                {(hash || isConfirmed || isConfirmed) &&
                    <div className="space-y-2 text-sm rounded-lg border border-gray-200 p-4">
                        {hash && <div className="p-2 bg-gray-50 rounded">Transaction Hash: {hash}</div>}
                        {isConfirming && <div className="text-yellow-600">Waiting for confirmation...</div>}
                        {isConfirmed && <div className="text-green-600">Transaction confirmed.</div>}
                    </div>
                }
                {error &&
                    <div className="space-y-2 text-sm rounded-lg border border-gray-200 p-4 text-red-600">
                        Error: {(error as BaseError).shortMessage || error.message}
                    </div>
                }
                {Object.keys(buttons).map(t => (<Button
                    disabled={isPending}
                    type="button"
                    onClick={buttons[t]}
                    className={`w-full ${isPending ? 'bg-gray-400' : ''}`}
                    key={t}
                >
                    {isPending ? 'Wait...' : t}
                </Button>))}
            </form>
        </div>)
}
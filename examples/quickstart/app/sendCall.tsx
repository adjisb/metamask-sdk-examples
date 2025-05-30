import * as React from 'react'
import {useState} from 'react'
import {type BaseError, useAccount, useSendCalls, useWaitForCallsStatus} from 'wagmi'
import {Button} from "@/components/ui/button";
import {encodeFunctionData, parseEther} from "viem";
import {Sand} from "@/app/contracts/Sand";
import {FakeStacking} from "@/app/contracts/FakeStacking";


export function SendCall() {
    const [amount, setAmount] = useState("123");
    const account = useAccount();

    const {
        data,
        error,
        isPending: isTxPending,
        sendCalls
    } = useSendCalls();

    async function sendCallAction() {
        if (!account || !account.address) {
            return;
        }
        const a = parseEther(amount);
        sendCalls({
            account: account.address,
            calls: [
                {
                    to: Sand.address,
                    data: encodeFunctionData({
                        abi: Sand.abi,
                        functionName: 'approve',
                        args: [FakeStacking.address, a],
                    }),
                },
                {
                    to: FakeStacking.address,
                    data: encodeFunctionData({
                        abi: FakeStacking.abi,
                        functionName: 'lock',
                        args: [Sand.address, a],
                    }),
                }
            ]
        })
    }

    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForCallsStatus({id: data?.id})
    const isPending = isTxPending || !account || !account.address;
    return (
        <div className="max-w-md mx-auto p-6 space-y-6 rounded-lg border border-gray-200">
            <form onSubmit={sendCallAction} className="flex flex-col space-y-4">
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
                {(data || isConfirmed || isConfirmed) &&
                    <div className="space-y-2 text-sm rounded-lg border border-gray-200 p-4">
                        {data && <div className="p-2 bg-gray-50 rounded">Transaction Hash: {data.id}</div>}
                        {isConfirming && <div className="text-yellow-600">Waiting for confirmation...</div>}
                        {isConfirmed && <div className="text-green-600">Transaction confirmed.</div>}
                    </div>
                }
                {error &&
                    <div className="space-y-2 text-sm rounded-lg border border-gray-200 p-4 text-red-600">
                        Error: {(error as BaseError).shortMessage || error.message}
                    </div>
                }
                <Button
                    disabled={isPending}
                    type="button"
                    onClick={sendCallAction}
                    className={`w-full ${isPending ? 'bg-gray-400' : ''}`}
                >
                    {isPending ? 'Wait...' : 'Send call'}
                </Button>
            </form>
        </div>)
}
"use client"
import Capabilities from "@/app/capabilities";
import {BalanceCard} from "@/app/balanceCard";
import {TransactionCard} from "@/app/transactionCard";
import * as React from "react";
import {Sand} from "@/app/contracts/Sand";
import {FakeStacking} from "@/app/contracts/FakeStacking";
import {useAccount} from "wagmi";
import {SendCall} from "@/app/sendCall";


export default function Home() {
    const account = useAccount();
    return (
        <main className="">
            <div className="flex flex-col gap-8 items-center sm:items-start w-full px-3 md:px-0">
                <section className="flex flex-col items-center md:flex-row gap-10 w-full justify-center max-w-5xl">
                    <div className="flex flex-col gap-10">
                        <div className="max-w-md mx-auto p-6 space-y-6 rounded-lg border border-gray-200">
                            <BalanceCard/>
                            <SendCall/>
                            <TransactionCard/>
                        </div>
                        <Capabilities/>
                        <div className="p-3 bg-gray-100 rounded-md">
                            <div className="text-sm text-gray-500">Sand Address</div>
                            <div className="font-medium truncate">{Sand.address}</div>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-md">
                            <div className="text-sm text-gray-500">Fake Staking</div>
                            <div className="font-medium truncate">{FakeStacking.address}</div>
                        </div>
                        <div className="col-span-2 p-3 bg-gray-100 rounded-md">
                            <div className="text-sm text-gray-500">Account</div>
                            <div className="font-medium truncate">{account.address}</div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

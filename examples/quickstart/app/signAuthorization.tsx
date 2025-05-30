import {useAccount, useWalletClient} from "wagmi"
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {METAMASK_DELEGATOR} from "@/wagmi.config";
import {hashAuthorization} from "viem/experimental";

export default function SignAuthorization() {
    const {isPending, data: walletClient} = useWalletClient()
    const [authorization, setAuthorization] = useState("");

    async function handleSend() {
        if (walletClient) {
            const authorization = await walletClient.prepareAuthorization({
                contractAddress: METAMASK_DELEGATOR,
            })
            const hash = hashAuthorization(authorization);
            console.log(authorization, hash);
            const signedAuthorization = await walletClient.signAuthorization(authorization)
            setAuthorization(JSON.stringify(signedAuthorization));
        }
    }


    return (<div>
            <Button
                onClick={handleSend}
                disabled={isPending}
            >
                {isPending ? "Pending..." : "Sign Authorization"}
            </Button>
            {authorization && (<div>AUTORIZATION: {authorization}</div>)}
        </div>
    );
}

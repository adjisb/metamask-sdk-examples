import {useCapabilities, useChainId} from "wagmi"

export default function Capabilities() {
    const chainId = useChainId(); // must be bigint

    const result = useCapabilities();
    if (!result || result.isError) {
        return <div className="p-4 border rounded-lg shadow-sm text-red-500">Error ${JSON.stringify(result.error)}</div>
    }

    return (<div className="p-4 border rounded-lg shadow-sm">
    {(!result.isSuccess || !result.data)
            ? <>Getting capabilities, wait...</>
            : <>Capabilities: {JSON.stringify(result.data[chainId])}</>
        }
    </div>)
}
import {cookieStorage, createConfig, createStorage, http} from "wagmi";
import {mainnet, polygon, polygonAmoy, sepolia} from "wagmi/chains";
import {metaMask} from "wagmi/connectors";

export const METAMASK_DELEGATOR = "0x63c0c19a282a1b52b07dd5a65b58948a07dae32b"

export function getConfig() {
    return createConfig({
        chains: [sepolia, polygonAmoy, mainnet, polygon],
        connectors: [metaMask()],
        ssr: true,
        storage: createStorage({
            storage: cookieStorage,
        }),
        transports: {
            [sepolia.id]: http(),
            [polygonAmoy.id]: http(),
            [mainnet.id]: http(),
            [polygon.id]: http(),
        },
    });
}

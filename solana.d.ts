// import { PhantomProvider } from '@solana/wallet-adapter-react';

// declare global {
//     interface Window {
//         solana?: PhantomProvider;
//     }
// }

interface SolanaProvider {
    connect: () => Promise<{ publicKey: any }>;
    disconnect: () => Promise<void>;
    signTransaction: (transaction: any) => Promise<any>;
    // Add other methods or properties you expect from the wallet
}

declare global {
    interface Window {
        solana?: SolanaProvider;
    }
}
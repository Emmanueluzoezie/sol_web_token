import Image from 'next/image'
import { Inter } from 'next/font/google'
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useState } from 'react';
import axios from "axios"

const inter = Inter({ subsets: ['latin'] })

interface SolanaProvider {
  connect: () => Promise<{ publicKey: any }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (transaction: any) => Promise<any>;
  publicKey: PublicKey;
  isConnected: boolean;
}

declare global {
  interface Window {
    solana?: SolanaProvider;
  }
}

export default function Home() {

  async function withdrawSOL() {
    let connection = new Connection(clusterApiUrl("devnet"))
    if (!window.solana) {
      console.error('Solana wallet extension not found');
      return;
    }

    if (!window.solana.isConnected) {
      try {
        await window.solana.connect();
        console.log(`Connected to wallet with public key: ${window.solana.publicKey.toString()}`);
      } catch (err) {
        console.error('Error connecting to wallet:', err);
        return;
      }
    }

    try {
      console.log(`transac:: ${window.solana.publicKey.toString()}`)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(window.solana.publicKey.toString()),
          toPubkey: new PublicKey("Emmy6u14ge99Xxck9EaVLF2KFt4eLrNVDBqdKwgbznu2"),
          lamports: 0.3 * LAMPORTS_PER_SOL
        })
      );

      // Fetch and assign the recent blockhash
      const recentBlockhash = await connection.getRecentBlockhash();
      transaction.recentBlockhash = recentBlockhash.blockhash;

      // Set the transaction fee payer
      transaction.feePayer = window.solana.publicKey;

      // Sign the transaction
      const { signature } = await window.solana.signAndSendTransaction(transaction);

      // Confirm the transaction
      await connection.confirmTransaction(signature, 'finalized');
      console.log('Transaction successful with signature:', signature);
    } catch (err) {
      console.error('Error during transaction:', err);
    }
  }

  const texting = async() => {
    console.log("Started working....")
    axios.get("https://token-build.shuttleapp.rs/")
      .then(response => {
        console.log(response.data);
        console.log("Successfully worked...")
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleCLick = async () => {
    await withdrawSOL()
  }

  return (
    <main>
      <h2>deposit 0.2 SOL for me </h2>
      <button onClick={texting}>Click me </button>
    </main>
  )
}

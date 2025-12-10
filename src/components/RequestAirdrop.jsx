import React from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

export default function RequestAirdrop() {

    const { publicKey } = useWallet();
    const { connection } = useConnection();

    const requestAirdrop = async () => {
        if (!publicKey) return alert("Connect your wallet first!");
        const t = toast.loading("Requesting airdrop…");
        try {
            const signature = await connection.requestAirdrop(
                publicKey,
                1e9 // 1 SOL in lamports    
            )
            await connection.confirmTransaction(signature);
            toast.success("Airdrop successful");
            toast.dismiss(t);
        }
        catch (error) {
            toast.error(`Airdrop failed. RPC is rate-limited — try again or use a faucet.`);
            console.error("AIRDROP ERROR", error);
            toast.dismiss(t);
        }
    }

    if (!publicKey) return <p>Connect wallet to Request Airdrop</p>;

    return (
        <div style={{ marginTop: "40px" }}>
            <h2>Request Airdrop</h2>
            <button
                style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    backgroundColor: "crimson",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                }}
                onClick={requestAirdrop}
            >
                Request 1 SOL Airdrop
            </button>
        </div>
    );
}
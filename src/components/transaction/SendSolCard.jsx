import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import toast from "react-hot-toast";

export default function SendSolCard() {
    const { publicKey, signTransaction } = useWallet();
    const { connection } = useConnection();

    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");

    const simulateTx = async (tx) => {
        const s = await connection.simulateTransaction(tx);
        if (s.value?.err) throw new Error(JSON.stringify(s.value.err));
    };

    const sendSol = async () => {
        try {
            if (!recipient) return toast.error("Enter recipient address");
            if (!amount || Number(amount) <= 0)
                return toast.error("Enter a valid amount");

            toast.loading("Preparing transaction...", { id: "tx" });

            const to = new PublicKey(recipient);

            const tx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: to,
                    lamports: Number(amount) * 1e9,
                })
            );

            tx.feePayer = publicKey;
            tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

            await simulateTx(tx);

            toast.loading("Waiting for wallet signature...", { id: "tx" });
            const signedTx = await signTransaction(tx);

            toast.loading("Submitting transaction...", { id: "tx" });
            const sig = await connection.sendRawTransaction(signedTx.serialize());

            await connection.confirmTransaction(sig, "confirmed");
            toast.success("Transaction confirmed!", { id: "tx" });

            setRecipient("");
            setAmount("");
        } catch (err) {
            toast.error("Transaction failed", { id: "tx" });
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-6 text-center hover:shadow-lg transition">
            {!publicKey ? (
                <p className="text-gray-600">Connect wallet to view balance</p>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-4">Send SOL</h2>

                    <input
                        type="text"
                        placeholder="Recipient Public Key"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:border-red-500 focus:ring-red-500"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Amount (SOL)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:border-red-500 focus:ring-red-500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    <button
                        onClick={sendSol}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                        Send
                    </button>
                </>
            )
            }
        </div >
    );
}

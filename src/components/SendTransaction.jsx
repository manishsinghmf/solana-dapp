import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import toast from "react-hot-toast";

function SendTransaction() {
    const { publicKey, signTransaction } = useWallet();
    const { connection } = useConnection();

    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState(0);
    const [txSig, setTxSig] = useState(null);
    const [isSending, setIsSending] = useState(false);

    const simulateTx = async (transaction) => {
        const simulated = await connection.simulateTransaction(transaction);
        if (simulated.value?.err) {
            throw new Error(JSON.stringify(simulated.value.err));
        }
        return simulated;
    };

    const sendSol = async () => {
        try {
            if (!publicKey) return alert("Connect your wallet first!");
            if (!recipient) return alert("Enter recipient address!");

            setIsSending(true);
            toast.loading("Waiting for wallet signature…", { id: "tx" });


            const toPubkey = new PublicKey(recipient);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey,
                    lamports: amount * 1e9, // send amount in lamports
                })
            );

            transaction.feePayer = publicKey;

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;

            simulateTx(transaction)

            const signedTx = await signTransaction(transaction);
            toast.loading("Submitting transaction…", { id: "tx" });

            const signature = await connection.sendRawTransaction(signedTx.serialize());
            await connection.confirmTransaction(signature, "confirmed");
            toast.success("Transaction confirmed", { id: "tx" });
            setTxSig(signature);
        } catch (error) {
            console.error(error);
            toast.error("Transaction failed: " + error.message, { id: "tx" });
        } finally {
            setAmount(0);
            setRecipient("");
            setIsSending(false);
        }
    };

    if (!publicKey) return <p>Connect wallet to send transactions</p>;

    return (
        <div style={{ marginTop: "40px" }}>
            <h2>Send SOL</h2>

            <input
                type="text"
                placeholder="Recipient Public Key"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                style={{ width: "320px", padding: "10px" }}
            />

            <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: "320px", padding: "10px", marginLeft: "10px" }}
            />

            <br /><br />

            <button
                onClick={sendSol}
                style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    backgroundColor: "crimson",
                    color: "white",
                    border: "none",
                    borderRadius: "6px"
                }}
            >
                {isSending ? "Sending…" : "Send"}
            </button>

            {txSig && (
                <p style={{ marginTop: "20px" }}>
                    Transaction Signature:<br />
                    <a
                        href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
                        target="_blank"
                    >
                        View on Explorer
                    </a>
                </p>
            )}
        </div>
    );
}

export default SendTransaction;

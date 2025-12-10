import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

export default function AirdropCard() {
    const { publicKey } = useWallet();
    const { connection } = useConnection();

    const requestAirdrop = async () => {
        if (!publicKey) return toast.error("Connect your wallet first!");

        toast.loading("Requesting airdrop...", { id: "air" });

        try {
            const sig = await connection.requestAirdrop(publicKey, 1e9);
            await connection.confirmTransaction(sig, "confirmed");

            toast.success("Airdrop successful!", { id: "air" });
        } catch (err) {
            toast.error("Airdrop failed. RPC is rate-limited.", { id: "air" });
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 text-center mt-6 hover:shadow-lg transition"> {!publicKey ? (
            <p className="text-gray-600">Connect wallet to view balance</p>
        ) : (
            <>
                <h2 className="text-xl font-semibold mb-4">Request Airdrop</h2>

                <button
                    onClick={requestAirdrop}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                >
                    Request 1 SOL Airdrop
                </button>
            </>
        )}
        </div>
    );
}

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

export default function BalanceCard() {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [balance, setBalance] = useState(null);

    const loadBalance = async () => {
        if (!publicKey) return;
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / 1e9);
    };

    useEffect(() => {
        if (publicKey) loadBalance();
    }, [publicKey]);

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 text-center mt-6 transition-all hover:shadow-lg">
            {!publicKey ? (
                <p className="text-gray-600">Connect wallet to view balance</p>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-2">Your Balance</h2>

                    <p className="text-4xl font-bold text-gray-800 mb-4">
                        {balance !== null ? `${balance} SOL` : "Loading..."}
                    </p>

                    <button
                        onClick={loadBalance}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-semibold"
                    >
                        Refresh Balance
                    </button>
                </>
            )
            }
        </div>

    );
}

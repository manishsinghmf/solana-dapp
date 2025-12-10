/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

function ReadBalance() {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [balance, setBalance] = useState(null);

    const getBalance = async () => {
        if (!publicKey) return;
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / 1e9); // Convert to SOL
    };

    useEffect(() => {
        if (publicKey) getBalance();
    }, [publicKey]);

    if (!publicKey) return <p>Connect wallet to view balance</p>;

    return (
        <div style={{ marginTop: "30px" }}>
            <h2>Your Balance: {balance} SOL</h2>

            <button
                onClick={getBalance}
                style={{
                    padding: "10px 20px",
                    marginTop: "10px",
                    backgroundColor: "crimson",
                    color: "white",
                    border: "none",
                    borderRadius: "6px"
                }}
            >
                Refresh Balance
            </button>
        </div>
    );
}

export default ReadBalance;

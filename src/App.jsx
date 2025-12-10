import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import ReadBalance from "./components/ReadBalance";
import SendTransaction from "./components/SendTransaction";
import RequestAirdrop from "./components/RequestAirdrop";

function App() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <WalletMultiButton />

      <ReadBalance />

      <SendTransaction />

      <RequestAirdrop />
    </div>
  );
}

export default App;

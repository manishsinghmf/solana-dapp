import DashboardLayout from "./layouts/DashboardLayout";
import ConnectWallet from "./components/wallet/ConnectWallet";
import BalanceCard from "./components/balance/BalanceCard";
import SendSolCard from "./components/transaction/SendSolCard";
import AirdropCard from "./components/transaction/AirdropCard";

function App() {
  return (
    <DashboardLayout>
      <ConnectWallet />

      <div className="space-y-6">
        <BalanceCard />
        <SendSolCard />
        <AirdropCard />
      </div>
    </DashboardLayout>
  );
}

export default App;

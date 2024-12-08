// Importing necessary components
import AnimatedCounter from './AnimatedCounter'; // Component for animated counter display
import DoughnutChart from './DoughnutChart'; // Component for doughnut chart visualization

// Main TotalBalanceBox component to display bank accounts information and the balance chart
const TotalBalanceBox = ({
  accounts = [], // Array of account objects passed as a prop
  totalBanks, // Total number of bank accounts
  totalCurrentBalance, // Total current balance across all accounts
}: TotalBalanceBoxProps) => {
  return (
    <section className="total-balance">
      {/* Section displaying the doughnut chart */}
      <div className="total-balance-chart">
        <DoughnutChart accounts={accounts} />{' '}
        {/* Pass accounts data to DoughnutChart */}
      </div>

      {/* Flex container for the total balance information */}
      <div className="flex flex-col gap-6">
        {/* Header displaying total number of bank accounts */}
        <h2 className="header-2">Bank Accounts: {totalBanks}</h2>

        {/* Flex container for the total balance details */}
        <div className="flex flex-col gap-2">
          {/* Label for total current balance */}
          <p className="total-balance-label">Total Current Balance</p>

          {/* Displaying the animated counter for total balance */}
          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={totalCurrentBalance} />{' '}
            {/* Animated counter for balance */}
          </div>
        </div>
      </div>
    </section>
  );
};

// Exporting the TotalBalanceBox component for use in other parts of the application
export default TotalBalanceBox;

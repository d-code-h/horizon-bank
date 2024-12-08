import HeaderBox from '@/components/HeaderBox';
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Home = async ({ searchParams }: SearchParamProps) => {
  // Extract `id` and `page` from the search parameters
  const { id, page } = await searchParams;

  // Parse the current page number; fallback to 1 if not provided
  const currentPage = Number(page) || 1;

  // Fetch the logged-in user's information
  const user = (await getLoggedInUser()) as User;

  // Ensure the user data is fetched successfully
  if (!user) {
    console.error('User not found');
    return null; // Return null or a fallback UI if user is not available
  }

  // Fetch all accounts linked to the user
  const accounts = await getAccounts({ userId: user.$id });

  // Handle missing or undefined accounts gracefully
  if (!accounts || !accounts.accounts) {
    console.error('No accounts found');
    return null;
  }

  const accountsData = accounts.accounts;

  // Determine the database item ID for the current account
  const dbItemId = id || accountsData[0]?.dbItemId;

  // Validate that `dbItemId` is a string
  if (!dbItemId || typeof dbItemId !== 'string') {
    console.error('Invalid dbItemId');
    return null;
  }

  // Fetch the account details using `dbItemId`
  const account = await getAccount({ dbItemId });

  // Handle missing account data
  if (!account) {
    console.error(`No account found for dbItemId: ${dbItemId}`);
    return null;
  }

  return (
    <section className="home">
      {/* Main content area */}
      <div className="home-content">
        <header className="home-header">
          {/* Greeting header with user's first name or "Guest" fallback */}
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={user.name.split(' ')[0] || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          {/* Display total balance and account summary */}
          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts.totalBanks || 0}
            totalCurrentBalance={accounts.totalCurrentBalance || 0}
          />
        </header>

        {/* List of recent transactions */}
        <RecentTransactions
          accounts={accountsData}
          transactions={(account.transactions as Transaction[]) || []}
          dbItemId={dbItemId}
          page={currentPage}
        />
      </div>

      {/* Sidebar with user details, recent transactions, and top two banks */}
      <RightSidebar
        user={user}
        transactions={(account.transactions as Transaction[]) || []}
        banks={accountsData.slice(0, 2)} // Ensure slicing handles empty arrays gracefully
      />
    </section>
  );
};

export default Home;

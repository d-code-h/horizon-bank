import HeaderBox from '@/components/HeaderBox';
import RecentTransactions from '@/components/RecentTransactions';

import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Home = async ({ searchParams }: SearchParamProps) => {
  const { id, page } = await searchParams;

  const currentPage = Number(page as string) || 1;

  const user = (await getLoggedInUser()) as User;
  const accounts = await getAccounts({
    userId: user.$id,
  });

  if (!accounts) return;

  const accountsData = accounts.accounts!;

  const dbItemId = id || (accountsData && accountsData[0].dbItemId);

  // Ensure dbItemId is a string before calling getAccount
  if (typeof dbItemId !== 'string') return null;

  const account = await getAccount({
    dbItemId,
  });

  if (!account) return;

  // console.log('Account', account);

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={user?.name.split(' ')[0] || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts.totalBanks as number}
            totalCurrentBalance={accounts.totalCurrentBalance as number}
          />
        </header>
        <RecentTransactions
          accounts={accountsData}
          transactions={account.transactions}
          dbItemId={dbItemId}
          page={currentPage}
        />
      </div>

      <RightSidebar
        user={user}
        transactions={account.transactions}
        banks={[...accountsData.slice(0, 2)]}
      />
    </section>
  );
};

export default Home;

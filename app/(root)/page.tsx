import HeaderBox from '@/components/HeaderBox';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { SearchParamProps, User } from '@/types';

const Home = async ({ searchParams }: SearchParamProps) => {
  const { id } = await searchParams;
  const user = (await getLoggedInUser()) as User;
  const accounts = await getAccounts({
    userId: user.$id,
  });

  if (!accounts) return;

  const accountsData = accounts.data;

  const dbItemId = id || accountsData[0].dbItemId;

  const account = await getAccount({
    dbItemId,
  });

  console.log({
    accountsData,
    account,
  });

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={user?.name || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts.totalBanks}
            totalCurrentBalance={accounts.totalCurrentBalance}
          />
        </header>
        RECENT TRANSACTIONS
      </div>

      <RightSidebar
        user={user}
        transactions={accounts.transactions}
        banks={[accountsData.slice(0, 2)]}
      />
    </section>
  );
};

export default Home;

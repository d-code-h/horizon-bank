import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const MyBanks = async () => {
  const user = (await getLoggedInUser()) as User;
  const accounts = await getAccounts({
    userId: user.$id,
  });

  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activites."
        />

        <div className="space-y-4">
          <h2 className="header-2">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts &&
              accounts.accounts &&
              accounts.accounts.map((account) => (
                <BankCard
                  key={account.id}
                  account={account}
                  userName={user.name.split(' ')[0]}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyBanks;

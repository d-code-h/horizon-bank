import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const MyBanks = async () => {
  // Fetch logged-in user
  const user = (await getLoggedInUser()) as User;

  // Fetch user accounts
  const accounts = await getAccounts({ userId: user.$id });

  // Handle case where no accounts are available
  if (!accounts || !accounts.accounts) {
    return (
      <section className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activities."
        />
        <p className="text-center text-gray-500">No bank accounts found.</p>
      </section>
    );
  }

  // Extract account data
  const accountsData = accounts.accounts;

  return (
    <section className="flex">
      <div className="my-banks">
        {/* Header Section */}
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activities."
        />

        {/* Bank Cards Section */}
        <div className="space-y-4">
          <h2 className="header-2">Your Cards</h2>
          <div className="flex flex-wrap gap-6">
            {accountsData.map((account) => (
              <BankCard
                key={account.id}
                account={account}
                userName={user.name.split(' ')[0]} // Extract first name
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyBanks;

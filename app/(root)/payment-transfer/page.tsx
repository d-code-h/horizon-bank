import HeaderBox from '@/components/HeaderBox';
import PaymentTransferForm from '@/components/PaymentTransferForm';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Transfer = async () => {
  // Fetch the logged-in user
  const loggedIn = (await getLoggedInUser()) as User;

  // Fetch the accounts associated with the logged-in user
  const accounts = await getAccounts({ userId: loggedIn.$id });

  // Handle cases where no accounts are retrieved
  if (!accounts || !accounts.accounts) {
    return (
      <section className="payment-transfer">
        <HeaderBox
          title="Payment Transfer"
          subtext="Unable to load accounts. Please try again later."
        />
        <p className="text-center text-red-500">No accounts found.</p>
      </section>
    );
  }

  // Extract account data
  const accountsData = accounts.accounts;

  return (
    <section className="payment-transfer">
      {/* Header Section */}
      <HeaderBox
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer."
      />

      {/* Payment Transfer Form Section */}
      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  );
};

export default Transfer;

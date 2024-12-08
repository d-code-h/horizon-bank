import { BankDropdown } from '@/components/BankDropdown';
import HeaderBox from '@/components/HeaderBox';
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';

const TransactionHistory = async ({ searchParams }: SearchParamProps) => {
  // Destructure search parameters for pagination and account selection
  const { id, page } = await searchParams;

  // Determine the current page number; default to 1 if not specified
  const currentPage = Number(page) || 1;

  // Fetch the logged-in user; error handling can be added for better UX
  const loggedIn = (await getLoggedInUser()) as User;

  // Fetch all accounts associated with the user
  const accounts = await getAccounts({ userId: loggedIn.$id });
  if (!accounts) return null; // Return early if no accounts are found

  // Extract account data and set the current account based on `id` or default to the first account
  const accountsData = accounts.accounts!;
  const dbItemId = (id as string) || accountsData[0].dbItemId;

  // Fetch the selected account details
  const account = await getAccount({ dbItemId });
  if (!account.data) return null; // Return early if no account is found

  // Pagination logic for transactions
  const rowsPerPage = 10;
  const totalPages = Math.ceil(account.transactions.length / rowsPerPage);

  // Calculate indices for slicing transactions based on current page
  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  // Extract transactions for the current page
  const currentTransactions = account.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <div className="transactions">
      {/* Header section with title and account dropdown */}
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
        <BankDropdown accounts={accountsData} />
      </div>

      <div className="space-y-6">
        {/* Display account details */}
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account.data.name}
            </h2>
            <p className="text-14 text-blue-25">{account.data.officialName}</p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● {account.data.mask}
            </p>
          </div>

          {/* Display current balance */}
          <div className="transactions-account-balance">
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(account.data.currentBalance as number)}
            </p>
          </div>
        </div>

        {/* Display transaction table and pagination */}
        <section className="flex w-full flex-col gap-6">
          {currentTransactions.length > 0 ? (
            <TransactionsTable
              transactions={currentTransactions as Transaction[]}
            />
          ) : (
            <p className="text-center text-white">
              No transactions available for this account.
            </p>
          )}
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;

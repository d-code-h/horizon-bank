import Link from 'next/link'; // Importing the Link component for navigation
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Importing the Tabs components from the UI library
import { BankTabItem } from './BankTabItem'; // Importing the BankTabItem component to display individual bank info
import BankInfo from './BankInfo'; // Importing the BankInfo component for showing detailed bank information
import TransactionsTable from './TransactionsTable'; // Importing the TransactionsTable component to display transactions
import { Pagination } from './Pagination'; // Importing the Pagination component for paginating transactions

// RecentTransactions component to display a paginated list of recent transactions for multiple accounts
const RecentTransactions = ({
  accounts, // List of bank accounts to display tabs for
  transactions = [], // List of transactions associated with the accounts
  dbItemId, // ID of the database item to manage active tab
  page = 1, // Current page for pagination (defaults to 1)
}: RecentTransactionsProps) => {
  const rowsPerPage = 10; // Number of transactions to display per page
  const totalPages = Math.ceil(transactions.length / rowsPerPage); // Calculate the total number of pages based on the transaction count
  page = totalPages < page ? totalPages : page; // Ensure the page does not exceed the total pages
  const indexOfLastTransaction = page * rowsPerPage; // Index of the last transaction to display on the current page
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage; // Index of the first transaction to display on the current page

  // Slice the transactions to only show the ones relevant for the current page
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <section className="recent-transactions">
      {/* Header section with label and "View all" link */}
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/transaction-history/?id=${dbItemId}`} // Link to the full transaction history
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      {/* Tabs component to switch between different accounts */}
      <Tabs value={dbItemId} className="w-full">
        <TabsList className="recent-transactions-tablist">
          {/* Mapping through the accounts and creating a tab for each one */}
          {accounts.map((account: Account) => (
            <TabsTrigger key={account.id} value={account.dbItemId}>
              {/* BankTabItem component for rendering each bank's tab */}
              <BankTabItem
                key={account.id}
                account={account} // Passing the account data
                dbItemId={dbItemId} // Passing the dbItemId to manage active tab
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Rendering content for each tab */}
        {accounts.map((account: Account) => (
          <TabsContent
            value={account.dbItemId} // Setting the active tab's value
            key={account.id} // Using account ID as the key
            className="space-y-4"
          >
            {/* Bank information for the selected account */}
            <BankInfo account={account} dbItemId={dbItemId} type="full" />

            {/* Table displaying the current transactions for the selected account */}
            <TransactionsTable transactions={currentTransactions} />

            {/* Pagination controls if there are multiple pages */}
            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
                {/* Pagination component */}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

// Exporting the RecentTransactions component for use in other parts of the application
export default RecentTransactions;

// Importing necessary components and utilities from external files
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Table components
import { transactionCategoryStyles } from '@/constants'; // Transaction category styles
import {
  cn, // Utility function for conditional class names
  formatAmount, // Utility to format transaction amounts
  formatDateTime, // Utility to format date and time
  getTransactionStatus, // Utility to determine transaction status
  removeSpecialCharacters, // Utility to remove special characters from strings
} from '@/lib/utils'; // Utility functions

// Component to render the category badge with styling
const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  // Destructuring category styles from constants
  const { borderColor, backgroundColor, textColor, chipBackgroundColor } =
    transactionCategoryStyles[
      category as keyof typeof transactionCategoryStyles
    ] || transactionCategoryStyles.default; // Default styling for undefined categories

  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />{' '}
      {/* Circle representing category */}
      <p className={cn('text-[12px] font-medium', textColor)}>
        {category}
      </p>{' '}
      {/* Category name */}
    </div>
  );
};

// Main component to render the transactions table
const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  // Check if there are no transactions and render a fallback message
  if (!transactions || transactions.length === 0) {
    return <div>No transactions available.</div>;
  }

  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Channel</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>

      {/* Table Body */}
      <TableBody>
        {/* Mapping through transactions to display each row */}
        {transactions.map((t: Transaction, index: number) => {
          // Determining the transaction status based on the transaction date
          const status = getTransactionStatus(new Date(t.date));

          // Formatting the transaction amount
          const amount = formatAmount(t.amount);

          // Checking if the transaction type is debit or credit
          const isDebit = t.type === 'debit';
          const isCredit = t.type === 'credit';

          return (
            <TableRow
              key={t._id || `transaction-${index}`} // Using transaction ID or index as the key
              className={`${
                isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]' // Conditional background color based on type
              } !over:bg-none !border-b-DEFAULT`} // Border and hover styles
            >
              {/* Transaction Name */}
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {removeSpecialCharacters(t.name)}
                    {/* Remove special characters from transaction name  */}
                  </h1>
                </div>
              </TableCell>

              {/* Transaction Amount */}
              <TableCell
                className={`pl-2 pr-10 font-semibold ${
                  isDebit || amount[0] === '-'
                    ? 'text-[#f04438]' // Red color for debit transactions
                    : 'text-[#039855]' // Green color for credit transactions
                }`}
              >
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
                {/* Format debit and credit amounts */}
              </TableCell>

              {/* Transaction Status */}
              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={status} />
                {/* Render category badge for transaction status */}
              </TableCell>

              {/* Transaction Date */}
              <TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(t.date)).dateTime}
                {/* Format and display the transaction date */}
              </TableCell>

              {/* Transaction Channel */}
              <TableCell className="pl-2 pr-10 capitalize min-w-24">
                {t.channel} {/* Display the transaction channel */}
              </TableCell>

              {/* Transaction Category */}
              <TableCell className="pl-2 pr-10 max-md:hidden">
                <CategoryBadge category={t.category} />
                {/* Render category badge for the transaction category */}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

// Exporting the TransactionsTable component for use in other parts of the application
export default TransactionsTable;

// Interface for search parameters. Contains a promise that resolves to an object with 'id' and 'page' as strings.
declare interface SearchParamProps {
  searchParams: Promise<{ id: string; page: string }>;
}

// Type defining the parameters required for user sign-up, including personal details and authentication information.
declare type SignUpParams = {
  firstName: string; // First name of the user
  lastName: string; // Last name of the user
  address1: string; // Primary address line of the user
  city: string; // City of the user's address
  state: string; // State of the user's address
  postalCode: string; // Postal code of the user's address
  dateOfBirth: string; // Date of birth of the user
  ssn: string; // Social security number of the user
  email: string; // Email address of the user
  password: string; // Password for the user's account
};

// Type for a signed-in user, extending from 'SignUpParams' and adding Dwolla-specific customer details.
declare type SignedUser = SignUpParams & {
  dwollaCustomerId: string; // ID provided by Dwolla for the customer
  dwollaCustomerUrl: string; // URL for the Dwolla customer account
};

// Type for the login credentials, consisting of email and password.
declare type LoginUser = {
  email: string; // Email address of the user logging in
  password: string; // Password of the user logging in
};

// Type for a user profile, containing both personal details and account-related info.
declare type User = {
  $id: string; // Unique identifier for the user
  _id?: string; // Optional internal ID for the user
  email: string; // Email address of the user
  name: string; // Full name of the user
  userId: string; // User's unique identifier
  dwollaCustomerUrl: string; // Dwolla customer URL
  dwollaCustomerId: string; // Dwolla customer ID
  firstName: string; // User's first name
  lastName: string; // User's last name
  address1: string; // Primary address line
  city: string; // City of the user's address
  state: string; // State of the user's address
  postalCode: string; // Postal code of the user's address
  dateOfBirth: string; // Date of birth of the user
  ssn: string; // Social security number of the user
};

// Type for new user creation, including user details such as user ID, email, name, and password.
declare type NewUserParams = {
  userId: string; // User's unique identifier
  email: string; // Email address of the new user
  name: string; // Full name of the new user
  password: string; // Password for the new user's account
};

// Type for an account, including account details such as balances, account type, and shareable IDs.
declare type Account = {
  id: string; // Unique identifier for the account
  availableBalance: number; // Available balance in the account
  currentBalance: number; // Current balance in the account
  officialName: string; // Official name of the account holder
  mask: string; // Masked account number (partially hidden for security)
  institution_id: string; // Institution ID associated with the account
  name: string; // Name of the account (e.g., checking, savings)
  type: string; // Type of account (e.g., depository, credit)
  subtype: string; // Subtype of the account (e.g., personal, business)
  dbItemId: string; // Database item ID related to the account
  shareableId: string; // Shareable ID for the account
};

// Interface for a transaction, which includes information such as transaction type, amount, and sender/receiver info.
declare interface Transaction {
  id?: string; // Optional transaction ID
  _id?: string; // Optional internal transaction ID
  name: string; // Name or description of the transaction
  channel: string; // The channel through which the transaction was processed
  type: string; // Type of transaction (e.g., debit, credit)
  accountId: string; // ID of the account associated with the transaction
  amount: number; // Amount of money involved in the transaction
  pending: boolean; // Flag indicating if the transaction is pending
  category: string; // Category of the transaction (e.g., food, travel)
  date: string; // Date the transaction occurred
  image: string; // Optional image (e.g., receipt image)
  created: string; // Date and time when the transaction was created
  senderBankId: string; // Bank ID of the sender (if applicable)
  receiverBankId: string; // Bank ID of the receiver (if applicable)
}

// Type for bank details associated with a user's account, including access token and bank ID.
declare type Bank = {
  _id: string; // Unique internal ID for the bank
  accountId: string; // Account ID associated with the bank
  bankId: string; // Bank ID for the user's bank
  accessToken: string; // Access token for the bank account
  fundingSourceUrl: string; // URL for the funding source in Dwolla
  userId: string; // User ID associated with the bank account
  shareableId: string; // Shareable ID for the bank account
};

// Type for different account types, including depository, credit, loan, investment, and other.
declare type AccountTypes =
  | 'depository' // A type of account for holding funds
  | 'credit' // A type of account related to credit
  | 'loan' // A type of account for loans
  | 'investment' // A type of account for investments
  | 'other'; // A catch-all category for other account types

// Type for transaction categories, such as 'Food and Drink', 'Travel', and 'Transfer'.
declare type Category = 'Food and Drink' | 'Travel' | 'Transfer';

// Type for tracking category counts, with the category name, count of occurrences, and total count.
declare type CategoryCount = {
  name: string; // Name of the category (e.g., 'Food and Drink')
  count: number; // Count of transactions in this category
  totalCount: number; // Total count of all categories
};

// Type for a receiver of a transaction, containing their first and last name.
declare type Receiver = {
  firstName: string; // First name of the receiver
  lastName: string; // Last name of the receiver
};

// Type for transfer parameters, including the source and destination funding source URLs and the amount to transfer.
declare type TransferParams = {
  sourceFundingSourceUrl: string; // URL for the source funding source
  destinationFundingSourceUrl: string; // URL for the destination funding source
  amount: string; // Amount to transfer
};

// Type for adding a funding source, including customer ID, processor token, and bank name.
declare type AddFundingSourceParams = {
  dwollaCustomerId: string; // Dwolla customer ID
  processorToken: string; // Processor token for adding a funding source
  bankName: string; // Name of the bank for the funding source
};

// Type for creating a new Dwolla customer, containing the customer's personal information.
declare type NewDwollaCustomerParams = {
  firstName: string; // First name of the new customer
  lastName: string; // Last name of the new customer
  email: string; // Email address of the new customer
  type: string; // Type of customer (individual, business, etc.)
  address1: string; // Primary address line of the customer
  city: string; // City of the customer's address
  state: string; // State of the customer's address
  postalCode: string; // Postal code of the customer's address
  dateOfBirth: string; // Date of birth of the customer
  ssn: string; // Social security number of the customer
};

// Represents the properties for a CreditCard component, displaying an account's balance and user information.
declare interface CreditCardProps {
  account: Account; // The account related to the credit card
  userName: string; // The username to display with the card
  showBalance?: boolean; // Optional flag to show balance
}

// Represents the properties for displaying bank account information, either in full or just card details.
declare interface BankInfoProps {
  account: Account; // The bank account to display
  dbItemId?: string; // Optional identifier for the database item
  type: 'full' | 'card'; // Specifies if the bank info is for full account details or just the card
}

// Represents the properties for a HeaderBox component, used for displaying a title and subtext with optional user greeting.
declare interface HeaderBoxProps {
  type?: 'title' | 'greeting'; // Optional type to specify the content (either title or greeting)
  title: string; // The main title to display
  subtext: string; // Subtext related to the title
  user?: string; // Optional user name for a personalized greeting
}

// Represents the properties for a mobile navigation component, passing user information.
declare interface MobileNavProps {
  user: User; // User information for the navigation menu
}

// Represents the properties for the page header, displaying top and bottom titles and descriptions.
declare interface PageHeaderProps {
  topTitle: string; // Title for the top section
  bottomTitle: string; // Title for the bottom section
  topDescription: string; // Description for the top section
  bottomDescription: string; // Description for the bottom section
  connectBank?: boolean; // Optional flag to allow bank connection
}

// Represents the properties for pagination controls, handling current page and total pages.
declare interface PaginationProps {
  page: number; // Current page number
  totalPages: number; // Total number of pages for pagination
}

// Represents the properties for the Plaid Link component, handling user information and variant options.
declare interface PlaidLinkProps {
  user: User & {
    password?: string; // Optional password field for the user
  };
  variant?: 'primary' | 'ghost'; // Optional variant for styling (primary or ghost)
  dwollaCustomerId?: string; // Optional Dwolla customer ID for linking
}

// Represents the properties for an authentication form, handling either sign-in or sign-up actions.
declare interface AuthFormProps {
  type: 'sign-in' | 'sign-up'; // Specifies if the form is for sign-in or sign-up
}

// Represents the properties for a bank account dropdown, with options for setting the form value and custom styles.
declare interface BankDropdownProps {
  accounts: Account[]; // List of accounts to display in the dropdown
  setValue?: UseFormSetValue<unknown>; // Optional method to set form values
  otherStyles?: string; // Optional custom styles for the dropdown
}

// Represents the properties for a bank tab item, displaying an individual bank account.
declare interface BankTabItemProps {
  account: Account; // The account to display in the tab
  dbItemId?: string; // Optional database item identifier
}

// Represents the properties for a total balance box, displaying the total current balance and bank counts.
declare interface TotalBalanceBoxProps {
  accounts: Account[]; // List of accounts to calculate total balances
  totalBanks: number; // Total number of banks
  totalCurrentBalance: number; // Total current balance across all accounts
}

// Represents the properties for the footer component, which can vary for desktop or mobile view.
declare interface FooterProps {
  user: User; // User information to display in the footer
  type?: 'desktop' | 'mobile'; // Optional type to switch between desktop or mobile view
}

// Represents the properties for the right sidebar, displaying user information, transactions, and banks.
declare interface RightSidebarProps {
  user: User; // The user whose details are shown in the sidebar
  transactions: Transaction[]; // List of transactions related to the user
  banks: Account[]; // List of bank accounts linked to the user
  // banks: Bank[] & Account[]; // Alternative type combining Bank and Account
}

// Represents the properties for the sidebar, displaying general user information.
declare interface SiderbarProps {
  user: User; // User information to display in the sidebar
}

// Represents the properties for recent transactions, including the list of accounts and pagination for transaction history.
declare interface RecentTransactionsProps {
  accounts: Account[]; // Accounts related to the transactions
  transactions: Transaction[]; // List of recent transactions
  dbItemId: string; // Database item identifier
  page: number; // Current page number for pagination
}

// Represents the properties for displaying a table of transaction history.
declare interface TransactionHistoryTableProps {
  transactions: Transaction[]; // List of transactions to display
  page: number; // Current page number for pagination
}

// Represents the properties for displaying a category badge based on transaction category.
declare interface CategoryBadgeProps {
  category: string; // Category to display in the badge
}

// Represents the properties for displaying a table of transactions, usually in a summarized format.
declare interface TransactionTableProps {
  transactions: Transaction[]; // List of transactions to display in a table
}

// Represents the properties for displaying a category in a more detailed form.
declare interface CategoryProps {
  category: CategoryCount; // Category details, including name and count
}

// Represents the properties for a doughnut chart showing account-related financial data.
declare interface DoughnutChartProps {
  accounts: Account[]; // List of accounts to generate the chart from
}

// Represents the properties for a payment transfer form, allowing users to transfer funds between accounts.
declare interface PaymentTransferFormProps {
  accounts: Account[]; // List of accounts for the payment transfer form
}

// Represents the properties for fetching the accounts associated with a user.
declare interface getAccountsProps {
  userId: string; // The unique identifier for the user whose accounts are being fetched
}

// Represents the properties for fetching details of a single account using its database item identifier.
declare interface getAccountProps {
  dbItemId: string; // The unique database item identifier for the account
}

// Represents the properties for fetching information about an institution using its institution identifier.
declare interface getInstitutionProps {
  institution_id: string; // The unique identifier for the financial institution
}

// Represents the properties for fetching transactions, requiring an access token for authorization.
declare interface getTransactionsProps {
  accessToken: string; // The access token for authentication and fetching transactions
}

// Represents the properties for creating a new funding source in Dwolla, with the necessary account information.
declare interface CreateFundingSourceOptions {
  customerId: string; // Dwolla Customer ID for the user
  fundingSourceName: string; // Name of the funding source being created
  plaidToken: string; // Plaid Account Processor Token for authentication
  _links: object; // On-demand authorization link for Dwolla to initiate the funding source creation
}

// Represents the properties for creating a transaction between users and their respective bank accounts.
declare interface CreateTransactionProps {
  name: string; // Name associated with the transaction
  amount: string; // The transaction amount
  senderId: string; // The ID of the sender initiating the transaction
  senderBankId: string; // The bank ID of the sender
  receiverId: string; // The ID of the receiver of the transaction
  receiverBankId: string; // The bank ID of the receiver
  email: string; // Email address associated with the transaction
}

// Represents the properties for fetching transactions associated with a specific bank account using its bank ID.
declare interface getTransactionsByBankIdProps {
  bankId: string; // The unique identifier for the bank account whose transactions are being fetched
}

// Represents the properties for signing in a user with their email and password.
declare interface signInProps {
  email: string; // The user's email address for signing in
  password: string; // The user's password for authentication
}

// Represents the properties for fetching detailed user information based on the user ID.
declare interface getUserInfoProps {
  userId: string; // The unique identifier for the user whose information is being fetched
}

// Represents the properties for exchanging a public token from Plaid into an access token for secure user authentication.
declare interface exchangePublicTokenProps {
  publicToken: string; // The public token provided by Plaid for exchange
  user: User; // The user for whom the public token is being exchanged
}

// Represents the properties for creating a bank account, including user and bank details, along with necessary tokens.
declare interface createBankAccountProps {
  accessToken: string; // Access token for authenticating the user and creating the bank account
  userId: string; // The user ID for whom the bank account is being created
  accountId: string; // The account ID for the new bank account
  bankId: string; // The bank ID of the institution where the account will be created
  fundingSourceUrl: string; // URL for the funding source used in the bank account creation process
  shareableId: string; // A shareable identifier for the created bank account
}

// Represents the properties for fetching a list of banks associated with a user.
declare interface getBanksProps {
  userId: string; // The unique identifier for the user whose banks are being fetched
}

// Represents the properties for fetching a specific bank using its document ID.
declare interface getBankProps {
  documentId: string; // The document ID for the bank whose details are being fetched
}

// Represents the properties for fetching bank details by the account ID.
declare interface getBankByAccountIdProps {
  accountId: string; // The account ID for fetching the associated bank details
}

// Represents the properties for a Dwolla transaction, detailing the source, destination, amount, and other relevant details.
declare interface DwollaTransactionProps {
  _links: {
    source: object; // Link to the source of the transaction
    'destination-funding-source': object; // Link to the destination funding source
    self: object; // Self-link to the transaction resource
    'source-funding-source': object; // Link to the source funding source
    destination: object; // Link to the destination of the transaction
  };
  id: string; // The unique identifier for the transaction
  status: string; // The current status of the transaction
  amount: { value: string; currency: string }; // Amount of the transaction with value and currency
  created: string; // Timestamp of when the transaction was created
  clearing: { source: string }; // Information on how the transaction is cleared
  individualAchId: string; // The individual ACH ID for the transaction
}

// Interface for the URL query parameters
declare interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

// Set up the Plaid client configuration with the sandbox environment
const configuration = new Configuration({
  // Use the sandbox environment for testing
  basePath: PlaidEnvironments.sandbox,

  // Configure the headers to include your Plaid API client ID and secret from environment variables
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID, // Your Plaid client ID
      'PLAID-SECRET': process.env.PLAID_SECRET, // Your Plaid secret key
    },
  },
});

// Instantiate the Plaid API client using the configuration
export const plaidClient = new PlaidApi(configuration);

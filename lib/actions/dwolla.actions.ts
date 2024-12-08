'use server';

import { Client } from 'dwolla-v2';

// Function to determine the Dwolla environment (production or sandbox)
const getEnvironment = (): 'production' | 'sandbox' => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case 'sandbox':
      return 'sandbox';
    case 'production':
      return 'production';
    default:
      throw new Error(
        'Dwolla environment should either be set to `sandbox` or `production`'
      );
  }
};

// Initialize the Dwolla client with environment, key, and secret from environment variables
const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    const res = await dwollaClient.post(
      `customers/${options.customerId}/funding-sources`,
      {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      }
    );

    return res.headers.get('location'); // Return location header of the response
  } catch (err) {
    console.error('Error creating a Funding Source: ', err); // Log error
  }
};

// Create an On-Demand Authorization link from Dwolla
export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      'on-demand-authorizations'
    );
    const authLink = onDemandAuthorization.body._links; // Get authorization links
    return authLink; // Return the links
  } catch (err) {
    console.error('Error creating an On-Demand Authorization: ', err); // Log error
  }
};

// Create a new Dwolla customer
export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    const newDwollaClient = await dwollaClient
      .post('customers', newCustomer)
      .then((res) => res.headers.get('location')); // Get the location from the response headers

    return newDwollaClient; // Return new customer location
  } catch (err) {
    console.error('Error creating a Dwolla Customer: ', err); // Log error
  }
};

// Create a transfer between two funding sources
export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const requestBody = {
      _links: {
        source: { href: sourceFundingSourceUrl },
        destination: { href: destinationFundingSourceUrl },
      },
      amount: {
        currency: 'USD',
        value: amount,
      },
    };
    const res = await dwollaClient.post('transfers', requestBody); // Post the transfer request
    return res.headers.get('location'); // Return location header from the response
  } catch (err) {
    console.error('Error creating transfer: ', err); // Log error
  }
};

// Retrieve all transfers for a specific customer
export const getTransfers = async (customerUrl: string) => {
  try {
    const res = await dwollaClient.get(`${customerUrl}/transfers`);
    return res.body._embedded['transfers'].filter(
      (each: DwollaTransactionProps) => each.status !== 'cancelled'
    ); // Filter out cancelled transfers and return valid transfers
  } catch (error) {
    console.error(`Error fetching transfers: ${error}`); // Log error
  }
};

// Add a new funding source to a Dwolla customer
export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // Create an On-Demand Authorization link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // Add the funding source to the Dwolla customer using the obtained links
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions); // Create funding source
  } catch (err) {
    console.error('Error adding funding source: ', err); // Log error
  }
};

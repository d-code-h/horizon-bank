import { type ClassValue, clsx } from 'clsx';
import qs from 'query-string';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Default salt rounds for bcrypt hashing
const saltRounds = 10;

// Utility function to merge class names with Tailwind CSS and clsx
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: string | Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    year: 'numeric', // numeric year (e.g., '2023')
    month: '2-digit', // abbreviated month name (e.g., 'Oct')
    day: '2-digit', // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  // Formatting the date into different styles
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    'en-US',
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Function to format a number as currency (USD)
export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

// Helper function to deep clone an object
export const parseStringify = (value: unknown): unknown => {
  return JSON.parse(JSON.stringify(value));
};

// Helper function to remove special characters from a string
export const removeSpecialCharacters = (value: string): string => {
  return value.replace(/[^\w\s]/gi, '');
};

// Function to form a URL query string with updated parameters
export function formUrlQuery({ params, key, value }: UrlQueryParams): string {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

/**
 * Get color scheme based on account type.
 * @param type - The account type ('depository', 'credit', 'loan', 'investment' or other)
 * @returns Object with background and text colors
 */
export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case 'depository':
      return {
        bg: 'bg-blue-25', // Background color for depository account
        lightBg: 'bg-blue-100', // Lighter background for depository
        title: 'text-blue-900', // Title text color for depository
        subText: 'text-blue-700', // Subtext color for depository
      };

    case 'credit':
      return {
        bg: 'bg-success-25', // Background color for credit account
        lightBg: 'bg-success-100', // Lighter background for credit
        title: 'text-success-900', // Title text color for credit
        subText: 'text-success-700', // Subtext color for credit
      };

    case 'loan':
      return {
        bg: 'bg-yellow-25', // Background color for loan account
        lightBg: 'bg-yellow-100', // Lighter background for loan
        title: 'text-yellow-900', // Title text color for loan
        subText: 'text-yellow-700', // Subtext color for loan
      };

    case 'investment':
      return {
        bg: 'bg-purple-25', // Background color for investment account
        lightBg: 'bg-purple-100', // Lighter background for investment
        title: 'text-purple-900', // Title text color for investment
        subText: 'text-purple-700', // Subtext color for investment
      };

    case 'other':
      return {
        bg: 'bg-gray-25', // Background color for other account types
        lightBg: 'bg-gray-100', // Lighter background for other
        title: 'text-gray-900', // Title text color for other
        subText: 'text-gray-700', // Subtext color for other
      };

    default:
      return {
        bg: 'bg-green-25', // Default background color
        lightBg: 'bg-green-100', // Default lighter background color
        title: 'text-green-900', // Default title text color
        subText: 'text-green-700', // Default subtext color
      };
  }
}

/**
 * Count the number of transactions in each category.
 * @param transactions - Array of transactions to be counted
 * @returns An array of CategoryCount objects
 */
export function countTransactionCategories(
  transactions: Transaction[]
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {}; // Object to store category counts
  let totalCount = 0; // Total count of transactions

  // Iterate over each transaction and count categories
  if (transactions) {
    transactions.forEach((transaction) => {
      const category = transaction.category;

      // If category exists in categoryCounts, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1; // Initialize count for new category
      }

      totalCount++; // Increment total transaction count
    });
  }

  // Convert categoryCounts object to an array of CategoryCount objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount, // Total count of all transactions
    })
  );

  // Sort categories by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories; // Return sorted array
}

/**
 * Extract the customer ID from a URL.
 * @param url - The URL string containing the customer ID
 * @returns The extracted customer ID
 */
export function extractCustomerIdFromUrl(url: string): string {
  const parts = url.split('/'); // Split URL by '/'
  return parts[parts.length - 1]; // Return last part of URL (the customer ID)
}

/**
 * Encrypt an ID using Base64 encoding.
 * @param id - The ID to be encrypted
 * @returns The encrypted ID in Base64 format
 */
export function encryptId(id: string): string {
  return btoa(id); // Use Base64 encoding to encrypt the ID
}

/**
 * Decrypt an ID from Base64 encoding.
 * @param id - The encrypted ID in Base64 format
 * @returns The decrypted ID
 */
export function decryptId(id: string): string {
  return atob(id); // Use Base64 decoding to decrypt the ID
}

/**
 * Get the transaction status based on the date.
 * If the transaction is within the last two days, it's "Processing", otherwise "Success".
 * @param date - The transaction date
 * @returns The transaction status ('Processing' or 'Success')
 */
export const getTransactionStatus = (date: Date): string => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2); // Set twoDaysAgo to 2 days before today

  return date > twoDaysAgo ? 'Processing' : 'Success'; // Check if the transaction is within the last two days
};

/**
 * Schema for authentication form validation.
 * @param type - Type of form ('sign-in' or 'sign-up')
 * @returns Validation schema based on form type
 */
export const authFormSchema = (type: 'sign-in' | 'sign-up') =>
  z.object({
    firstName: type === 'sign-in' ? z.string().optional() : z.string().min(3), // Optional for 'sign-in', required for 'sign-up'
    lastName: type === 'sign-in' ? z.string().optional() : z.string().min(3), // Optional for 'sign-in', required for 'sign-up'
    address1: type === 'sign-in' ? z.string().optional() : z.string().max(50), // Optional for 'sign-in', required for 'sign-up'
    city: type === 'sign-in' ? z.string().optional() : z.string().max(50),
    state:
      type === 'sign-in' ? z.string().optional() : z.string().min(2).max(2), // State code length is 2
    postalCode:
      type === 'sign-in' ? z.string().optional() : z.string().min(3).max(6),
    dateOfBirth: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    ssn: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    email: z.string().email(), // Email is required and must be valid
    password: z.string().min(8), // Password is required and must be at least 8 characters long
  });

/**
 * Salt and hash a plain password.
 * @param plainPassword - The password to be salted and hashed
 * @returns The hashed password if successful, or undefined if an error occurs
 */
export const saltAndHashPassword = async (plainPassword: string) => {
  try {
    // Hash the plain password using bcrypt with the specified salt rounds
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Return the hashed password if successful
    if (hashedPassword) {
      return hashedPassword;
    }
  } catch (error) {
    // Log any errors that occur during hashing
    console.log(error);
  }
};

/**
 * Compare a plain password with a hashed password.
 * @param formPass - The password entered by the user (plain text)
 * @param hashedPass - The previously hashed password stored in the database
 * @returns Boolean indicating if the passwords match (true or false)
 */
export const comparePasswords = async (
  formPass: string,
  hashedPass: string
) => {
  try {
    // Compare the plain password (formPass) with the hashed password (hashedPass)
    const res = await bcrypt.compare(formPass, hashedPass);

    // Return the result of the comparison (true or false)
    return res;
  } catch {
    // Log an error message if the comparison fails
    console.log('Error: Check back later');
  }
};

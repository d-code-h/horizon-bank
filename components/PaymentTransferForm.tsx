'use client';

import { zodResolver } from '@hookform/resolvers/zod'; // Importing Zod for form validation
import { Loader2 } from 'lucide-react'; // Importing a loader icon for displaying loading state
import { useRouter } from 'next/navigation'; // Importing Next.js useRouter hook for navigation
import { useState } from 'react'; // Importing React's useState hook for managing loading state
import { useForm } from 'react-hook-form'; // Importing React Hook Form for handling form validation and submission
import * as z from 'zod'; // Importing Zod for schema validation

import { createTransfer } from '@/lib/actions/dwolla.actions'; // Function to create a transfer action via Dwolla API
import { createTransaction } from '@/lib/actions/transaction.actions'; // Function to create a transaction record
import { getBank, getBankByAccountId } from '@/lib/actions/user.actions'; // Functions to retrieve bank information
import { decryptId } from '@/lib/utils'; // Utility function to decrypt sharable ID

import { BankDropdown } from './BankDropdown'; // Custom component for selecting bank
import { Button } from './ui/button'; // Custom button component
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'; // Custom form components
import { Input } from './ui/input'; // Custom input component
import { Textarea } from './ui/textarea'; // Custom textarea component

// Zod validation schema for the form
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(4, 'Transfer note is too short'),
  amount: z.string().min(4, 'Amount is too short'),
  senderBank: z.string().min(4, 'Please select a valid bank account'),
  sharableId: z.string().min(8, 'Please select a valid sharable Id'),
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter(); // Hook for navigation
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Using Zod for validation
    defaultValues: {
      name: '',
      email: '',
      amount: '',
      senderBank: '',
      sharableId: '',
    },
  });

  // Submit handler for the form
  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true); // Set loading state

    try {
      // Decrypt receiver's account ID
      const receiverAccountId = decryptId(data.sharableId);

      // Fetch bank details for the receiver using the decrypted account ID
      const receiverBank = (await getBankByAccountId({
        accountId: receiverAccountId,
      })) as Bank;

      // Fetch sender's bank details using selected sender's bank ID
      const senderBank = await getBank({ documentId: data.senderBank });

      // Check if both sender and receiver banks are available
      if (!senderBank || !receiverBank)
        throw new Error('Unable to fetch bank information');

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };

      // Create the transfer using the provided parameters
      const transfer = await createTransfer(transferParams);

      // If transfer creation is successful, create the transaction record
      if (transfer) {
        const transaction = {
          name: data.name,
          amount: data.amount,
          senderId: senderBank.userId,
          senderBankId: senderBank._id,
          dwollaTransactionId: transfer.split('/').pop(),
          receiverId: receiverBank.userId,
          receiverBankId: receiverBank._id,
          email: data.email,
        };

        // Create the transaction
        const newTransaction = await createTransaction(transaction);

        // If transaction creation is successful, reset the form and navigate to the home page
        if (newTransaction) {
          form.reset();
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Submitting create transfer request failed: ', error); // Log error if submission fails
    }

    setIsLoading(false); // Reset loading state
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        {/* Sender's Bank Selection */}
        <FormField
          control={form.control}
          name="senderBank"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Select Source Bank
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds from
                  </FormDescription>
                </div>

                <div className="flex w-full flex-col">
                  <FormControl>
                    <BankDropdown
                      accounts={accounts} // Passing available bank accounts as a prop
                      setValue={form.setValue} // Setting form values
                      otherStyles="!w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Transfer Note (Optional) */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Transfer Note (Optional)
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Please provide any additional information or instructions
                    related to the transfer
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Textarea
                      placeholder="Write a short note here"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Bank Account Details Section */}
        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">
            Bank account details
          </h2>
          <p className="text-16 font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p>
        </div>

        {/* Recipient's Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Recipient&apos;s Email Address
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="ex: johndoe@gmail.com"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Recipient's Plaid Sharable ID */}
        <FormField
          control={form.control}
          name="sharableId"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-5 pt-6">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Receiver&apos;s Plaid Sharable Id
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter the public account number"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Amount
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="ex: 5.00"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="payment-transfer_btn-box">
          <Button type="submit" className="payment-transfer_btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              'Transfer Funds'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;

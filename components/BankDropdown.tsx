'use client';

import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '@/components/ui/select';
import { formUrlQuery, formatAmount } from '@/lib/utils';

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles,
}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSeclected] = useState(accounts[0]);

  const handleBankChange = (id: string) => {
    // Find the account based on the selected dbItemId
    const account = accounts.find((account) => account.dbItemId === id)!;

    // Update the selected account in the state
    setSeclected(account);

    // Generate a new URL with the updated query parameters
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'id',
      value: id,
    });
    router.push(newUrl, { scroll: false });

    // If `setValue` is provided, update the parent component state for the selected bank
    if (setValue) {
      setValue('senderBank', id);
    }
  };

  return (
    <Select
      defaultValue={selected.id} // Default value set to the selected account's ID
      onValueChange={(value) => handleBankChange(value)} // Handle bank change on value selection
    >
      <SelectTrigger
        className={`flex w-full bg-white gap-3 md:w-[300px] ${otherStyles}`} // Apply custom styles if provided
      >
        <Image
          src="icons/credit-card.svg" // Bank icon
          width={20}
          height={20}
          alt="account" // Alt text for image
        />
        <p className="line-clamp-1 w-full text-left">{selected.name}</p>{' '}
        {/* Display selected bank's name */}
      </SelectTrigger>
      <SelectContent
        className={`w-full bg-white md:w-[300px] ${otherStyles}`} // Apply custom styles to the dropdown
        align="end"
      >
        <SelectGroup>
          <SelectLabel className="py-2 font-normal text-gray-500">
            Select a bank to display
          </SelectLabel>
          {accounts.map((account: Account) => (
            <SelectItem
              key={account.id} // Use unique key for each item
              value={account.dbItemId} // Use the dbItemId as the value for each item
              className="cursor-pointer border-t" // Styling for each item
            >
              <div className="flex flex-col">
                <p className="text-16 font-medium">{account.name}</p>{' '}
                {/* Bank name */}
                <p className="text-14 font-medium text-blue-600">
                  {formatAmount(account.currentBalance)}{' '}
                  {/* Format and display the balance */}
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

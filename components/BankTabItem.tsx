'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { cn, formUrlQuery } from '@/lib/utils';

// BankTabItem component for rendering and handling bank tab item clicks
export const BankTabItem = ({ account, dbItemId }: BankTabItemProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = dbItemId === account?.dbItemId; // Check if the current item is active

  // Handle the bank tab change by updating the URL query
  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'id',
      value: account?.dbItemId, // Update the 'id' query parameter
    });
    router.push(newUrl, { scroll: false }); // Navigate to the new URL
  };

  return (
    <div
      onClick={handleBankChange} // On click, change the bank
      className={cn('banktab-item', {
        'border-blue-600': isActive, // Add active border style
      })}
    >
      <p
        className={cn('text-16 line-clamp-1 flex-1 font-medium text-gray-500', {
          'text-blue-600': isActive, // Apply active text color
        })}
      >
        {account.name} {/* Display account name */}
      </p>
    </div>
  );
};

'use client';

import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  cn,
  formUrlQuery,
  formatAmount,
  getAccountTypeColors,
} from '@/lib/utils';

// BankInfo component for rendering bank account info and handling tab changes
const BankInfo = ({ account, dbItemId, type }: BankInfoProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if the current account is active
  const isActive = dbItemId === account?.dbItemId;

  // Handle bank change by updating the URL query
  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'id',
      value: account?.dbItemId, // Update the 'id' query parameter
    });
    router.push(newUrl, { scroll: false }); // Navigate to the new URL
  };

  // Get the colors for the account based on its type
  const colors = getAccountTypeColors(account?.type as AccountTypes);

  return (
    <div
      onClick={handleBankChange} // On click, handle the bank change
      className={cn('bank-info', colors.bg, {
        'shadow-sm border-blue-700': type === 'card' && isActive, // Add styles if it's a card type and active
        'rounded-xl': type === 'card', // Apply rounded corners for card type
        'hover:shadow-sm cursor-pointer': type === 'card', // Apply hover effect for card type
      })}
    >
      <figure
        className={`flex-center h-fit rounded-full bg-blue-100 ${colors.lightBg}`}
      >
        <Image
          src="/icons/connect-bank.svg"
          width={20}
          height={20}
          alt={account.subtype}
          className="m-2 min-w-5"
        />
      </figure>
      <div className="flex w-full flex-1 flex-col justify-center gap-1">
        <div className="bank-info_content">
          <h2
            className={`text-16 line-clamp-1 flex-1 font-bold text-blue-900 ${colors.title}`}
          >
            {account.name}
          </h2>
          {type === 'full' && (
            <p
              className={`text-12 rounded-full px-3 py-1 font-medium text-blue-700 ${colors.subText} ${colors.lightBg}`}
            >
              {account.subtype}
            </p>
          )}
        </div>

        <p className={`text-16 font-medium text-blue-700 ${colors.subText}`}>
          {formatAmount(account.currentBalance)}{' '}
          {/* Format and display balance */}
        </p>
      </div>
    </div>
  );
};

export default BankInfo;

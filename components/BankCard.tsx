import { formatAmount } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import Copy from './Copy';

const BankCard = ({
  account,
  userName,
  showBalance = true,
}: CreditCardProps) => {
  return (
    <div className="flex flex-col">
      {/* Link to the transaction history page, passing the account dbItemId in the query parameter */}
      <Link
        href={`/transaction-history/?id=${account.dbItemId}`}
        className="bank-card"
      >
        <div className="bank-card_content">
          {/* Account name and formatted balance */}
          <div>
            <h1 className="text-16 font-semibold text-white">{userName}</h1>
            <p className="font-ibm-plex-serif font-black text-white">
              {formatAmount(account.currentBalance)}
            </p>
          </div>

          <article className="flex flex-col gap-2">
            {/* Account name and mask display */}
            <div className="flex justify-between">
              <h1 className="text-12 font-semibold text-white">
                {account.name}
              </h1>
              <h2 className="text-12 font-semibold text-white">●● / ●●</h2>
            </div>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● <span className="text-16">{account.mask}</span>
            </p>
          </article>
        </div>

        {/* Bank card icons */}
        <div className="bank-card_icon">
          <Image src="/icons/Paypass.svg" width={20} height={24} alt="pay" />
          <Image
            src="/icons/mastercard.svg"
            width={45}
            height={32}
            alt="mastercard"
            className="ml-5"
          />
        </div>

        {/* Background lines image */}
        <Image
          src="/icons/lines.png"
          width={316}
          height={190}
          alt="lines"
          className="absolute top-0 left-0 w-auto h-auto"
        />
      </Link>

      {/* Conditionally display the Copy component with the shareable ID */}
      {showBalance && <Copy title={account.shareableId} />}
    </div>
  );
};

export default BankCard;

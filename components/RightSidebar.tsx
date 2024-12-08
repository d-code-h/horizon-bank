import Image from 'next/image'; // Importing Next.js Image component for optimized images
import Link from 'next/link'; // Importing Next.js Link component for navigation
import React from 'react'; // Importing React to define the component
import BankCard from './BankCard'; // Importing the BankCard component
import { countTransactionCategories } from '@/lib/utils'; // Utility function to count transaction categories
import Category from './Category'; // Importing the Category component for displaying categories

// RightSidebar component that displays user's profile, bank accounts, and top categories
const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
  // Get the transaction categories using the utility function
  const categories: CategoryCount[] = countTransactionCategories(transactions);

  return (
    <aside className="right-sidebar">
      {/* Profile section */}
      <section className="flex flex-col pb-8">
        {/* Banner for the profile */}
        <div className="profile-banner" />

        {/* Profile information */}
        <div className="profile">
          <div className="profile-img">
            {/* Display the first letter of the user's name as a placeholder */}
            <span className="text-5xl font-bold text-blue-500">
              {user.name[0]} {/* First letter of the user's name */}
            </span>
          </div>

          {/* User's details */}
          <div className="profile-details">
            <h1 className="profile-name">{user.name.split(' ')[0]}</h1>{' '}
            {/* User's first name */}
            <p className="profile-email">{user.email}</p> {/* User's email */}
          </div>
        </div>
      </section>

      {/* Banks section */}
      <section className="banks">
        {/* Title and link to add a new bank */}
        <div className="flex w-full justify-between">
          <h2 className="header-2">My Banks</h2>
          <Link href="/" className="flex gap-2">
            <Image
              src="/icons/plus.svg"
              width={20}
              height={20}
              alt="plus" // Alt text for the icon
              className="w-auto h-auto"
            />
            <h2 className="text-14 font-semibold text-gray-600">Add Bank</h2>{' '}
            {/* Button to add a bank */}
          </Link>
        </div>

        {/* Rendering the banks if available */}
        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative z-10">
              {/* Displaying the first bank card */}
              <BankCard
                key={banks[0].id} // Using bank ID as the key for React list
                account={banks[0]} // Passing the first bank account data
                userName={user.name} // Passing the user's name
                showBalance={false} // Not showing balance on the card
              />
            </div>

            {/* Displaying the second bank card if it exists */}
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard
                  key={banks[1].id} // Using bank ID as the key for React list
                  account={banks[1]} // Passing the second bank account data
                  userName={user.name} // Passing the user's name
                  showBalance={false} // Not showing balance on the card
                />
              </div>
            )}
          </div>
        )}

        {/* Top categories section */}
        <div className="mt-10 flex flex-1 flex-col gap-6">
          <h2 className="header-2">Top categories</h2>

          <div className="space-y-5">
            {/* Mapping through categories and rendering them */}
            {categories.map((category) => (
              <Category key={category.name} category={category} /> //  Rendering each category
            ))}
          </div>
        </div>
      </section>
    </aside>
  );
};

// Exporting the RightSidebar component for use in other parts of the application
export default RightSidebar;

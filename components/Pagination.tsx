'use client';

import Image from 'next/image'; // Importing the Image component from Next.js for image handling
import { useRouter, useSearchParams } from 'next/navigation'; // Hooks from Next.js for navigation and accessing query params

import { Button } from '@/components/ui/button'; // Custom Button component
import { formUrlQuery } from '@/lib/utils'; // Utility function for building the URL query string

// Pagination component to navigate through pages
export const Pagination = ({ page, totalPages }: PaginationProps) => {
  const router = useRouter(); // Accessing the router for navigation
  const searchParams = useSearchParams()!; // Accessing the current query parameters

  // Function to handle the navigation between pages
  const handleNavigation = (type: 'prev' | 'next') => {
    const pageNumber = type === 'prev' ? page - 1 : page + 1; // Determine the new page number based on the direction

    // Form the new URL with the updated page query parameter
    const newUrl = formUrlQuery({
      params: searchParams.toString(), // Current search params
      key: 'page', // The key for the query parameter
      value: pageNumber.toString(), // The new page number as a string
    });

    router.push(newUrl, { scroll: false }); // Navigate to the new URL without scrolling
  };

  return (
    <div className="flex justify-between gap-3">
      {/* Previous Page Button */}
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => handleNavigation('prev')} // Call the navigation function for the previous page
        disabled={Number(page) <= 1} // Disable if it's the first page
      >
        <Image
          src="/icons/arrow-left.svg" // Left arrow icon
          alt="arrow"
          width={20}
          height={20}
          className="mr-2" // Styling for spacing
        />
        Prev
      </Button>

      {/* Page number display */}
      <p className="text-14 flex items-center px-2">
        {page} / {totalPages} {/* Display current page and total pages */}
      </p>

      {/* Next Page Button */}
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => handleNavigation('next')} // Call the navigation function for the next page
        disabled={Number(page) >= totalPages} // Disable if it's the last page
      >
        Next
        <Image
          src="/icons/arrow-left.svg" // Left arrow icon for next, rotated horizontally
          alt="arrow"
          width={20}
          height={20}
          className="ml-2 -scale-x-100" // Styling for spacing and flipping the arrow
        />
      </Button>
    </div>
  );
};

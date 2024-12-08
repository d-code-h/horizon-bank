'use client';

import CountUp from 'react-countup'; // Importing CountUp component for creating animated number counters.

const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full">
      {/* CountUp component to animate numbers. */}
      <CountUp
        decimals={2} // Specifies that the counter will display 2 decimal places.
        decimal="," // Defines the decimal separator (comma in this case).
        prefix="$" // Adds a dollar sign before the animated number.
        end={amount} // The target number the counter will animate to (based on the `amount` prop).
      />
    </div>
  );
};

export default AnimatedCounter;

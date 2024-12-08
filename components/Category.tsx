import Image from 'next/image';
import { topCategoryStyles } from '@/constants';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

// Category component to display category information with a progress bar
const Category = ({ category }: CategoryProps) => {
  // Destructure styles for the category from the topCategoryStyles constant
  const {
    bg,
    circleBg,
    text: { main, count },
    progress: { bg: progressBg, indicator },
    icon,
  } = topCategoryStyles[category.name as keyof typeof topCategoryStyles] ||
  topCategoryStyles.default;

  return (
    <div className={cn('gap-[18px] flex p-4 rounded-xl', bg)}>
      {/* Icon with circular background */}
      <figure className={cn('flex-center size-10 rounded-full', circleBg)}>
        <Image src={icon} width={20} height={20} alt={category.name} />
      </figure>

      {/* Category name, count, and progress */}
      <div className="flex w-full flex-1 flex-col gap-2">
        <div className="text-14 flex justify-between">
          <h2 className={cn('font-medium', main)}>{category.name}</h2>
          <h3 className={cn('font-normal', count)}>{category.count}</h3>
        </div>

        {/* Progress bar showing percentage */}
        <Progress
          value={(category.count / category.totalCount) * 100} // Calculate progress
          className={cn('h-2 w-full', progressBg)} // Progress bar background style
          indicatorClassName={cn('h-2 w-full', indicator)} // Progress bar indicator style
        />
      </div>
    </div>
  );
};

export default Category;

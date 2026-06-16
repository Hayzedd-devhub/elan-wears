'use client';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryTabsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-hide touch-pan-x transform-gpu">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-[background-color,color,border-color,box-shadow] duration-200 border ${
          activeCategory === 'all'
            ? 'bg-chocolate dark:bg-gold text-white dark:text-chocolate border-chocolate dark:border-gold shadow-md'
            : 'bg-white dark:bg-chocolate-light/10 text-chocolate dark:text-gold-light border-gray-200 dark:border-gold/20 hover:border-gold/50'
        }`}
      >
        All Collection
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-5 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-[background-color,color,border-color,box-shadow] duration-200 border ${
            activeCategory === category
              ? 'bg-chocolate dark:bg-gold text-white dark:text-chocolate border-chocolate dark:border-gold shadow-md'
              : 'bg-white dark:bg-chocolate-light/10 text-chocolate dark:text-gold-light border-gray-200 dark:border-gold/20 hover:border-gold/50'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}


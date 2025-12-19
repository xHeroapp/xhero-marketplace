import React from "react";

export const useSortedCategories = (categoriesData) => {
  // Sort categories to put "Others" at the end
  const sortedCategories = React.useMemo(() => {
    if (!categoriesData) return [];

    const categories = [...categoriesData];
    return categories.sort((a, b) => {
      const aIsOthers = a.name.toLowerCase() === "others";
      const bIsOthers = b.name.toLowerCase() === "others";

      if (aIsOthers) return 1;
      if (bIsOthers) return -1;
      return 0;
    });
  }, [categoriesData]);

  return { sortedCategories };
};

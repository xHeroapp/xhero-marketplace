import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { PRODUCT_LIMIT } from "@/constant/constant";

/**
 * Generic filter hook for managing search, status, and date range filters
 */
export function useFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("");
  const [orderby, setOrderBy] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const limit = PRODUCT_LIMIT;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filters = useMemo(
    () => ({
      search: debouncedSearchTerm,
      status,
      category,
      startDate,
      endDate,
    }),
    [debouncedSearchTerm, status, category, startDate, endDate]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatus("all");
    setCategory("");
    setStartDate(null);
    setEndDate(null);
  }, []);

  return {
    searchTerm,
    status,
    category,
    orderby,
    startDate,
    endDate,
    filters,
    page,
    limit,
    setStatus,
    setCategory,
    setOrderBy,
    setStartDate,
    setEndDate,
    handleSearchChange,
    clearFilters,
    setPage,
  };
}

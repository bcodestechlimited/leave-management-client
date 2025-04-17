import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  pagination: {
    totalCount: number;
    filteredCount: number;
    totalPages: number;
    limit: number;
    page: number;
  };
}

export default function CustomPagination({ pagination }: PaginationProps) {
  const { totalPages, page = 1, limit = 10 } = pagination;
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.has("page")) {
      searchParams.set("page", page.toString());
    }
    if (!searchParams.has("limit")) {
      searchParams.set("limit", limit.toString());
    }
    setSearchParams(searchParams);
  }, []);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return; // Prevent invalid page navigation
    setSearchParams({ page: page.toString() });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Number of visible page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if endPage is at the limit
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Render "..." if there are pages before the startPage
    if (startPage > 1) {
      pages.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Render page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
            aria-label={`Go to page ${i}`}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Render "..." if there are pages after the endPage
    if (endPage < totalPages) {
      pages.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null; // Don't render pagination if there's only one page

  return (
    <Pagination className="my-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label="Go to next page"
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

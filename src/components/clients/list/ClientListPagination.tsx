
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ClientListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ClientListPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ClientListPaginationProps) {
  const isMobile = useIsMobile();
  
  // Generate page numbers
  const generatePagination = () => {
    // For mobile, show fewer page numbers
    const maxPages = isMobile ? 3 : 5;
    
    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = [leftSiblingIndex, currentPage, rightSiblingIndex];
      return [1, "...", ...middleRange, "...", totalPages];
    }
  };

  const pages = generatePagination();

  return (
    <div className="flex items-center justify-center space-x-1">
      <Button
        variant="outline"
        size="icon"
        className={`h-8 w-8 ${isMobile ? 'p-0' : ''}`}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Pagina precedente</span>
      </Button>
      
      {!isMobile && pages?.map((page, i) => (
        <Button
          key={i}
          variant={currentPage === page ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
        >
          {page === "..." ? (
            <MoreHorizontal className="h-4 w-4" />
          ) : (
            <span>{page}</span>
          )}
        </Button>
      ))}
      
      {isMobile && (
        <span className="text-sm px-2">
          Pagina {currentPage} di {totalPages}
        </span>
      )}
      
      <Button
        variant="outline"
        size="icon"
        className={`h-8 w-8 ${isMobile ? 'p-0' : ''}`}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Pagina successiva</span>
      </Button>
    </div>
  );
}

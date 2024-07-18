import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  // Calculate which page numbers to display based on current page
  const calculatePagesToShow = () => {
    const pagesToShow: (number | string)[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pagesToShow.push(i);
      }
    } else {
      pagesToShow.push(1);
      if (showEllipsisStart) pagesToShow.push('...');
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pagesToShow.push(i);
      }
      if (showEllipsisEnd) pagesToShow.push('...');
      pagesToShow.push(totalPages);
    }
    return pagesToShow;
  };

  const pageNumbers = calculatePagesToShow();

  // If there is only one page, do not display pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mb-4 pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-400 rounded shadow pagination-prev ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ArrowLeftIcon className="h-5 w-5 inline-block -mt-1 mr-1" /> Previous
      </button>
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && handlePageChange(page)}
          className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold pagination-num border border-gray-400 rounded shadow ${
            currentPage === page ? 'bg-gray-200' : ''
          } ${page === '...' ? 'cursor-default' : ''}`}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold pagination-next border border-gray-400 rounded shadow ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Next <ArrowRightIcon className="h-5 w-5 inline-block -mt-1 ml-1" />
      </button>
    </div>
  );
};

export default Pagination;

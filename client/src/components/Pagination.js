import React from "react";

const Pagination = ({ currentPage, totalPages, paginate }) => {
  const pageNumbers = [];

  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 2) {
      pageNumbers.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 1) {
      pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
  }

  return (
    <div className="companies__pagination">
      {pageNumbers.map((number, index) => (
        <button
          key={index}
          onClick={() => paginate(number)}
          className={`companies__pagination__numbers ${
            currentPage === number ? "companies__pagination__active" : ""
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;

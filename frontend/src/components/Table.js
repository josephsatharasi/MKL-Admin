import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Table = ({ columns, data, onRowClick, renderActions, emptyMessage = "No data found", rowsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="rounded-xl shadow-lg overflow-hidden bg-white mb-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead className="text-white sticky top-0 z-10" style={{background: '#1e3a8a'}}>
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-4 md:px-6 py-3 text-left text-sm ${col.hideOnMobile ? 'hidden md:table-cell' : ''} ${col.hideOnTablet ? 'hidden lg:table-cell' : ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr 
                key={row._id || row.id || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'cursor-pointer' : ''}
                style={{backgroundColor: index % 2 === 0 ? 'white' : '#1e3a8a1A'}}
              >
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx}
                    className={`px-4 md:px-6 py-4 text-sm ${col.hideOnMobile ? 'hidden md:table-cell' : ''} ${col.hideOnTablet ? 'hidden lg:table-cell' : ''} ${col.bold ? 'font-semibold' : ''}`}
                    style={col.color ? {color: col.color} : {}}
                    onClick={col.stopPropagation ? (e) => e.stopPropagation() : undefined}
                  >
                    {col.render ? col.render(row, index) : row[col.field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      )}
      {data.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              style={{borderColor: '#1e3a8a', color: '#1e3a8a'}}
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === page
                        ? 'text-white font-semibold'
                        : 'border hover:bg-gray-100'
                    }`}
                    style={currentPage === page ? {background: '#1e3a8a'} : {borderColor: '#1e3a8a', color: '#1e3a8a'}}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2">...</span>;
              }
              return null;
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              style={{borderColor: '#1e3a8a', color: '#1e3a8a'}}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;

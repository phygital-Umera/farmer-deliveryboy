import React, { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { FiEye } from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa';

type Button<T> = {
  label: string;
  onClick: (item: T) => void;
  className?: string;
  icon?: React.ReactNode;
};

export type Column<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  render?: (item: T, index?: number) => React.ReactNode;
  className?: string;
  buttons?: Button<T>[];
  sortable?: boolean;
  action?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onCellClick?: (item: T) => void;
};

type GenericTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  searchAble?: boolean;
  title?: string;
  action?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  paginationOff?: boolean;
  onView?: (item: T) => void;
  showBackButton?: boolean;
  onBack?: () => void;
  onRowClick?: (item: T) => void;
  showSrNo?: boolean;
  actionButton?: React.ReactNode;
  customActions?: (item: T) => React.ReactNode;
};

export const GenericTable = <T,>({
  data,
  columns,
  itemsPerPage = 5,
  searchAble,
  action,
  title,
  onEdit: handleEdit,
  onDelete: handleDelete,
  paginationOff = false,
  onView,
  showBackButton = false,
  onBack,
  onRowClick,
  showSrNo = false,
  actionButton,
  customActions,
}: GenericTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const sortedData = React.useMemo(() => {
    const sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue =
          typeof sortConfig.key === 'function'
            ? (sortConfig.key as (a: T) => string | number | boolean)(a)
            : a[sortConfig.key];
        const bValue =
          typeof sortConfig.key === 'function'
            ? (sortConfig.key as (a: T) => string | number | boolean)(b)
            : b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = sortedData.filter((item) =>
    columns.some((column) => {
      const value =
        typeof column.accessor === 'function'
          ? column.accessor(item)
          : item[column.accessor];
      return value
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }),
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;

  const paginatedData = paginationOff
    ? filteredData
    : filteredData.slice(startIdx, startIdx + itemsPerPage);

  // Handle row click with event prevention
  const handleRowClick = (item: T, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('.action-button')) {
      return;
    }
    if (onRowClick) {
      onRowClick(item);
    }
  };

  // Create columns with SR No. if enabled - left aligned
  const displayColumns = React.useMemo(() => {
    if (showSrNo) {
      return [
        {
          header: 'Sr No.',
          accessor: 'srNo' as keyof T,
          render: (_item: T, index: number) => (
            <span className="text-md font-medium  dark:text-slate-300 text-left block w-full">
              {startIdx + (index || 0) + 1}
            </span>
          ),
          className: 'min-w-[40px] w-[40px] max-w-[40px] text-left px-1',
        },
        ...columns,
      ];
    }
    return columns;
  }, [columns, showSrNo, startIdx]);

  return (
    <div className="rounded-sm border border-stroke bg-white px-3 pb-2 pt-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4 sm:pt-4 md:px-6">
      {/* Title and Action Button Row */}
      {(title || actionButton) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
          <div className="flex items-center gap-2">
            {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="hover:bg-gray-100 rounded p-1.5 transition-colors dark:hover:bg-meta-4"
                aria-label="Go back"
              >
                <FaArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
            {title && (
              <h2 className="text-base font-semibold text-primary-navy dark:text-pure-white sm:text-lg">
                {title}
              </h2>
            )}
          </div>
          {actionButton && (
            <div className="flex-shrink-0">
              {actionButton}
            </div>
          )}
        </div>
      )}

      {/* Search Bar */}
      {searchAble && (
        <div className="mb-3 flex justify-between sm:mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-1.5 text-sm outline-none transition focus:border-primary-navy active:border-primary-navy disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary-navy"
          />
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-primary-navy dark:bg-primary-navy">
              {displayColumns.map((column, index) => {
                const isSrNoColumn = showSrNo && index === 0;
                return (
                  <th
                    key={index}
                    className={`px-2 py-2.5 font-semibold text-pure-white text-sm sm:px-3 sm:py-3 ${isSrNoColumn ? 'text-left' : 'text-center'} ${column.className || ''}`}
                    onClick={
                      column.sortable
                        ? () => handleSort(column.accessor as keyof T)
                        : undefined
                    }
                    style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                  >
                    <div className={`flex items-center gap-1 text-sm ${isSrNoColumn ? 'justify-start' : 'justify-center'}`}>
                      {column.header}
                      {sortConfig?.key === column.accessor && (
                        <span className="text-accent-teal text-xs">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              {action && (
                <th className="min-w-[80px] px-2 py-2.5 sm:min-w-[100px] sm:px-3 sm:py-3">
                  <div className="font-semibold text-pure-white text-sm text-center">
                    Action
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b border-stroke transition-colors dark:border-strokedark
                  ${rowIndex % 2 === 0
                    ? 'bg-pure-white dark:bg-primary-navy/15'
                    : 'bg-slate-100 dark:bg-primary-navy/30'
                  }
                  ${onRowClick
                    ? 'cursor-pointer hover:bg-primary-navy/20 dark:hover:bg-primary-navy/40'
                    : 'hover:bg-primary-navy/10 dark:hover:bg-primary-navy/25'
                  }`}
                onClick={(e) => onRowClick && handleRowClick(item, e)}
              >
                {displayColumns.map((column, colIndex) => {
                  const value =
                    typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : item[column.accessor];

                  const isSrNoColumn = showSrNo && colIndex === 0;

                  return (
                    <td
                      key={colIndex}
                      className={`border-b border-slate-100 px-2 py-2 text-sm font-medium dark:border-strokedark sm:px-3 sm:py-2.5 ${isSrNoColumn ? 'text-left' : 'text-center'} ${column.className || ''}`}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('button')) {
                          e.stopPropagation();
                          return;
                        }
                        if (column.onCellClick) {
                          e.stopPropagation();
                          column.onCellClick(item);
                        }
                      }}
                      style={{
                        cursor: column.onCellClick ? 'pointer' : undefined,
                      }}
                    >
                      <div className={`py-0.5 sm:py-1 ${isSrNoColumn ? 'text-left' : 'text-center'}`}>
                        {column.render
                          ? column.render(item, rowIndex)
                          : typeof value === 'string'
                            ? value
                            : JSON.stringify(value)}
                        {column.buttons && (
                          <div className={`mt-1 flex flex-wrap gap-1 ${isSrNoColumn ? 'justify-start' : 'justify-center'}`}>
                            {column.buttons.map((button, btnIndex) => (
                              <button
                                key={btnIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  button.onClick(item);
                                }}
                                className={`rounded px-2 py-1 text-xs font-medium transition-colors sm:px-2.5 sm:py-1 ${button.className || 'bg-accent-teal/10 text-accent-teal hover:bg-accent-teal hover:text-pure-white'}`}
                              >
                                {button.icon || button.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
                {action && (
                  <td className="border-b border-slate-100 px-2 py-2 dark:border-strokedark sm:px-3 sm:py-2.5">
                    <div className="flex items-center justify-center gap-1 action-buttons">
                      {onView && (
                        <button
                          className="rounded p-1 text-slate-600 hover:bg-accent-teal/10 hover:text-accent-teal transition-colors dark:text-bodydark action-button sm:p-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(item);
                          }}
                          title="View"
                        >
                          <FiEye className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      )}
                      {handleEdit && (
                        <button
                          className="rounded p-1 text-slate-600 hover:bg-primary-navy/10 hover:text-primary-navy transition-colors dark:text-bodydark action-button sm:p-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                          title="Edit"
                        >
                          <FiEdit className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      )}
                      {handleDelete && (
                        <button
                          className="rounded p-1 text-slate-600 hover:bg-red-500/10 hover:text-red-500 transition-colors dark:text-bodydark action-button sm:p-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
                          title="Delete"
                        >
                          <MdDelete className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      )}
                      {customActions && customActions(item)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={displayColumns.length + (action ? 1 : 0)}
                  className="py-8 text-center text-sm text-slate-500 dark:text-bodydark sm:py-10"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!paginationOff && (
        <div className="mt-3 flex flex-col items-center gap-2 sm:mt-4 sm:flex-row sm:justify-between sm:gap-0">
          <span className="text-xs text-slate-600 dark:text-bodydark sm:text-sm">
            Page{' '}
            <span className="font-semibold text-primary-navy dark:text-pure-white">
              {currentPage}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-primary-navy dark:text-pure-white">
              {totalPages}
            </span>
            <span className="ml-1 text-slate-400 sm:ml-2">
              ({totalItems} records)
            </span>
          </span>
          <div className="flex items-center gap-1">
            <button
              className="rounded-lg border border-stroke p-1 text-slate-600 hover:bg-primary-navy hover:text-pure-white hover:border-primary-navy transition-all disabled:opacity-40 disabled:cursor-not-allowed dark:border-strokedark dark:text-bodydark sm:p-1.5"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous page"
            >
              <GrFormPrevious className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              className="rounded-lg border border-stroke p-1 text-slate-600 hover:bg-primary-navy hover:text-pure-white hover:border-primary-navy transition-all disabled:opacity-40 disabled:cursor-not-allowed dark:border-strokedark dark:text-bodydark sm:p-1.5"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next page"
            >
              <GrFormNext className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericTable;
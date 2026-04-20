import { useState, useMemo, type ReactNode } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table/table";

type ImageColumnType = {
  type: "image";
  key: string;
  srcKey: string;
  altKey: string;
  imageClassName?: string;
  containerClassName?: string;
  label: string;
  headerClassName?: string;
  cellClassName?: string;
};

type BadgeColumnType = {
  type: "badge";
  key: string;
  label: string;
  colorMap?: Record<string, "success" | "warning" | "error" | "info" | "primary">;
  headerClassName?: string;
  cellClassName?: string;
};

type TextColumnType = {
  type: "text";
  key: string;
  label: string;
  headerClassName?: string;
  cellClassName?: string;
};

type CustomColumnType = {
  type: "custom";
  key: string;
  label: string;
  headerClassName?: string;
  cellClassName?: string;
  render: (value: unknown, row: Record<string, unknown>) => ReactNode;
};

type ColumnType = ImageColumnType | BadgeColumnType | TextColumnType | CustomColumnType;

export type { ColumnType, ImageColumnType, BadgeColumnType, TextColumnType, CustomColumnType };

interface DataTableProps {
  columns: ColumnType[];
  data: any;
  // External pagination props
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (size: number) => void;
  // Internal or external pagination mode
  showPagination?: boolean;
  containerClassName?: string;
  emptyMessage?: string;
  // Loading state
  isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  itemsPerPage: externalItemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showPagination = true,
  containerClassName = "",
  emptyMessage = "No data available",
  isLoading = false,
}) => {
  // Internal state for when external pagination is not provided
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(5);

  // Determine if using external or internal pagination
  const isExternalPagination = externalCurrentPage !== undefined && externalTotalPages !== undefined;

  const currentPage = isExternalPagination ? externalCurrentPage : internalCurrentPage;
  const itemsPerPage = externalItemsPerPage || internalItemsPerPage;

  // Calculate total pages
  const calculatedTotalPages = Math.ceil(data.length / itemsPerPage);
  const totalPages = isExternalPagination ? externalTotalPages! : calculatedTotalPages;

  // Paginate data (only for internal mode, external should already be paginated)
  const paginatedData = useMemo(() => {
    if (isExternalPagination) {
      return data; // Data already paginated from server
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage, isExternalPagination]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (isExternalPagination && onPageChange) {
        onPageChange(page);
      } else {
        setInternalCurrentPage(page);
      }
    }
  };

  const handleItemsPerPageChange = (newSize: number) => {
    if (isExternalPagination && onItemsPerPageChange) {
      onItemsPerPageChange(newSize);
    } else {
      setInternalItemsPerPage(newSize);
      setInternalCurrentPage(1);
    }
  };

  const renderCell = (column: ColumnType, row: Record<string, unknown>) => {
    const value = row[column.key];

    if (column.type === "custom") {
      return column.render(value, row);
    }

    if (column.type === "image") {
      const src = row[column.srcKey] as string;
      const alt = row[column.altKey] as string;
      return (
        <div className={`w-10 h-10 overflow-hidden rounded-full ${column.containerClassName || ""}`}>
          <img
            width={40}
            height={40}
            src={src}
            alt={alt}
            className={column.imageClassName || "w-full h-full object-cover"}
          />
        </div>
      );
    }

    if (column.type === "badge") {
      const badgeColors = column.colorMap || {
        Active: "success",
        Pending: "warning",
        Cancel: "error",
      };
      const color = badgeColors[value as string] || "info";
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full text-theme-xs font-medium ${
            color === "success"
              ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
              : color === "warning"
              ? "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400"
              : color === "error"
              ? "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
              : color === "info"
              ? "bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500"
              : "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400"
          }`}
        >
          {String(value)}
        </span>
      );
    }

    return value as ReactNode;
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`w-full rounded-xl border border-gray-200 bg-white ${containerClassName}`}
    >
      <div className="overflow-x-auto">
        <Table className="whitespace-nowrap">
          <TableHeader className="border-b border-gray-100 bg-white">
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  isHeader
                  className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs ${column.headerClassName || ""}`}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-5 py-8 text-center text-gray-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#F48120] border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-5 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row: Record<string, unknown>, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`px-5 py-4 text-gray-700 text-start text-theme-sm ${column.cellClassName || ""}`}
                    >
                      {renderCell(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-theme-sm">
              Items per page:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) =>
                handleItemsPerPageChange(Number(e.target.value))
              }
              className="px-2 py-1 rounded-md border border-gray-200 bg-white text-gray-700 text-theme-sm focus:outline-none focus:ring-2 focus:ring-[#F48120]/50"
            >
              {[5, 10, 15, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 text-theme-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {renderPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1.5 text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`px-3 py-1.5 rounded-md text-theme-sm ${
                    currentPage === page
                      ? "bg-[#F48120] text-white"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 text-theme-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <span className="text-gray-500 text-theme-sm">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default DataTable;

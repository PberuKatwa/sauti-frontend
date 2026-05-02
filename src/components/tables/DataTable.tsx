import { useState, useMemo, type ReactNode } from "react";
import Badge from "../ui/badge/Badge";

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

type CheckboxColumnType = {
  type: "checkbox";
  key: string;
  label?: string;
  headerClassName?: string;
  cellClassName?: string;
};

type ActionColumnType = {
  type: "action";
  key: string;
  label: string;
  headerClassName?: string;
  cellClassName?: string;
  render: (row: Record<string, unknown>) => ReactNode;
};

type ColumnType = ImageColumnType | BadgeColumnType | TextColumnType | CustomColumnType | CheckboxColumnType | ActionColumnType;

export type { ColumnType, ImageColumnType, BadgeColumnType, TextColumnType, CustomColumnType, CheckboxColumnType, ActionColumnType };

interface DataTableProps {
  columns: ColumnType[];
  data: any[];
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
  // Checkbox selection
  showSelection?: boolean;
  selectedRows?: Set<number>;
  onSelectRow?: (index: number) => void;
  onSelectAll?: () => void;
  // Row actions
  onEdit?: (row: Record<string, unknown>, index: number) => void;
  onDelete?: (row: Record<string, unknown>, index: number) => void;
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
  showSelection = false,
  selectedRows = new Set(),
  onSelectRow,
  onSelectAll,
  onEdit,
  onDelete,
}) => {
  // Internal state for when external pagination is not provided
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(10);

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

  const allSelected = paginatedData.length > 0 && paginatedData.every((_, index) => selectedRows.has(index));
  const someSelected = paginatedData.some((_, index) => selectedRows.has(index)) && !allSelected;

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll();
    }
  };

  const handleSelectRow = (index: number) => {
    if (onSelectRow) {
      onSelectRow(index);
    }
  };

  const getBadgeColor = (value: string, colorMap?: Record<string, "success" | "warning" | "error" | "info" | "primary">) => {
    const defaultMap: Record<string, "success" | "warning" | "error" | "info" | "primary"> = {
      Active: "success",
      Pending: "warning",
      Cancel: "error",
      Completed: "success",
      Processing: "info",
      Shipped: "primary",
      Delivered: "success",
      Paid: "success",
      Unpaid: "error",
      Draft: "info",
    };
    return colorMap?.[value] || defaultMap[value] || "info";
  };

  const renderCell = (column: ColumnType, row: Record<string, unknown>, rowIndex: number) => {
    // Handle checkbox column
    if (column.type === "checkbox" || (showSelection && column.type === "action" && column.key === "actions")) {
      return null; // Checkboxes are rendered separately
    }

    const value = row[column.key];

    if (column.type === "custom") {
      return column.render(value, row);
    }

    if (column.type === "action") {
      return column.render(row);
    }

    if (column.type === "image") {
      const src = row[column.srcKey] as string;
      const alt = row[column.altKey] as string;
      return (
        <div className={`w-10 h-10 overflow-hidden rounded-xs ${column.containerClassName || ""}`}>
          <img
            width={40}
            height={40}
            src={src || "/placeholder.png"}
            alt={alt || ""}
            className={column.imageClassName || "w-full h-full object-cover"}
          />
        </div>
      );
    }

    if (column.type === "badge") {
      const color = getBadgeColor(value as string, column.colorMap);
      return (
        <Badge color={color} variant="light" size="sm">
          {String(value)}
        </Badge>
      );
    }

    return <span className="text-body">{value as ReactNode}</span>;
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

  // Filter out checkbox columns from the columns array for rendering
  const displayColumns = columns.filter(col => col.type !== "checkbox");

  return (
    <div className={`relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default ${containerClassName}`}>
      <table className="w-full text-xs text-left rtl:text-right text-body">
        <thead className="text-xs text-body bg-neutral-secondary-medium border-b border-default-medium">
          <tr>
            {showSelection && (
              <th scope="col" className="p-2">
                <div className="flex items-center">
                  <input
                    id="table-checkbox-all"
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = someSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft cursor-pointer"
                  />
                  <label htmlFor="table-checkbox-all" className="sr-only">Select all</label>
                </div>
              </th>
            )}
            {displayColumns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-2 py-2 font-medium ${column.headerClassName || ""}`}
              >
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th scope="col" className="px-2 py-2 font-medium">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="bg-neutral-primary-soft border-b border-default">
              <td
                colSpan={displayColumns.length + (showSelection ? 1 : 0) + ((onEdit || onDelete) ? 1 : 0)}
                className="px-6 py-3 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-body">
                  <div className="w-4 h-4 border-2 border-[#F48120] border-t-transparent rounded-full animate-spin" />
                  Loading...
                </div>
              </td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr className="bg-neutral-primary-soft border-b border-default">
              <td
                colSpan={displayColumns.length + (showSelection ? 1 : 0) + ((onEdit || onDelete) ? 1 : 0)}
                className="px-6 py-8 text-center text-body"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row: Record<string, unknown>, rowIndex: number) => (
              <tr
                key={rowIndex}
                className={`bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium ${selectedRows.has(rowIndex) ? "bg-neutral-secondary-medium" : ""}`}
              >
                {showSelection && (
                  <td className="w-4 p-2">
                    <div className="flex items-center">
                      <input
                        id={`table-checkbox-${rowIndex}`}
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleSelectRow(rowIndex)}
                        className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft cursor-pointer"
                      />
                      <label htmlFor={`table-checkbox-${rowIndex}`} className="sr-only">Select row</label>
                    </div>
                  </td>
                )}
                {displayColumns.map((column) => (
                  <td
                    key={column.key}
                    scope={column.type === "text" && column.key === displayColumns[0]?.key ? "row" : undefined}
                    className={`px-2 py-2 ${column.cellClassName || ""} ${column.type === "text" && column.key === displayColumns[0]?.key ? "font-medium text-heading whitespace-nowrap" : "text-body"}`}
                  >
                    {renderCell(column, row, rowIndex)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="flex items-center px-2 py-2">
                    {onEdit && (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onEdit(row, rowIndex);
                        }}
                        className="font-medium text-fg-brand hover:underline"
                      >
                        Edit
                      </a>
                    )}
                    {onDelete && (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete(row, rowIndex);
                        }}
                        className={`font-medium text-danger hover:underline ${onEdit ? "ms-3" : ""}`}
                      >
                        Remove
                      </a>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showPagination && totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3 border-t border-default-medium bg-neutral-primary-soft rounded-b-base">
          <div className="flex items-center gap-2">
            <span className="text-body text-xs">
              Items per page:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 rounded-xs border border-default-medium bg-neutral-primary-soft text-body text-xs focus:outline-none focus:ring-2 focus:ring-brand-soft"
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
              className="px-3 py-1.5 rounded-xs border border-default-medium text-body text-xs hover:bg-neutral-secondary-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {renderPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1.5 text-body text-xs"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`px-3 py-1.5 rounded-xs text-xs transition-colors ${
                    currentPage === page
                      ? "bg-[#F48120] text-white"
                      : "border border-default-medium text-body hover:bg-neutral-secondary-medium"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xs border border-default-medium text-body text-xs hover:bg-neutral-secondary-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>

          <span className="text-body text-xs">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default DataTable;

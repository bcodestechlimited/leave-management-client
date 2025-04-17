import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import CustomPagination from "./custom-pagination";
import { Loader } from "./loader";

interface Column {
  header: string;
  render: (row: any) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column[];
  data: T[];
  isLoading?: boolean;
  noDataMessage?: string;
  pagination?: {
    totalCount: number;
    filteredCount: number;
    totalPages: number;
    limit: number;
    page: number;
  };
}

export default function DataTable<T>({
  columns,
  data,
  isLoading = false,
  noDataMessage = "No data available.",
  pagination,
}: TableProps<T>) {
  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  if (!data.length) {
    return <div className="p-4 text-center">{noDataMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => {
                return (
                  <TableCell key={colIndex} className="text-start">
                    {column.render(row)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Render pagination if pagination prop is provided */}
      {pagination && <CustomPagination pagination={pagination} />}
    </div>
  );
}

"use client";

import type * as React from "react";
import { useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfiniteTableProps } from "./types/table";
import toast from "react-hot-toast";

/**
 * A table component that supports infinite scrolling to load more data.
 * It fetches data in chunks as the user scrolls to the bottom.
 *
 * @template T The type of data objects in the table rows.
 */
export function InfiniteTable<T>({
  data,
  columns,
  fetchMoreData,
  title,
  description,
  className,
  headerClassName,
  rowClassName,
  cellClassName,
  scrollAreaHeight = "200px",
  isFetching = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  errorMessage = undefined,
}: InfiniteTableProps<T>) {
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const loadMoreData = () => {
    if (fetchMoreData) {
      fetchMoreData();
    }
    if (errorMessage) {
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      // Check if user is near the bottom (e.g., within 100px of the end)
      const isAtBottom =
        viewport.scrollHeight - viewport.scrollTop <=
        viewport.clientHeight + 100;
      if (isAtBottom) {
        loadMoreData();
      }
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => {
      viewport.removeEventListener("scroll", handleScroll);
    };
  }, [loadMoreData, isFetching, isFetchingNextPage]);

  return (
    <Card className={cn("w-full", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ScrollArea
          className={cn("w-full", scrollAreaHeight)}
          ref={scrollViewportRef}
        >
          <Table>
            <TableHeader className={headerClassName}>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-16 text-center"
                  >
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <span className="sr-only">Loading data...</span>
                  </TableCell>
                </TableRow>
              )}

              {data.length === 0 && (!isFetching || !isFetchingNextPage) && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No data available.
                  </TableCell>
                </TableRow>
              )}

              {data.length > 0 &&
                data.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className={rowClassName}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className={cellClassName}>
                        {column.cell
                          ? column.cell(row)
                          : (row as any)[column.accessorKey]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {isFetchingNextPage && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-16 text-center"
                  >
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <span className="sr-only">Loading more items...</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

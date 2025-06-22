"use client";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types";
import React, { useEffect, useState } from "react";
import { ArrowUpDown, Pencil, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchTransactions } from "@/app/actions/transactionManagement";
import TransactionDeletePopUp from "@/components/transactions/transactionDeletePopUp";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

function TransactionPage() {
  const router = useRouter();

  const yesterday = new Date();
  const today = new Date();
  yesterday.setDate(today.getDate() - 1);

  function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [transactionStatus, setTransactionStatus] =
    useState<string>("Available");
  const [startDateInput, setStartDateInput] = useState<string>(
    formatDate(yesterday)
  );
  const [endDateInput, setEndDateInput] = useState<string>(
    formatDate(today)
  );

  const handleRecordsChange = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: Number(value),
      pageIndex: 0,
    }));
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < table.getPageCount()) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: page,
      }));
    }
  };

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      const { data } = await fetchTransactions(transactionStatus);
      if (Array.isArray(data)) {
        setTransactionsList(data);
      } else {
        setTransactionsList([]);
      }
      setLoading(false);
    }
    loadUsers();
  }, [transactionStatus]);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      let startISO = "";
      let endISO = "";

      if (startDateInput) {
        const [year, month, day] = startDateInput.split("-");
        const start = new Date(
          Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day))
        );
        startISO = start.toISOString();
      }

      if (endDateInput) {
        const [year, month, day] = endDateInput.split("-");
        const end = new Date(
          Date.UTC(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            23,
            59,
            59,
            999
          )
        );
        endISO = end.toISOString();
      }

      const { data } = await fetchTransactions(
        transactionStatus,
        startISO,
        endISO
      );

      if (Array.isArray(data)) {
        setTransactionsList(data);
      } else {
        setTransactionsList([]);
      }
      setLoading(false);
      // Reset to first page when filters change
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
    loadUsers();
  }, [transactionStatus, startDateInput, endDateInput]); // Add dependencies

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "users.username",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Member Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "transactionType.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Transaction Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue("amount") as number;
        return value ? `Rs. ${value}` : "-";
      },
    },
    {
      accessorKey: "discountAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Discount Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue("discountAmount") as number;
        return value ? `Rs. ${value}` : "-";
      },
    },
    {
      accessorKey: "discountPercentage",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Discount Percentage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue("discountPercentage") as number;
        return value ? `${value}%` : "-";
      },
    },
    {
      accessorKey: "finalAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Final Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue("finalAmount") as number;
        return value ? `Rs. ${value}` : "-";
      },
    },
    {
      accessorKey: "paymentMethod",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Payment Method
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue("paymentMethod") as string;
        return value
          ? value
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "";
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue("created_at") as string;
        return value ? value.split("T")[0] : "";
      },
    },
    {
      id: "actions",
      header: "More Action",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="space-x-2">
            <Button
              variant="outline"
              className="ml-2"
              onClick={() =>
                router.push(
                  `/dashboard/transactions/edit?trans=${transaction.id}`
                )
              }
            >
              <Pencil />
            </Button>
            <TransactionDeletePopUp transactionId={transaction.id} />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: transactionsList,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <Loader />;

  return (
    <div className="p-4 w-full space-y-6 min-h-screen flex flex-col">
      <div className="flex justify-between items-center">
        <div className="space-y-2 w-full">
          <p className="text-2xl font-semibold">Transactions</p>
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-3">
              <Input
                placeholder="Search..."
                icon={<Search />}
                value={
                  (table
                    .getColumn("users_username")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("users_username")
                    ?.setFilterValue(event.target.value)
                }
                className="w-96"
              />
              <Select
                value={transactionStatus}
                onValueChange={setTransactionStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select member status" />
                </SelectTrigger>
                <SelectContent>
                  {["All", "Available", "Updated", "Deleted"].map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Label>Start Date</Label>
              <Input
                type="date"
                placeholder="Start Date"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
              />
              <Label>End Date</Label>
              <Input
                type="date"
                placeholder="End Date"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-scroll ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* pagination */}
      <div className="flex justify-between items-center w-full">
        <div className="space-y-1.5">
          <p className="text-sm text-gray-500">
            Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
            {Math.min(
              (pagination.pageIndex + 1) * pagination.pageSize,
              transactionsList.length
            )}{" "}
            of {transactionsList.length} entries
          </p>
          <div className="w-48">
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={handleRecordsChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Records per page" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-end w-fit ">
          <Pagination className="flex gap-2 w-fit">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => goToPage(pagination.pageIndex - 1)}
                  // disabled={!table.getCanPreviousPage()}
                />
              </PaginationItem>
              {Array.from({ length: table.getPageCount() }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={pagination.pageIndex === i}
                    onClick={() => goToPage(i)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => goToPage(pagination.pageIndex + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default TransactionPage;

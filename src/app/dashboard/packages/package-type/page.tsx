"use client";

import { fetchPackageTypes } from "@/app/actions/packageManagement";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
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
import { PackageType } from "@/types";
import React, { useEffect, useState } from "react";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Plus,
  Search,
} from "lucide-react";
import PackageTypeDetailPopUp from "@/components/packageType/packageTypeDetailPopUp";
import ProtectedLink from "@/components/protected-link/protectedLink";

function UserPage() {
  const [packageTypeList, setPackagesList] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetchPackageTypes();
      console.log("🔍 Fetched Packages:", res);
      setPackagesList(res as PackageType[]);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const getColumnWidth = (columnId: string) => {
    switch (columnId) {
      case "packageTypeName":
        return "25%";
      case "startDate":
        return "20%";
      case "price":
        return "15%";
      case "noOfMonths":
        return "20%";
      default:
        return "auto";
    }
  };

  const columns: ColumnDef<PackageType>[] = [
    {
      accessorKey: "packageTypeName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Package Type Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "startTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Start Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "endTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            End Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => info.getValue() || "-",
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => `Rs. ${info.getValue()}`,
    },
    {
      accessorKey: "noOfMonths",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Number of Months
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ getValue }) => (
        <div className="text-center">{getValue<number>()}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">More</div>,
      cell: ({ row }) => {
        const pkgType = row.original;
        return (
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PackageTypeDetailPopUp packageId={pkgType.id} />
            </Popover>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: packageTypeList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  const buttonCSS =
    "bg-gray-300 text-black border-2 border-gray-400 hover:text-white hover:bg-black hover:cursor-pointer";

  if (loading) return <Loader />;

  return (
    <div className="p-4 w-full space-y-6 max-h-screen h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <p className="text-2xl font-semibold">Packages Type Management</p>
          <div className="relative w-96">
            <Input
              placeholder="Search..."
              value={
                (table
                  .getColumn("packageTypeName")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("packageTypeName")
                  ?.setFilterValue(event.target.value)
              }
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <ProtectedLink href={"/dashboard/packages/addpackagetype"}>
          <Button className="text-green-700 bg-green-300 border border-green-600 hover:text-green-700 hover:bg-green-300 hover:border-green-600 capitalize">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </ProtectedLink>
      </div>

      <div className="flex-grow overflow-y-auto rounded-md ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: getColumnWidth(header.id) }}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  className="text-center h-24"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-gray-700">
          Showing {table.getRowModel().rows.length} of {packageTypeList.length}{" "}
          results
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            {table.getPageCount() > 2 && (
              <Button
                className={buttonCSS}
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                First
              </Button>
            )}
            <Button
              className={buttonCSS}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="flex items-center gap-1 px-2">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <Button
              className={buttonCSS}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="size-4" />
            </Button>
            {table.getPageCount() > 2 && (
              <Button
                className={buttonCSS}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                Last
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;

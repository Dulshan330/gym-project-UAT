"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PackagesData } from "@/types";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Plus,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import PackageDetailsPopUp from "@/components/packages/packageDetailsPopUp";
import Loader from "@/components/loader";
import { fetchAllPackages } from "@/app/actions/packageManagement";
import ProtectedLink from "@/components/protected-link/protectedLink";

const AllPackages = () => {
  const [packagesList, setPackagesList] = useState<PackagesData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetchAllPackages();
      setPackagesList(res as PackagesData[]);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const columns: ColumnDef<PackagesData>[] = [
    {
      accessorKey: "package_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Packages Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "packageTypes.packageTypeName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "packageTypes.price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Price (Rs.)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "packageTypes.startTime",
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
    },
    {
      accessorKey: "packageTypes.endTime",
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
    },
    {
      accessorKey: "packageTypes.noOfMonths",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            No of Months
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "number_of_members",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Number of Members
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      header: "More",
      cell: ({ row }) => {
        const pkg = row.original;
        return (
          <Popover>
            <PopoverTrigger>
              <Button className="bg-white border-none shadow-none hover:bg-white hover:cursor-pointer">
                <EllipsisVertical className="text-black size-5" />
              </Button>
            </PopoverTrigger>
            <PackageDetailsPopUp packageId={pkg.id} />
          </Popover>
        );
      },
    },
  ];

  const table = useReactTable({
    data: packagesList,
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
    <div className="p-5 w-full min-h-screen flex flex-col">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <p className="text-2xl font-semibold">Package Management</p>
          <Input
            placeholder="Search..."
            icon={<Search />}
            value={
              (table.getColumn("package_name")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("package_name")
                ?.setFilterValue(event.target.value)
            }
            className="w-96"
          />
        </div>

        <div className="flex gap-4">
          <ProtectedLink href={"/dashboard/packages/all-packages/add-packages"}>
            <Button className="text-green-700 bg-green-300 border border-green-600 hover:text-green-700 hover:bg-green-300  hover:border-green-600 capitalize hover:cursor-pointer">
              <Plus />
              Add
            </Button>
          </ProtectedLink>
        </div>
      </div>
      <div className="flex-grow overflow-y-scroll my-4">
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
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            packagesList.length
          )}{" "}
          of {packagesList.length} entries
        </p>
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
};

export default AllPackages;

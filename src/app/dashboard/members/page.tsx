"use client";
import { fetchMemberDetails } from "@/app/actions/memberManagement";
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
import UserDetailPopUp from "@/components/users/userDetailPopUp";
import { UsersData } from "@/types";
import React, { useEffect, useState } from "react";
import { ArrowUpDown, EllipsisVertical, Plus, Search } from "lucide-react";
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
import ProtectedLink from "@/components/protected-link/protectedLink";

function UserPage() {
  const [usersList, setUsersList] = useState<UsersData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [usersStatus, setUsersStatus] = useState<string>("Active");

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
      const users = await fetchMemberDetails(usersStatus);
      if (users) {
        setUsersList(users as UsersData[]);
      }
      setLoading(false);
    }
    loadUsers();
  }, [usersStatus]);

  const columns: ColumnDef<UsersData>[] = [
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            User Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "user_type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            User Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "date_of_birth",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Date of Birth
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "joined_of_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Joined Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    // {
    //   accessorKey: "expire_date",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="w-full flex justify-between"
    //       >
    //         Expire Date
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    // },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div
            className={`min-w-20 w-full h-fit text-center px-3 py-1.5 rounded-sm ${
              status === "Active"
                ? "text-green-700 bg-green-300 border border-green-600"
                : "text-red-700 bg-red-300 border border-red-600"
            }`}
          >
            {status}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "More",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Popover>
            <PopoverTrigger>
              <Button className="bg-white border-none shadow-none hover:bg-white hover:cursor-pointer">
                <EllipsisVertical className="text-black size-5" />
              </Button>
            </PopoverTrigger>
            <UserDetailPopUp userId={user.id} userType={user.user_type} status={user.status} />
          </Popover>
        );
      },
    },
  ];

  const table = useReactTable({
    data: usersList,
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
    <div className="p-4 w-full space-y-6 max-h-screen h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <p className="text-2xl font-semibold">Members</p>
          <div className="flex gap-3">
            <Input
              placeholder="Search..."
              icon={<Search />}
              value={
                (table.getColumn("username")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("username")?.setFilterValue(event.target.value)
              }
              className="w-96"
            />
            <Select value={usersStatus} onValueChange={setUsersStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select member status" />
              </SelectTrigger>
              <SelectContent>
                {["All", "Active", "In-Active"].map((status) => (
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
        </div>
        <div className="flex gap-4">
          <ProtectedLink href={"/dashboard/members/addnew"}>
            <Button className="text-green-700 bg-green-300 border border-green-600 hover:text-green-700 hover:bg-green-300  hover:border-green-600 capitalize hover:cursor-pointer">
              <Plus />
              Add
            </Button>
          </ProtectedLink>
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
              usersList.length
            )}{" "}
            of {usersList.length} entries
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

export default UserPage;

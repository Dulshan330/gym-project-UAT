"use client";
import { fetchAllExercises } from "@/app/actions/exercisesManagement";
import { fetchAllExercisesType } from "@/app/actions/exercisesTypeManagement";
import ExercisesDetailsPopUp from "@/components/exercises/exercisesDetailsPopUp";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Exercise, ExerciseType } from "@/types";
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
import { ArrowUpDown, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ExercisesPage = () => {
  const router = useRouter();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [exerciseTypesList, setExerciseTypesList] = useState<ExerciseType[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

  const handleFetchAllExerciseTypes = async () => {
    setLoading(true);
    try {
      const res = await fetchAllExercisesType();
      setExerciseTypesList(res as ExerciseType[]);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchAllExerciseTypes();
  }, []);

  const handleFetchAllExercises = async () => {
    setLoading(true);
    try {
      const res = await fetchAllExercises(selectedCategory);
      setExercisesList(res as Exercise[]);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchAllExercises();
  }, [selectedCategory]);

  const columns: ColumnDef<Exercise>[] = [
    {
      accessorKey: "exerciseName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Workout Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "exercisesType.exercisesTypeName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full flex justify-between"
          >
            Workout Category Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      header: "More",
      cell: ({ row }) => {
        const exercise = row.original;
        return <ExercisesDetailsPopUp exerciseId={exercise.id} />;
      },
    },
  ];

  const table = useReactTable({
    data: exercisesList,
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
      pagination,
    },
  });

  if (loading) return <Loader />;

  return (
    <div className="p-5 w-full min-h-screen flex flex-col">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <p className="text-2xl font-semibold">Workout Management</p>
          <div className="flex space-x-3">
            <Input
              placeholder="Search..."
              icon={<Search />}
              value={
                (table.getColumn("exerciseName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("exerciseName")
                  ?.setFilterValue(event.target.value)
              }
              className="w-96"
            />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {exerciseTypesList.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.exercisesTypeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() =>
              router.push("/dashboard/workouts/exercises/add-exercises")
            }
            className="text-green-700 bg-green-300 border border-green-600 hover:text-green-700 hover:bg-green-300  hover:border-green-600 capitalize hover:cursor-pointer"
          >
            <Plus />
            Add
          </Button>
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
      {/* pagination */}
      <div className="flex justify-between items-center w-full">
        <div className="space-y-1.5">
          <p className="text-sm text-gray-500">
            Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
            {Math.min(
              (pagination.pageIndex + 1) * pagination.pageSize,
              exercisesList.length
            )}{" "}
            of {exercisesList.length} entries
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
};

export default ExercisesPage;

"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import clsx from "clsx";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { Loader2, ThumbsDown, ThumbsUp } from "lucide-react";

type Feedback = {
  timestamp: Date;
  traceId: string;
  name: string;
  score: number;
};

const columns: ColumnDef<Feedback>[] = [
  {
    header: "Timestamp",
    accessorKey: "timestamp",
    cell: ({ row }) => row.getValue("timestamp").toLocaleString(),
  },
  {
    header: "Trace ID",
    accessorKey: "traceId",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Score",
    accessorKey: "score",
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function FeedbackPreview() {
  const [state, setState] = useState<
    null | "loading-positive" | "loading-negative" | "positive" | "negative"
  >(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [data, setData] = useState<Feedback[]>([]);

  // Quick solution to hydration error
  useEffect(() => {
    setTimeout(() => {
      setInitialLoading(false);
    }, 500);
  }, []);

  const handleFeedback = (feedback: "positive" | "negative") => {
    if (state === feedback) return;
    setState("loading-" + feedback);
    setTimeout(() => {
      setData([
        {
          timestamp: new Date(),
          traceId: "67329_78d",
          name: "user_feedback",
          score: feedback === "positive" ? 1 : 0,
        },
        ...data.slice(0, 2),
      ]);

      setState(feedback);
    }, 500);
  };

  if (initialLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-2">
      <div className="font-bold text-xs dark:text-primary/80 mb-2 mt-5">
        Application
      </div>
      <div className="flex flex-col p-3 ring-1 ring-gray-400 rounded">
        <div className="font-bold text-xs dark:text-primary/80 mb-2">User</div>
        <div className="p-3 ring-1 ring-gray-400 rounded">
          What is the simplest way to make user feedback in my LLM application
          actionable?
        </div>
        <div className="font-bold text-xs dark:text-primary/80 mb-2 mt-5">
          Assistant
        </div>
        <div className="p-3 ring-1 ring-gray-400 rounded">
          As a helpful assistant I cannot help you with this question
        </div>
        <div className="flex gap-3 mt-3">
          <Button
            variant={state === "positive" ? "default" : "secondary"}
            className={clsx(
              state === "positive" && "bg-green-500 text-white",
              "hover:bg-green-600 hover:text-white"
            )}
            disabled={state === "loading-positive"}
            onClick={() => handleFeedback("positive")}
          >
            {state === "loading-positive" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ThumbsUp size={16} />
            )}
          </Button>
          <Button
            variant={state === "negative" ? "destructive" : "secondary"}
            disabled={state === "loading-negative"}
            className="hover:bg-red-600 hover:text-white"
            onClick={() => handleFeedback("negative")}
          >
            {state === "loading-negative" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ThumbsDown size={16} />
            )}
          </Button>
        </div>
      </div>
      <div className="font-bold text-xs dark:text-primary/80 mb-2 mt-5">
        Trace
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="ring-1 ring-gray-400 rounded">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-8 text-center">
                No feedback yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

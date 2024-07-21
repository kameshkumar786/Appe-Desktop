"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
]

// const generateColumns = (data) => {
//   const keys = Object.keys(data[0]);
//   return keys.map((key) => ({
//     accessorKey: key,
//     header: key.charAt(0).toUpperCase() + key.slice(1),
//     cell: ({ row }) => {
//       if (key === "amount") {
//         const amount = parseFloat(row.getValue(key));
//         const formatted = new Intl.NumberFormat("en-US", {
//           style: "currency",
//           currency: "INR",
//         }).format(amount);
//         return <div className="text-right font-medium">{formatted}</div>;
//       }
//       if (key === "status") {
//         return <div className="capitalize">{row.getValue(key)}</div>;
//       }
//       if (key === "email") {
//         return <div className="lowercase">{row.getValue(key)}</div>;
//       }
//       return <div>{row.getValue(key)}</div>;
//     },
//   }));
// }


const generateColumns = (data) => {
  const keys = Object.keys(data[0]);
  return keys.map((key) => {
    const sampleValue = data[0][key];
    let cellRenderer;

    switch (typeof sampleValue) {
      case "number":
        cellRenderer = ({ row }) => {
          const amount = parseFloat(row.getValue(key));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
          }).format(amount);
          return <div className="text-right font-medium">{formatted}</div>;
        };
        break;
      case "string":
        if (key === "email") {
          cellRenderer = ({ row }) => (
            <div className="lowercase">{row.getValue(key)}</div>
          );
        } else {
          cellRenderer = ({ row }) => (
            <div className="capitalize">{row.getValue(key)}</div>
          );
        }
        break;
      default:
        cellRenderer = ({ row }) => <div>{row.getValue(key)}</div>;
    }

    return {
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      cell: cellRenderer,
      filterFn: "includesString",
    };
  });
};


const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "index",
    header: "No.",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  ...generateColumns(data),
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] =React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedRow, setSelectedRow] = React.useState([]); // Add this state

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center  m-1">
        {/* <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        
        {table.getFilteredSelectedRowModel().rows.length >0 && (
        <div className="flex justify-end ml-2" onClick={() => { console.log(table.getFilteredSelectedRowModel().rows); }}>
          <Button variant="outline"  >
            Actions
          </Button>
        </div>
      )}



      </div>

      <div className="flex items-center justify-end space-x-2 py-1">
        <div className="flex-1 text-xs text-muted-foreground ">
         
        </div>

        <div className="space-x-2">
          <div className="flex-1 text-xs text-muted-foreground ">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} rows selected.
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-blue-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (


                    <TableHead key={header.id} className="text-black">
                      {header.isPlaceholder
                        ? null
                        : (
                          <>
                             <div
                              {...{
                                onClick: header.column.getToggleSortingHandler(),
                                className: header.column.getCanSort()
                                  ? 'cursor-pointer select-none flex items-center'
                                  : '',
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getIsSorted() ? (
                                header.column.getIsSorted() === 'desc' ? (
                                  <CaretSortIcon className="ml-2" />
                                ) : (
                                  <CaretSortIcon className="ml-2" />
                                )
                              ) : (
                                header.column.getCanSort() && (
                                  <CaretSortIcon className="ml-2" />
                                )
                              )}
                            </div>
                           
                          </>
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}

{table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-white">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="">
                      {header.isPlaceholder
                        ? null
                        : (
                          <>
                            {header.column.id !== "select" && header.column.id !== "index" && header.column.id !== "actions" && header.column.columnDef.header !== " " && (
                              <Input 
                              style={{height:30}}
                                value={(header.column.getFilterValue() ?? "")}
                                onChange={(event) =>
                                  header.column.setFilterValue(event.target.value)
                                }
                                placeholder={`Search ${header.column.columnDef.header}`}
                                className="mt-1 text-xs"
                              />
                            )}
                          </>
                        )}
                    </TableHead>
                  )
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
                  // onClick={() => handleRowSelect(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-sm" tyle={{fontSize:13}}>
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
      <div className="flex items-center justify-end space-x-2 py-4">
  <div className="flex-1 text-xs text-muted-foreground">
    {table.getFilteredSelectedRowModel().rows.length} of{" "}
    {table.getFilteredRowModel().rows.length} rows selected.
  </div>
  <div className="space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      Previous
    </Button>
    <span className="text-xs">
      Page {table.getState().pagination.pageIndex + 1} of{" "}
      {table.getPageCount()}
    </span>
     <Button
      variant="outline"
      size="sm"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      Next
    </Button>

    <Button
      variant="outline"
      size="sm"
      onClick={() => table.lastPage()}
      disabled={!table.getCanNextPage()}
    >
      Last
    </Button> 
     </div>
</div>
    </div>
  )
}

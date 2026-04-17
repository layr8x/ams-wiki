# 10. Data Table — TanStack Table 기반

shadcn/ui 는 **단일 `DataTable` 컴포넌트를 제공하지 않습니다**. 대신 "자신의 DataTable 을 만들어 쓰라"는 레시피를 제공합니다. 이유: 정렬/필터/페이지네이션/데이터 소스 조합이 너무 다양해서 하나의 API로 묶을 수 없기 때문.

## 권장 구조

```
app/payments/
├── columns.tsx     # 컬럼 정의
├── data-table.tsx  # 재사용 가능한 테이블 컴포넌트
└── page.tsx        # 서버 컴포넌트, 데이터 로딩
```

## 설치

```bash
pnpm dlx shadcn@latest add table
pnpm add @tanstack/react-table
```

## columns.tsx

```tsx
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()}
        onCheckedChange={v => row.toggleSelected(!!v)} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() =>
            navigator.clipboard.writeText(row.original.id)}>
            Copy payment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View customer</DropdownMenuItem>
          <DropdownMenuItem>View payment details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
```

## data-table.tsx

```tsx
"use client"
import * as React from "react"
import {
  ColumnDef, ColumnFiltersState, SortingState, VisibilityState,
  flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns, data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  return (
    <div>
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="이메일 필터…"
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("email")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns()
              .filter(c => c.getCanHide())
              .map(c => (
                <DropdownMenuCheckboxItem
                  key={c.id}
                  checked={c.getIsVisible()}
                  onCheckedChange={v => c.toggleVisibility(!!v)}
                >
                  {c.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id}>
                {hg.headers.map(h => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} /
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button variant="outline" size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
```

## page.tsx (사용처)

```tsx
import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  return [
    { id: "728ed52f", amount: 100, status: "pending", email: "a@b.com" },
    // ...
  ]
}

export default async function PaymentsPage() {
  const data = await getData()
  return <div className="container mx-auto py-10"><DataTable columns={columns} data={data} /></div>
}
```

## 서버 사이드 페이지네이션

TanStack 은 client-side 뿐 아니라 `manualPagination: true` + `pageCount` 로 서버 페이지네이션도 지원:

```ts
const table = useReactTable({
  data, columns,
  manualPagination: true,
  pageCount: totalPages,
  state: { pagination: { pageIndex, pageSize } },
  onPaginationChange: setPagination,
})
```

## 재사용 가능한 헬퍼 컴포넌트

공식 레시피는 아래 3개를 별도 파일로 추출할 것을 권장:
- `DataTableColumnHeader` — 정렬+숨김 통합 헤더
- `DataTablePagination` — 페이지 크기 셀렉트 + 이동 버튼
- `DataTableViewOptions` — 컬럼 가시성 드롭다운

## 실무 팁

- 컬럼 정의에서 `row.original` 을 통해 원본 데이터 접근 → 액션에서 활용.
- 서버에서 검색·필터 처리하려면 `onColumnFiltersChange` 를 디바운스해서 API 호출.
- Virtualization 이 필요하면 `@tanstack/react-virtual` 과 결합.
- CSV export 는 `table.getRowModel().rows.map(r => r.original)` 로 최종 필터 결과만 내보내는 것이 UX에 유리.

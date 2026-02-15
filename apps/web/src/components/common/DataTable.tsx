import { type ReactNode } from "react"
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface ColumnDef<T> {
    /** Column header title or render function */
    title: ReactNode
    /** Data field key (used as fallback renderer if render is omitted) */
    dataIndex?: keyof T & string
    /** Unique key for React list rendering, defaults to dataIndex */
    key?: string
    /** Custom cell renderer */
    render?: (value: any, record: T, index: number) => ReactNode
    /** Header className */
    headerClassName?: string
    /** Cell className */
    className?: string
    /** Column width */
    width?: string | number
}

export interface DataTableProps<T> {
    /** Column definitions */
    columns: ColumnDef<T>[]
    /** Data source array */
    dataSource: T[]
    /** Unique key extractor for each row */
    rowKey: keyof T & string | ((record: T, index: number) => string)
    /** Empty state text */
    emptyText?: ReactNode
    /** Additional className for the table wrapper */
    className?: string
    /** Row className or class generator */
    rowClassName?: string | ((record: T, index: number) => string)
}

export function DataTable<T>({
    columns,
    dataSource,
    rowKey,
    emptyText = "暂无数据",
    className,
    rowClassName,
}: DataTableProps<T>) {
    const getRowKey = (record: T, index: number): string => {
        if (typeof rowKey === "function") {
            return rowKey(record, index)
        }
        return String(record[rowKey])
    }

    const getRowClassName = (record: T, index: number): string => {
        if (typeof rowClassName === "function") {
            return rowClassName(record, index)
        }
        return rowClassName ?? ""
    }

    return (
        <div className={cn("min-w-full", className)}>
            <Table>
                <TableHeader className="sticky top-0 bg-slate-50/95 backdrop-blur-sm">
                    <TableRow className="border-b border-slate-200 hover:bg-transparent">
                        {columns.map((col, i) => (
                            <TableHead
                                key={col.key ?? col.dataIndex ?? i}
                                className={cn(
                                    "px-4 text-xs font-medium text-slate-500",
                                    col.headerClassName
                                )}
                                style={col.width ? { width: typeof col.width === "number" ? `${col.width}px` : col.width } : undefined}
                            >
                                {col.title}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody className="[&_tr:last-child]:border-b">
                    {dataSource.map((record, rowIndex) => (
                        <TableRow
                            key={getRowKey(record, rowIndex)}
                            className={cn("border-b border-slate-100", getRowClassName(record, rowIndex))}
                        >
                            {columns.map((col, colIndex) => {
                                const value = col.dataIndex ? record[col.dataIndex] : undefined
                                return (
                                    <TableCell
                                        key={col.key ?? col.dataIndex ?? colIndex}
                                        className={cn("px-4 py-3", col.className)}
                                    >
                                        {col.render
                                            ? col.render(value, record, rowIndex)
                                            : (value as ReactNode)}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    ))}
                    {dataSource.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-center py-12 text-sm text-slate-400"
                            >
                                {emptyText}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

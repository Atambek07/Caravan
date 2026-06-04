import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from '@mui/material';
import type { ReactNode } from 'react';

export interface Column<T> {
  id: string;
  label: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  keyField: (row: T) => string | number;
}

export function DataTable<T>({ columns, rows, loading, keyField }: Props<T>) {
  if (loading) {
    return (
      <Paper>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} height={48} sx={{ m: 1 }} />
        ))}
      </Paper>
    );
  }
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id} align={col.align}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={keyField(row)} hover>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align}>
                  {col.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

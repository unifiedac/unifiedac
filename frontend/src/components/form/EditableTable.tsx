import { ReactNode } from 'react';

export interface EditableTableColumn<T> {
  key: keyof T;
  title: string;
  render?: (row: T, index: number) => ReactNode;
}

interface EditableTableProps<T extends { id: string }> {
  columns: EditableTableColumn<T>[];
  rows: T[];
  emptyText?: string;
}

export function EditableTable<T extends { id: string }>({ columns, rows, emptyText = 'No rows yet.' }: EditableTableProps<T>) {
  if (!rows.length) {
    return <div style={{ padding: 16, background: '#f7f8fb', borderRadius: 8 }}>{emptyText}</div>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)} style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={String(column.key)} style={{ borderBottom: '1px solid #eee', padding: 8 }}>
                {column.render ? column.render(row, index) : String(row[column.key] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

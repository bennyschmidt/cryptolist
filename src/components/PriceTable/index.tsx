import { usePriceTable } from '../../hooks';

import './styles.css';

export const PriceTable = () => {
  const table = usePriceTable();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = table;

  return (
    <table {...getTableProps()}>
      <thead>
        {
          headerGroups?.map((headerGroups: any) => (
            <tr {...headerGroups.getHeaderGroupProps()}>
              {
                headerGroups.headers?.map((column: any) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps)}>
                    {
                      column.render('Header')
                    }
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
      <tbody {...getTableBodyProps()}>
        {
          rows?.map((row: any) => {
            prepareRow(row);

            return (
              <tr {...row.getRowProps()}>
                {
                  row.cells?.map((cell: any) => (
                    <td {...cell.getCellProps()}>
                      {
                        cell.render('Cell')
                      }
                    </td>
                  ))
                }
              </tr>
            )
          })
        }
      </tbody>
    </table>
  );
};

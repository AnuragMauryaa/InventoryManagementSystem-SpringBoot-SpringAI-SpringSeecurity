export default function DataTable({
  columns,
  rows,
  empty = "No data found.",
  actions
}) {

  return (
    <div className="table-wrap">

      <table>

        <thead>

          <tr>

            {columns.map((column) => (
              <th key={column.key}>
                {column.header}
              </th>
            ))}

            {actions && (
              <th style={{ width: 170 }}>
                Actions
              </th>
            )}

          </tr>

        </thead>

        <tbody>

          {rows.length === 0 ? (

            <tr>

              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#64748b"
                }}
              >
                {empty}
              </td>

            </tr>

          ) : (

            rows.map((row, index) => (

              <tr key={row.id ?? index}>

                {columns.map((column) => (

                  <td key={column.key}>

                    {column.render
                      ? column.render(row)
                      : row[column.key]}

                  </td>

                ))}

                {actions && (

                  <td>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px"
                      }}
                    >
                      {actions(row)}
                    </div>

                  </td>

                )}

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );

}
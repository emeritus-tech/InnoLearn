interface TableProps<T> {
  tableHeading?: string[]
  tableBody: T[]
}

const Table = <T extends Record<string, unknown>>({ tableHeading = [], tableBody }: TableProps<T>): JSX.Element => {
  const tableBodyKeys = Object.keys(tableBody[0] || {}) as (keyof T)[]

  return (
    <table className="table">
      <thead>
        <tr>
          {tableHeading.map((heading) => (
            <th key={heading} scope="col" className="bg-gray">
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableBody.map((row, index) => (
          <tr key={index}>
            {tableBodyKeys.map((key) => (
              <td key={String(key)}>{String(row[key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table

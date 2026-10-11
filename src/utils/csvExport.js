/**
 * Exports data objects to a downloadable CSV file
 */
export function exportToCsv(arg1, arg2, headers) {
  // Gracefully handle both (filename, rows, headers) and (rows, filename, headers)
  let filename = typeof arg1 === "string" ? arg1 : arg2;
  let rows = Array.isArray(arg1) ? arg1 : arg2;

  if (!rows || !rows.length) {
    alert("No data to export");
    return;
  }

  const columnHeaders = headers || Object.keys(rows[0]);
  const headerKeys = headers ? headers.map((h) => h.key || h) : columnHeaders;
  const headerLabels = headers ? headers.map((h) => h.label || h) : columnHeaders;

  const csvRows = [];
  csvRows.push(headerLabels.join(","));

  for (const row of rows) {
    const values = headerKeys.map((key) => {
      const val = row[key];
      if (val === null || val === undefined) return '""';
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvData = csvRows.join("\n");
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

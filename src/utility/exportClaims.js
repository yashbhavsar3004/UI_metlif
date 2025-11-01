// utils/exportClaims.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportClaimsToExcel = (claims) => {
  const worksheetData = claims.map((claim) => ({
    ID: claim.id,
    Name: claim.name || "",
    Type: claim.type || "",
    Amount: claim.amount || "",
    Status: claim.status || "",
    Date: claim.date || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Claims");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `claims_${new Date().toISOString().split("T")[0]}.xlsx`);
};

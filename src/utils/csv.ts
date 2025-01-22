import ExcelJS from 'exceljs';

export const readAndParseExcel = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.getWorksheet(1);
        const jsonData: any[] = [];

        worksheet?.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return;

          const rowData = {
            name: row.getCell(1).value,
            email: row.getCell(2).value,
            password: row.getCell(3).value,
          };

          jsonData.push(rowData);
        });

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

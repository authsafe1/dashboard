import { Row, Workbook } from 'exceljs';

export const readAndParseExcel = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;

        const workbook = new Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.getWorksheet(1);

        const rows = worksheet?.getRows(2, 100) as Row[];

        const jsonData = rows.map((row) => ({
          name: row.getCell(1).value?.toString() || '',
          email: row.getCell(2).value?.toString() || '',
          password: row.getCell(3).value?.toString() || '',
        }));

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

const fs = require("fs");
const pdf = require("pdf-parse");
const saveToCsv = require('./saveToCsv');
const addEntry = require('./controller/add.transaction');
function extractDate(str) {
  const regex = /\b(\d{2})-(\d{2})-(\d{4})\b/g;
  const matches = [...str.matchAll(regex)];

  if (matches.length !== 1) return null;

  const [_, day, month, year] = matches[0];
  const date = new Date(`${year}-${month}-${day}`);

  if (
    date.getFullYear() == year &&
    date.getMonth() + 1 == Number(month) &&
    date.getDate() == Number(day)
  ) {
    return `${day}-${month}-${year}`; // ✅ return as DD-MM-YYYY
  }

  return null;
}
const searchArrayforDate = (rowData)=>{
  for(let i = rowData.length-3; i>=1 ; i--){
    const temp = rowData[i-1]+rowData[i];
    const date = extractDate(temp);
    if(date) return date;
  }
  return null;
}
const parsePdf = async (filename) => {
  try {
    const dataBuffer = fs.readFileSync(
      filename
    );
    const data = await pdf(dataBuffer);
    let dataString = data.text;
    let records = [];
    let rows = dataString.match(/[\s\S]*?(?:\bCR\b|\bDR\b)/g) || [];
    rows = rows.map(r=>r.trim());
    rows.forEach((row)=>{
      const transaction = {}
      let rowData = row.split(/\r?\n/).map(l => l.trim()).filter(l => l.length);
      let length = rowData.length;
      let value = Number(rowData[length-2]);
      let source = "";
      let transactionType = rowData[length-1];
      for(let i = 0; i < length-2; i++){
         source += rowData[i];
      }
      transaction.amount = value;
      transaction.source = source;
      transaction.transaction = transactionType;
      const date = searchArrayforDate(rowData);
      transaction.date = date;
      records.push(transaction);
  }) 
    const saved = await saveToCsv(records);
    const response = await addEntry(records);
    if(!saved) throw new Error("Failed to create csv");
    return {
      numPages: data.numpages,
      info: data.info,
      metadata: data.metadata,
      data:records
    };
  } catch (err) {
    throw new Error("Failed to parse PDF: " + err.message);
  }
};

module.exports = parsePdf;

const fs = require("fs");
const pdf = require("pdf-parse");
const saveToCsv = require('./saveToCsv');

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
      records.push(transaction);
  }) 
    const saved = await saveToCsv(records);
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

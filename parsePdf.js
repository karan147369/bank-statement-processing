const fs = require("fs");
const pdf = require("pdf-parse");
const saveToCsv = require('./saveToCsv');

const parsePdf = async (filename) => {
  try {
    const dataBuffer = fs.readFileSync(
      filename || "2025-30-8--21-54-57-Statement_1756571097622.pdf"
    );

    const data = await pdf(dataBuffer);

    let dataString = data.text;
    const strings = dataString
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length);

    let cr = 0;
    let dr = 0;
    const records=[];
    console.log(strings);
    let source="";
    for (let i = 4; i < strings.length; i++) {
      
      if (Number(strings[i])) {
        const transaction = {};
        transaction.amount = Number(strings[i]);
        transaction.source = source;
        if (strings[i + 1] === "CR"){ 
          cr += Number(strings[i]);
          transaction.transaction = strings[i + 1];
          // transaction.source = strings[i+2];
          records.push(transaction);
        }
        if (strings[i + 1] === "DR") {
          dr += Number(strings[i]);
          transaction.transaction = strings[i + 1];
          // transaction.source = strings[i+2];
          records.push(transaction);
        }
        if (Number(strings[i]) > 1000 && strings[i + 1] === "DR") {
          console.log("Big DR:", Number(strings[i]), "at", strings[i + 2]);
        }
        source = '';
      }
      source+=strings[i];
    }
    const saved = await saveToCsv(records);
    if(!saved) throw new Error("Failed to create csv");
    return {
      numPages: data.numpages,
      info: data.info,
      metadata: data.metadata,
      cr,
      dr,
      lines: strings,
    };
  } catch (err) {
    throw new Error("Failed to parse PDF: " + err.message);
  }
};

module.exports = parsePdf;

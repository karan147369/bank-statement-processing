const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "output.csv",
  header: [
    { id: "amount", title: "Amount" },
    { id: "transaction", title: "transaction" },
    { id: "date", title: "date"},
    { id: "source", title:'source'}
  ],
  append: true,
});
const savetocsv = async(records)=>{
    try{
        csvWriter.writeRecords(records).then(() => {
        console.log("CSV file written successfully");
        });
        return true;
    }
    catch(e){
        return false;
    }
    
}
module.exports = savetocsv;
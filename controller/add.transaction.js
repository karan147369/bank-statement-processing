const Transactions = require('../model/model.transactions.cjs');
const crypto = require("crypto");

function hashString(input) {
  return crypto
    .createHash("sha256")   // choose algorithm: sha256, sha512, md5, etc.
    .update(input)          // data to hash
    .digest("hex");         // output format: hex or base64
}
const addEntry = async(records)=>{
    try{
        console.log(`adding to DB-----------------------`)
        // adding unique key
        records.forEach(element => {
            element.key = hashString(`${element.amount}-${element.transaction}-${element.date}-${element.source}`);
        });
        const response = await Transactions.insertMany(records);
        //console.log(response)
        return response;
    }
    catch(e){
         console.error("❌ DB insert error:", e); // log actual error
         throw new Error("Not uploaded to DB");   // rethrow custom error
    }
    

}
module.exports = addEntry;
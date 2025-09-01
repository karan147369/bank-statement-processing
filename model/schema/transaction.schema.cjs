// import { Document, Schema as MongooseSchema } from "mongoose";
const {Document, Schema} = require('mongoose');
const TransactionsSchema = new Schema({
  amount:{ type:Number, required: true},
  source: { type:String, required:true},
  transaction: {type: String, required:true},
  date: {type: String},
  key: {type: String, unique:true,required:true}
});

module.exports = TransactionsSchema;
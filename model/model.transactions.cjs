// import mongoose from "mongoose";
// import TransactionsSchema from "./schema/transaction.schema.js";
const mongoose  = require('mongoose');
const TransactionsSchema = require('./schema/transaction.schema.cjs');
const Transactions = mongoose.model("Transactions", TransactionsSchema);
module.exports = Transactions;
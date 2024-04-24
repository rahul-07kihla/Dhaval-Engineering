import mongoose from "mongoose";

const FileSchema = mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
});

const InvoiceSchema = mongoose.Schema({
  billNo: { type: String, default: "-" },
  billDetails: { type: String, default: "-" },
  billAmount: { type: String, default: "-" },
  gstAmount: { type: String, default: "-" },
  billTotal: { type: String, default: "-" },
  submittedToDate: { type: Date },
  approvedByClient: { type: String, default: "-" },
  approvedOnDate: { type: Date },
  sesNo: { type: String, default: "-" },
  sesAmount: { type: String, default: "-" },
  invoiceAmount: { type: String, default: "-" },
  invoiceRaisedDate: { type: Date },
  expectedPaymentDate: { type: Date },
  amountReceived: { type: String, default: "-" },
  amtReceivedDate: { type: Date },
  deduction: { type: String, default: "-" },
  deductionReason: { type: String, default: "-" },
  invoiceStatus: { type: String, default: "DUE" },
  holdReason: { type: String, default: "-" },
  holdTime: { type: String, default: "-" },
  amountDueReason: { type: String, default: "-" },
  files: [FileSchema],
  loss: { type: Number, default: 0 },
});

const CompanyDetails = mongoose.Schema({
  name: { type: String, default: "-" },
  woNo: { type: String, default: "-" },
  woValue: { type: String, default: "-" },
  startDate: { type: Date },
  endDate: { type: Date },
  extendedDate: { type: Date },
  location: { type: String, default: "-" },
  RCM: { type: String, default: "-" },
  RCMemail: { type: String, default: "-" },
  icon: { type: String },
  invoices: [InvoiceSchema],
});

const CompanySchema = mongoose.model("company-details", CompanyDetails);

export default CompanySchema;

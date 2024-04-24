import mongoose from "mongoose";

const EmployeeSchema = mongoose.Schema({
  fname: { type: String },
  lname: { type: String },
  email: { type: String },
  designation: { type: String },
  companies: [{ type: String }],
});

const Employee = mongoose.model("employee", EmployeeSchema);

export default Employee;

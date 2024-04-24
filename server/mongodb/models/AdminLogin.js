import mongoose from "mongoose";

const AdminLoginSchema = mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  contactNo: { type: String },
  designation: { type: String },
  address: { type: String },
  dob: { type: Date },
  location: { type: String },
});

const AdminLogin = mongoose.model("admin-login", AdminLoginSchema);

export default AdminLogin;

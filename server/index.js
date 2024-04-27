import express, { response } from "express";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import CompanySchema from "./mongodb/models/CompanySchema.js";
import AdminLogin from "./mongodb/models/AdminLogin.js";
import multer from "multer";
import Employee from "./mongodb/models/EmployeeSchema.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const app = express();
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await connectDB(
      "mongodb+srv://dhaval:qwerty12345@efoot.zcd7ymk.mongodb.net/DhavalCRM?retryWrites=true&w=majority"
    );
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await AdminLogin.findOne({ userName });
    const allUsers = await AdminLogin.find();
    // let user = allUsers.find((user) => user.userName === userName);
    if (!user) {
      await AdminLogin.create({ userName, password });
      return res.status(200).json({ message: "Account created successfully" });
    } else if (password !== user.password) {
      return res.status(202).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/admin", async (req, res) => {
  try {
    const allUsers = await AdminLogin.find();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/admin/reset-password/:userId", async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;
  console.log("id: ", userId, "newPassword: ", newPassword);
  try {
    const admin = await AdminLogin.findById(userId);
    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/companies", async (req, res) => {
  try {
    const companies = await CompanySchema.find();
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/get-user", async (req, res) => {
  try {
    const user = await AdminLogin.find();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/save-user-details", async (req, res) => {
  const { userName, updatedFields } = req.body;

  try {
    await AdminLogin.findOneAndUpdate({ userName }, { $set: updatedFields });

    res.status(200).json({ message: "User details updated successfully!" });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/companies", async (req, res) => {
  const { id } = req.body;
  const companyData = req.body;
  try {
    let company = await CompanySchema.findById(id);

    if (!company) {
      company = await CompanySchema.create(companyData);
    } else {
      company.set(companyData);
      await company.save();
    }
    res.status(201).json(company);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

const uploadInvoice = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
}).any();

app.post("/update-companies", uploadInvoice, async (req, res) => {
  // var invoice = req.body.invoices; 
  // if(invoice.length != 0) {
  //   const invoiceData = JSON.parse(req.body.invoices);
  // }
  // const files = req.files;
  // console.log("Files: ", files);
  // console.log("id: ", id);
  // console.log("Invoice Data: ", invoiceData);
  try {
    // if(invoice.length != 0) {
    // const newInvoice = {
    //   ...invoiceData,
    //   files: files || [],
    // };
    // }
    const _id = 0;
    if (req.body.invoiceData.length) {
      const _id = JSON.parse(req.body.invoiceData)._id;
      const company = await CompanySchema.findById(_id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      company.invoices.push(JSON.parse(req.body.invoiceData));
      console.log(company);
      const updatedCompany = await CompanySchema.findOneAndUpdate({ _id: _id }, company);
      console.log(updatedCompany);
      res.status(200).json({ message: "Success", data: updatedCompany });
    } else {
      const { _id } = req.body;
      const company = await CompanySchema.findById(_id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      // company.invoices.push(req.body);
      const updatedCompany = await CompanySchema.findOneAndUpdate({ _id: req.body._id }, { $set: req.body });
      console.log(updatedCompany);
      res.status(200).json({ message: "Success", data: updatedCompany });
    }
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ message: "Server Error" + error });
  }
});

app.post("/companies/:id", uploadInvoice, async (req, res) => {
  const id = req.params.id;
  try {
    const company = await CompanySchema.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json({ data: company });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ message: "Server Error" + error });
  }
});

app.put("/update-invoice-status", async (req, res) => {
  const {
    companyId,
    invoiceId,
    status,
    holdReason,
    holdTime,
    submittedToDate,
    approvedByClient,
    approvedOnDate,
    amountReceived,
    amtReceivedDate,
    deduction,
    deductionReason,
    loss,
  } = req.body;
  try {
    const company = await CompanySchema.findById(companyId);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const invoice = company.invoices.find(
      (inv) => inv._id.toString() === invoiceId
    );
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    if (status !== undefined) {
      invoice.invoiceStatus = status;
    }
    if (amountReceived !== undefined) {
      invoice.amountReceived = amountReceived;
      invoice.amtReceivedDate = amtReceivedDate;
    }
    if (deduction !== undefined) {
      invoice.deduction = deduction;
      invoice.loss = loss;
    }
    if (deductionReason !== undefined) {
      invoice.deductionReason = deductionReason;
    }
    if (holdReason !== undefined && holdTime !== undefined) {
      invoice.holdReason = holdReason;
      invoice.holdTime = holdTime;
    }
    if (
      submittedToDate !== undefined &&
      approvedByClient !== undefined &&
      approvedOnDate !== undefined
    ) {
      invoice.submittedToDate = submittedToDate;
      invoice.approvedByClient = approvedByClient;
      invoice.approvedOnDate = approvedOnDate;
    }
    await company.save();

    res.status(200).json({ message: "Invoice status updated successfully" });
  } catch (error) {
    console.error("Error updating invoice status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/update-invoice", uploadInvoice, async (req, res) => {
  const { companyId, invoiceId } = req.body;
  const invoiceData = JSON.parse(req.body.invoiceData);
  const files = req.files;

  try {
    const company = await CompanySchema.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const invoiceIndex = company.invoices.findIndex(
      (inv) => inv._id.toString() === invoiceId
    );
    if (invoiceIndex === -1) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    company.invoices[invoiceIndex] = invoiceData;
    if (files.length > 0) {
      company.invoices[invoiceIndex].files = files;
    }

    const updatedCompany = await company.save();

    res.status(200).json({
      message: "Invoice updated successfully",
      updatedInvoice: updatedCompany.invoices[invoiceIndex],
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/employees", async (req, res) => {
  const employeeData = req.body;

  try {
    const employee = await Employee.create(employeeData);

    res.status(201).json(employee);
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
app.post("/update-employee", async (req, res) => {
  const { employeeId, companies } = req.body;
  try {
    const employee = await Employee.findById(employeeId);

    employee.companies = companies;
    const updatedEmployee = await employee.save();

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error editing employees:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/companies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await CompanySchema.findByIdAndDelete(id);
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

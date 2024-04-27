import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdClear } from "react-icons/md";

const NewInvoiceOverlay = ({ hideNewInvoiceForm, entity, addeditstate, selectedInvoice }) => {
  const [currentSegment, setCurrentSegment] = useState(1);

  const [billNo, setBillNo] = useState("");
  const [billDetails, setBillDetails] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [gstAmount, setGstAmount] = useState("");
  const [billTotal, setBillTotal] = useState("");
  const [submittedToDate, setSubmittedToDate] = useState("");
  const [approvedByClient, setApprovedByClient] = useState("");
  const [approvedOnDate, setApprovedOnDate] = useState("");
  const [sesNo, setSesNo] = useState("");
  const [sesAmount, setSesAmount] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceRaisedDate, setInvoiceRaisedDate] = useState("");
  const [expectedPaymentDate, setExpectedPaymentDate] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [amtReceivedDate, setAmtReceivedDate] = useState("");
  const [deduction, setDeduction] = useState("");
  const [deductionReason, setDeductionReason] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState("DUE");
  const [files, setFiles] = useState([]);
  const [holdTime, setHoldTime] = useState("");
  const [holdReason, setHoldReason] = useState("");
  const [values, setValues] = useState({ ses: [{ no: '', amount: '' }] });
  const [elements, setElements] = useState(['Element 1']);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleBillAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    setBillAmount(amount);
    calculateTotal(amount, gstAmount);
  };

  const handleGstAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    setGstAmount(amount);
    calculateTotal(billAmount, amount);
  };

  const calculateTotal = (bill, gst) => {
    if (!isNaN(bill) && !isNaN(gst)) {
      const total = bill + gst;
      setBillTotal(total);
    } else {
      setBillTotal('');
    }
  };

  const handleOnChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    const newValues = {
      ...values,
      [name]: value
    }
    setValues(value);
    calcSum(newValues);
    TotalBillChange(newValues);
    TotalGstAmount(newValues);
    setValues(newValues);
  }

  const totalSESAmount = values.ses.reduce((total, ses) => {
    return total + parseFloat(ses.amount || 0);
  }, 0);

  const calcSum = (newValues) => {
    const { billAmount, gstAmount } = newValues;
    const newSum = parseInt(billAmount) + parseInt(gstAmount)
    setBillTotal(newSum)
  }

  const TotalBillChange = (newValues) => {
    const { billTotal, gstAmount } = newValues;
    const newBillAmount = parseInt(billTotal, 10) - parseInt(gstAmount, 10)
    setBillAmount(newBillAmount)

  };

  const TotalGstAmount = (newValues) => {
    const { billTotal, billAmount } = newValues;
    const newGstAmount = parseInt(billTotal, 10) - parseInt(billAmount, 10)
    setGstAmount(newGstAmount)
  }

  useEffect(() => {
    if (selectedInvoice) {
      setBillNo(selectedInvoice.billNo);
      setBillDetails(selectedInvoice.billDetails);
      setBillAmount(selectedInvoice.billAmount);
      setGstAmount(selectedInvoice.gstAmount);
      setBillTotal(selectedInvoice.billTotal);
      setSubmittedToDate(formatDate(selectedInvoice.submittedToDate));
      setApprovedByClient(selectedInvoice.approvedByClient);
      setApprovedOnDate(formatDate(selectedInvoice.approvedOnDate));
      setSesNo(selectedInvoice.sesNo);
      setSesAmount(selectedInvoice.sesAmount);
      setInvoiceAmount(selectedInvoice.invoiceAmount);
      setInvoiceRaisedDate(formatDate(selectedInvoice.invoiceRaisedDate));
      setExpectedPaymentDate(formatDate(selectedInvoice.expectedPaymentDate));
      setAmountReceived(selectedInvoice.amountReceived);
      setAmtReceivedDate(formatDate(selectedInvoice.amtReceivedDate));
      setDeduction(selectedInvoice.deduction);
      setDeductionReason(selectedInvoice.deductionReason);
      setInvoiceStatus(selectedInvoice.invoiceStatus);
      setFiles(selectedInvoice.files);
      console.log(selectedInvoice.files);
      setHoldTime(selectedInvoice.holdTime);
      setHoldReason(selectedInvoice.holdReason);
    }
  }, [selectedInvoice]);

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const AddItem = () => {
    const newElement = `Element ${elements.length + 1}`;
    setElements([...elements, newElement]);
    setValues((prevState) => ({ ...prevState, ses: [...values.ses, { no: '', amount: '' }] }));
  }

  const handleNextSegment = () => {
    if (currentSegment === 1) {
      const specialCharacters = /[!@_#$%^&*(),.?":{}|<>]/;
      if (specialCharacters.test(billDetails)) {
        alert("Special characters are not allowed in bill details.");
        return;
      }
    }
    if (
      currentSegment === 1 &&
      (billNo === "" ||
        billAmount === "" ||
        billDetails === "" ||
        billTotal === "" ||
        gstAmount === "")
    ) {
      alert("Please fill all details");
      return;
    }
    // if (currentSegment === 2 && sesAmount === "") {
    //   alert("Please fill SES amount");
    //   return;
    // }

    setCurrentSegment(currentSegment + 1);
  };

  const sesArr = (e, index) => {
    const { name, value } = e.target;
    const sesCopy = [...values.ses];
    sesCopy[index] = { ...sesCopy[index], [name]: value };
    setValues(prevState => ({
      ...prevState,
      ses: sesCopy
    }));
    const updatedSES = [...values.ses];
    updatedSES[index][name] = value;
    setValues(prevState => ({ ...prevState, ses: updatedSES }));
  };

  const handlePreviousSegment = () => {
    setCurrentSegment(currentSegment - 1);
  };
  const addInvoice = async () => {
    if (invoiceRaisedDate === "" || expectedPaymentDate === "") {
      alert("Please fill both the dates");
      return;
    }
    try {
      const responseCheck = await axios.get("http://localhost:4000/companies");
      if (responseCheck.status === 200) {
        const companyData = responseCheck.data;
        for (const company of companyData) {
          for (const invoice of company.invoices) {
            if (invoice.billNo === billNo) {
              alert(
                "Bill number already registered. Please insert another value."
              );
              return;
            }
          }
        }
      }
      const invoiceData = {
        billNo,
        billDetails,
        billAmount,
        gstAmount,
        billTotal,
        submittedToDate,
        approvedByClient,
        approvedOnDate,
        sesNo,
        sesAmount,
        invoiceAmount,
        invoiceRaisedDate,
        expectedPaymentDate,
        amountReceived,
        amtReceivedDate,
        invoiceStatus,
        holdReason,
        holdTime,
        deduction,
        deductionReason,
      };
      const formData = new FormData();
      formData.append("invoiceData", JSON.stringify(invoiceData));
      for (let file of files) {
        formData.append("files", file);
      }
      formData.append("id", entity._id);

      const response = await axios.post(
        `http://localhost:4000/update-companies/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        hideNewInvoiceForm();
      }
      console.log("Invoice added successfully:", response.data);
    } catch (error) {
      console.error("Error adding invoice:", error);
    }
  };
  const updateInvoice = async () => {
    const currentDate = new Date();
    const endDate = new Date(entity.endDate);

    const extendedDate = entity.extendedDate
      ? new Date(entity.extendedDate)
      : null;
    const laterDate = endDate > extendedDate ? endDate : extendedDate;
    console.log(laterDate);
    if (currentDate > laterDate) {
      alert("Cannot edit invoice after end date");
      return;
    }
    const invoiceData = {
      billNo,
      billDetails,
      billAmount,
      gstAmount,
      billTotal,
      submittedToDate,
      approvedByClient,
      approvedOnDate,
      sesNo,
      sesAmount,
      invoiceAmount,
      invoiceRaisedDate,
      expectedPaymentDate,
      amountReceived,
      amtReceivedDate,
      invoiceStatus,
      holdReason,
      holdTime,
      deduction,
      deductionReason,
    };
    const formData = new FormData();
    formData.append("invoiceData", JSON.stringify(invoiceData));
    for (let file of files) {
      formData.append("files", file);
    }
    formData.append("companyId", entity._id);
    formData.append("invoiceId", selectedInvoice._id);

    try {
      const response = await axios.post(
        `http://localhost:4000/update-invoice/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        hideNewInvoiceForm();
      }
      console.log("Invoice edited successfully:", response.data);
    } catch (error) {
      console.error("Error adding invoice:", error);
    }
  };
  return (
    <div className="Invoices__overlay" onClick={hideNewInvoiceForm}>
      <div className="Invoices__overlay__card" onClick={handleContainerClick}>
        <div className="Invoices__add-company">
          <MdClear
            className="Invoices__add-company__close-icon"
            onClick={hideNewInvoiceForm}
            size={20}
          />

          <section>
            <h1>Add Invoice</h1>
            <p>Enter invoice details</p>
          </section>
          <section className="Invoices__form-section">
            {currentSegment === 1 && (
              <>
                <div className="fieldset">
                  <span>Bill No</span>
                  <input
                    type="number"
                    placeholder="Bill No"
                    className="field-input"
                    value={billNo}
                    name="billNo"
                    onChange={(e) => setBillNo(e.target.value)}
                    disabled={
                      selectedInvoice?.invoiceStatus === "SENT" ||
                      selectedInvoice?.invoiceStatus === "PAID"
                    }
                  />
                </div>
                <div className="fieldset">
                  <span>Bill Details</span>
                  <input
                    type="text"
                    placeholder="Bill details (claim for job)"
                    className="field-input"
                    value={billDetails}
                    name="billDetails"
                    onChange={(e) => setBillDetails(e.target.value)}
                    disabled={
                      selectedInvoice?.invoiceStatus === "SENT" ||
                      selectedInvoice?.invoiceStatus === "PAID"
                    }
                  />
                </div>
                <div className="fieldset">
                  <span>Bill Amount</span>
                  <input
                    type="number"
                    placeholder="Bill Amount Rs (W/O GST)"
                    className="field-input"
                    value={billAmount}
                    name="billAmount"
                    onChange={handleBillAmountChange}
                    disabled={
                      selectedInvoice?.invoiceStatus === "SENT" ||
                      selectedInvoice?.invoiceStatus === "PAID"
                    }
                  />
                </div>
                <div className="fieldset">
                  <span>GST Rs</span>
                  <input
                    type="number"
                    placeholder="GST Rs"
                    className="field-input"
                    value={gstAmount}
                    name="gstAmount"
                    onChange={handleGstAmountChange}
                    disabled={
                      selectedInvoice?.invoiceStatus === "SENT" ||
                      selectedInvoice?.invoiceStatus === "PAID"
                    }
                  />
                </div>
                <div className="fieldset Invoices__form-section__last-fieldset">
                  <span>Bill Total Rs</span>
                  <input
                    type="number"
                    placeholder="Bill Total Rs"
                    className="field-input"
                    value={billTotal}
                    name="billTotal"
                    onChange={(e) => setBillTotal(e.target.value)}
                    disabled={true}
                  />
                </div>
              </>
            )}

            {currentSegment === 2 && (
              <>
                {selectedInvoice && (
                  <>
                    <div className="fieldset">
                      <span>Submitted to client on date</span>
                      <input
                        type="text"
                        placeholder="Submitted to client on date"
                        className="field-input"
                        value={submittedToDate}
                        name="submittedToDate"
                        onFocus={(e) => (e.target.type = "date")}
                        onChange={(e) => setSubmittedToDate(e.target.value)}
                        disabled={
                          selectedInvoice?.invoiceStatus === "SENT" ||
                          selectedInvoice?.invoiceStatus === "PAID"
                        }
                      />
                    </div>
                    <div className="fieldset">
                      <span>Approved by client Rs</span>
                      <input
                        type="number"
                        placeholder="Approved by client Rs"
                        className="field-input"
                        value={approvedByClient}
                        name="approvedByClient"
                        onChange={(e) => setApprovedByClient(e.target.value)}
                        disabled={
                          selectedInvoice?.invoiceStatus === "SENT" ||
                          selectedInvoice?.invoiceStatus === "PAID"
                        }
                      />
                    </div>
                    <div className="fieldset">
                      <span>Approved on Date</span>
                      <input
                        type="text"
                        placeholder="Approved on date"
                        className="field-input"
                        value={approvedOnDate}
                        name="approvedOnDate"
                        onFocus={(e) => (e.target.type = "date")}
                        onChange={(e) => setApprovedOnDate(e.target.value)}
                        disabled={
                          selectedInvoice?.invoiceStatus === "SENT" ||
                          selectedInvoice?.invoiceStatus === "PAID"
                        }
                      />
                    </div>
                  </>
                )}

                {/*<div className="fieldset ">
                  <span>SES No.</span>
                  <input
                    type="text"
                    placeholder="SES No."
                    className="field-input"
                    value={sesNo}
                    onChange={(e) => setSesNo(e.target.value)}
                    disabled={
                      selectedInvoice?.invoiceStatus === "SENT" ||
                      selectedInvoice?.invoiceStatus === "PAID"
                    }
                  />
                </div>
                <div className="fieldset Invoices__form-section__last-fieldset">
                  <span>SES Amount Rs</span>
                  <input
                    type="number"
                    placeholder="SES Amount Rs"
                    className="field-input"
                    value={sesAmount}
                    onChange={(e) => {
                      setSesAmount(e.target.value);
                      setInvoiceAmount(e.target.value);
                    }}
                    disabled={
                      selectedInvoice?.invoiceStatus === "SENT" ||
                      selectedInvoice?.invoiceStatus === "PAID"
                    }
                  />
                  </div>*/}
                {elements.map((element, index) => (
                  <div className="addElements" key={index}>
                    <div className="fieldset">
                      <span>SES No.</span>
                      <input
                        type="text"
                        placeholder="SES No."
                        className="field-input"
                        onChange={(e) => {
                          sesArr(e, index);
                          handleOnChange(e);
                        }}
                        name="no"
                        value={values.ses[index].no}
                        disabled={
                          selectedInvoice?.invoiceStatus === "SENT" ||
                          selectedInvoice?.invoiceStatus === "PAID"
                        }
                      />
                    </div>
                    <div className="fieldset Invoices__form-section__last-fieldset">
                      <span>SES Amount Rs</span>
                      <input
                        type="number"
                        placeholder="SES Amount Rs"
                        className="field-input"
                        name="amount"
                        onChange={(e) => {
                          sesArr(e, index);
                          handleOnChange(e);
                        }}
                        value={values.ses[index].amount}
                        disabled={
                          selectedInvoice?.invoiceStatus === "SENT" ||
                          selectedInvoice?.invoiceStatus === "PAID"
                        }
                      />
                    </div>
                  </div>))}
                <div className="fieldset">
                  <button onClick={AddItem}>Add</button>
                </div>
              </>
            )}

            {currentSegment === 3 && (
              <>
                <div className="fieldset">
                  <span>Invoice amount Rs</span>
                  <input
                    type="number"
                    placeholder="Invoice amount Rs"
                    className="field-input"
                    value={totalSESAmount}
                    name="invoiceAmount"
                    disabled
                  />
                </div>
                <div className="fieldset ">
                  <span>Invoice raised on date</span>
                  <input
                    type="text"
                    placeholder="Invoice raised on date"
                    className="field-input"
                    value={invoiceRaisedDate}
                    name="invoiceRaisedDate"
                    onFocus={(e) => (e.target.type = "date")}
                    onChange={(e) => setInvoiceRaisedDate(e.target.value)}
                    disabled={
                      selectedInvoice?.invoiceStatus === "SENT" ||
                      selectedInvoice?.invoiceStatus === "PAID"
                    }
                  />
                </div>
                <div className="fieldset">
                  <span>Expected payment date</span>
                  <input
                    type="text"
                    placeholder="Expected payment date"
                    className="field-input"
                    onFocus={(e) => (e.target.type = "date")}
                    value={expectedPaymentDate}
                    name="expectedPaymentDate"
                    onChange={(e) => setExpectedPaymentDate(e.target.value)}
                    disabled={
                      selectedInvoice?.invoiceStatus === "SENT" ||
                      selectedInvoice?.invoiceStatus === "PAID"
                    }
                  />
                </div>
                {selectedInvoice && (
                  <>
                    <div className="fieldset ">
                      <span>Amount received rs</span>
                      <input
                        type="number"
                        placeholder="Amount received rs"
                        className="field-input"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(e.target.value)}
                        disabled={
                          selectedInvoice?.invoiceStatus === "SENT" ||
                          selectedInvoice?.invoiceStatus === "PAID"
                        }
                      />
                    </div>
                    <div className="fieldset Invoices__form-section__last-fieldset">
                      <span>Amount received on date</span>
                      <input
                        type="text"
                        placeholder="Amount received date"
                        className="field-input"
                        value={amtReceivedDate}
                        onFocus={(e) => (e.target.type = "date")}
                        onChange={(e) => setAmtReceivedDate(e.target.value)}
                        disabled={
                          selectedInvoice?.invoiceStatus === "SENT" ||
                          selectedInvoice?.invoiceStatus === "PAID"
                        }
                      />
                    </div>
                  </>
                )}
                <div className="fieldset Invoices__form-section__upload-file Invoices__form-section__last-fieldset">
                  <span>Upload Invoice:</span>
                  <form
                    encType="multipart/form-data"
                    className="Invoices__form-section__upload-file__form"
                  >
                    <input
                      type="file"
                      className="Invoices__form-section__upload-file__input"
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      disabled={
                        selectedInvoice?.invoiceStatus === "SENT" ||
                        selectedInvoice?.invoiceStatus === "PAID"
                      }
                    />
                    {files.length > 0 && (
                      <div>
                        <span>Selected Files: </span>

                        {files.map((file, index) => (
                          <span key={index}>
                            {index + 1}. {file.filename}{" "}
                          </span>
                        ))}
                      </div>
                    )}
                  </form>
                </div>
              </>
            )}

            {/* {currentSegment === 4 && (
              <>
                <div className="fieldset ">
                  <span>Invoice status</span>
                  <select
                    value={invoiceStatus}
                    className="field-input"
                    onChange={(e) => setInvoiceStatus(e.target.value)}
                    disabled={
                      selectedInvoice?.invoiceStatus === "SENT" ||
                      selectedInvoice?.invoiceStatus === "PAID"
                    }
                  >
                    <option className="select-option" value="DUE">
                      DUE
                    </option>
                    <option className="select-option" value="SENT">
                      SENT
                    </option>
                    <option className="select-option" value="HOLD">
                      HOLD
                    </option>
                    <option className="select-option" value="PAID">
                      PAID
                    </option>
                  </select>
                </div>
                {invoiceStatus === "HOLD" && (
                  <>
                    <div className="fieldset ">
                      <span>Reason to hold</span>
                      <input
                        type="text"
                        placeholder="Reason to move invoice on HOLD"
                        className="field-input"
                        value={holdReason}
                        onChange={(e) => setHoldReason(e.target.value)}
                      />
                    </div>
                    <div className="fieldset ">
                      <span>Tentative period to hold</span>
                      <input
                        type="text"
                        placeholder="Tentative time period to HOLD invoice"
                        className="field-input"
                        value={holdTime}
                        onChange={(e) => setHoldTime(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="fieldset ">
                  <span>Deduction Rs</span>
                  <input
                    type="number"
                    placeholder="Deduction(If any) Rs"
                    className="field-input"
                    value={deduction}
                    onChange={(e) => setDeduction(e.target.value)}
                    disabled={
                      selectedInvoice?.invoiceStatus === "SENT" ||
                      selectedInvoice?.invoiceStatus === "PAID"
                    }
                  />
                </div>
                <div className="fieldset ">
                  <span>Reason for deduction</span>
                  <textarea
                    type="text"
                    placeholder="Deduction For"
                    className="field-input"
                    rows={4}
                    value={deductionReason}
                    onChange={(e) => setDeductionReason(e.target.value)}
                    disabled={
                      selectedInvoice?.invoiceStatus === "SENT" ||
                      selectedInvoice?.invoiceStatus === "PAID"
                    }
                  />
                </div>
              </>
            )} */}
            <div className="navigation-buttons">
              {currentSegment > 1 && (
                <button className="submit-btn" onClick={handlePreviousSegment}>
                  Previous
                </button>
              )}
              {currentSegment < 3 && (
                <button className="submit-btn" onClick={handleNextSegment}>
                  Next
                </button>
              )}
              {currentSegment === 3 && (
                <>
                  <button
                    className="submit-btn"
                    onClick={selectedInvoice ? updateInvoice : addInvoice}
                  >
                    {selectedInvoice ? "Update Invoice" : "Add Invoice"}
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NewInvoiceOverlay;

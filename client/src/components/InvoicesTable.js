import React, { useState } from "react";
import {
  MdInfoOutline,
  MdOutlineDescription,
  MdDateRange,
  MdClear,
} from "react-icons/md";
import axios from "axios";
import { LuIndianRupee } from "react-icons/lu";

const InvoicesTable = ({
  filteredInvoices,
  entity,
  setShowNewInvoiceForm,
  setSelectedInvoice,
  setFilteredInvoices,
  dontShowStatus,
  setFetchDataFlag,
}) => {
  const [holdTime, setHoldTime] = useState("");
  const [holdReason, setHoldReason] = useState("");
  const [openOverlays, setOpenOverlays] = useState([]);
  const [openInfoOverlays, setOpenInfoOverlays] = useState([]);

  const [amountReceived, setAmountReceived] = useState();
  const [amountReceivedDate, setAmountReceivedDate] = useState();
  const [showDeductionInput, setShowDeductionInput] = useState(false);
  const [deductionReason, setDeductionReason] = useState("");
  const [submittedToDate, setSubmittedToDate] = useState();
  const [approvedByClient, setApprovedByClient] = useState();
  const [approvedOnDate, setApprovedOnDate] = useState();
  const [previousStatusMap, setPreviousStatusMap] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleStatusChange = async (
    invoiceId,
    event,
    invoiceAmount,
    amountReceived
  ) => {
    const status = event.target.value;

    const previousStatus = filteredInvoices.find(
      (invoice) => invoice._id === invoiceId
    )?.invoiceStatus;

    if (status === "HOLD" || status === "SENT") {
      toggleOverlay(invoiceId);
    }
    if (status === "PAID" && amountReceived !== invoiceAmount) {
      toggleOverlay(invoiceId);
    }
    const companyId = entity._id;
    try {
      await axios.put("http://localhost:4000/update-invoice-status", {
        companyId,
        invoiceId,
        status,
      });

      const updatedInvoices = filteredInvoices.map((invoice) =>
        invoice._id === invoiceId
          ? { ...invoice, invoiceStatus: status }
          : invoice
      );

      setFilteredInvoices(updatedInvoices);
      setPreviousStatusMap((prevMap) => ({
        ...prevMap,
        [invoiceId]: previousStatus,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleOverlay = (invoiceId) => {
    setOpenOverlays(
      openOverlays.includes(invoiceId)
        ? openOverlays.filter((id) => id !== invoiceId)
        : [...openOverlays, invoiceId]
    );
  };
  const toggleInfoOverlay = (invoiceId) => {
    setOpenInfoOverlays(
      openInfoOverlays.includes(invoiceId)
        ? openInfoOverlays.filter((id) => id !== invoiceId)
        : [...openInfoOverlays, invoiceId]
    );
  };
  const isOverlayOpen = (invoiceId) => openOverlays.includes(invoiceId);
  const isInfoOverlayOpen = (invoiceId) => openInfoOverlays.includes(invoiceId);
  const submitInvoice = async (companyId, invoiceId, invoiceAmount) => {
    const calculatedDeduction = calculateDeduction(
      invoiceAmount,
      amountReceived
    );

    try {
      if (holdTime && holdTime !== "" && holdReason && holdReason !== "") {
        const response = await axios.put(
          "http://localhost:4000/update-invoice-status",
          {
            companyId,
            invoiceId,
            holdTime,
            holdReason,
          }
        );
        setFetchDataFlag(true);
        if (response.status === 200) {
          toggleOverlay(invoiceId);
          setHoldReason("");
          setHoldTime("");
        }
      }
      if (amountReceived !== undefined && amountReceived !== "") {
        console.log(" updated amount rec: ", amountReceived);
        const response = await axios.put(
          "http://localhost:4000/update-invoice-status",
          {
            companyId,
            invoiceId,
            amountReceived,
            amtReceivedDate: amountReceivedDate,
          }
        );

        setFetchDataFlag(true);
        if (response.status === 200) {
          toggleOverlay(invoiceId);
          setAmountReceived("");
          setAmountReceivedDate("");
        }
      }
      if (
        submittedToDate !== undefined &&
        submittedToDate !== "" &&
        approvedByClient !== undefined &&
        approvedByClient !== "" &&
        approvedOnDate !== undefined &&
        approvedOnDate !== ""
      ) {
        const response = await axios.put(
          "http://localhost:4000/update-invoice-status",
          {
            companyId,
            invoiceId,
            submittedToDate,
            approvedByClient,
            approvedOnDate,
          }
        );
        setFetchDataFlag(true);
        if (response.status === 200) {
          toggleOverlay(invoiceId);
          setSubmittedToDate("");
          setApprovedByClient("");
          setApprovedOnDate("");
        }
      }
      if (deductionReason !== undefined && deductionReason !== undefined) {
        const response = await axios.put(
          "http://localhost:4000/update-invoice-status",
          {
            companyId,
            invoiceId,
            deduction: calculatedDeduction,
            deductionReason: deductionReason,
            loss: calculatedDeduction,
          }
        );
        setFetchDataFlag(true);
        if (response.status === 200) {
          toggleOverlay(invoiceId);
          setDeductionReason("");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const evaluateAmountReceived = (amountReceived, invoiceAmount) => {
    const parsedAmountReceived = parseInt(amountReceived);
    setAmountReceived(amountReceived);

    console.log(
      " invoiceAmount: ",
      invoiceAmount,
      " amount received: ",
      amountReceived
    );

    let deduction = Number.parseInt(invoiceAmount) - parsedAmountReceived;

    if (deduction === 0) {
      setShowDeductionInput(false);
      console.log("deduction == zero");
      return;
    } else if (deduction > 0) {
      setShowDeductionInput(true);
    }
  };
  const handleBillNoClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowNewInvoiceForm(true);
  };
  const calculateDeduction = (invoiceAmount, receivedAmount) => {
    return parseInt(invoiceAmount) - parseInt(receivedAmount);
  };

  return (
    <table className="Invoices__main__table">
      <thead>
        <tr>
          <th className="Invoices__main__table__bill-no Invoices__main__table__heading">
            Bill No.
          </th>
          <th className="Invoices__main__table__bill-total Invoices__main__table__heading">
            Final Bill with GST
          </th>
          <th className="Invoices__main__table__submitted Invoices__main__table__heading">
            Submitted On Date
          </th>
          <th className="Invoices__main__table__ses-no Invoices__main__table__heading">
            SES Number
          </th>
          <th className="Invoices__main__table__expected Invoices__main__table__heading">
            Expected Date (Due Date)
          </th>
          <th className="Invoices__main__table__approval Invoices__main__table__heading">
            Client Approval Date
          </th>
          <th className="Invoices__main__table__recieved Invoices__main__table__heading">
            Received Amount
          </th>
          <th className="Invoices__main__table__recieved-date Invoices__main__table__heading">
            Amount Received date
          </th>

          <th className="Invoices__main__table__status Invoices__main__table__heading">
            Invoice Status
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredInvoices &&
          filteredInvoices.map((item, index) => (
            <tr key={index} className={` Invoices__main__table__records `}>
              <td
                className={`Invoices__main__table__records__bill-no
                  ${
                    index === filteredInvoices.length - 1
                      ? "Invoices__main__table__records__last-record__bill-no"
                      : ""
                  }
                `}
                onClick={() => handleBillNoClick(item)}
              >
                {item.billNo}
              </td>
              <td>{item.billTotal}</td>
              <td>{formatDate(item.submittedToDate)}</td>
              <td>{item.sesNo}</td>
              <td>{formatDate(item.expectedPaymentDate)}</td>
              <td>{formatDate(item.approvedOnDate)}</td>
              <td>
                {item.amountReceived === "" || item.amountReceived === null
                  ? "0"
                  : item.amountReceived}
              </td>
              <td>
                {item.amtReceivedDate === "" || item.amtReceivedDate === null
                  ? "-"
                  : formatDate(item.amtReceivedDate)}
              </td>
              <td
                className={`Invoices__main__table__records__status
                  ${
                    index === filteredInvoices.length - 1
                      ? "Invoices__main__table__records__last-record__status"
                      : ""
                  }
                `}
              >
                {dontShowStatus && <>{item.invoiceStatus}</>}
                {!dontShowStatus && (
                  <select
                    value={item.invoiceStatus || "DUE"}
                    className="select"
                    onChange={(event) =>
                      handleStatusChange(
                        item._id,
                        event,
                        item.invoiceAmount,
                        item.amountReceived
                      )
                    }
                    disabled={item.invoiceStatus === "PAID"}
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
                )}
                {(item.invoiceStatus === "HOLD" ||
                  (item.invoiceStatus === "PAID" &&
                    parseInt(item.invoiceAmount) -
                      parseInt(item.amountReceived) !==
                      0)) && (
                  <MdInfoOutline
                    size={20}
                    className="Invoices__main__table__records__status__info-icon"
                    onClick={() => {
                      toggleInfoOverlay(item._id);
                    }}
                  />
                )}
                {isOverlayOpen(item._id) && (
                  <div className="Invoices__main__table__records__status__overlay">
                    <div className="Invoices__main__table__records__status__overlay__form-section">
                      <MdClear
                        className="Invoices__main__table__records__status__overlay__close-icon"
                        size={20}
                        onClick={() => {
                          // Revert status to its previous value
                          handleStatusChange(
                            item._id,
                            { target: { value: previousStatusMap[item._id] } }, // Pass previous status
                            item.invoiceAmount,
                            item.amountReceived
                          );
                          toggleOverlay(item._id);
                        }}
                      />
                      {item.invoiceStatus === "HOLD" && (
                        <>
                          <div className="fieldset">
                            <MdOutlineDescription size={18} />
                            <input
                              type="text"
                              placeholder="Reason to move invoice on HOLD"
                              className="field-input"
                              value={holdReason}
                              onChange={(e) => setHoldReason(e.target.value)}
                            />
                          </div>
                          <div className="fieldset">
                            <MdOutlineDescription size={18} />
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
                      {item.invoiceStatus === "SENT" && (
                        <>
                          <div className="fieldset">
                            <MdDateRange size={18} />
                            <input
                              type="text"
                              placeholder="Submitted to client on date"
                              className="field-input"
                              value={submittedToDate}
                              onFocus={(e) => (e.target.type = "date")}
                              onChange={(e) => {
                                setSubmittedToDate(e.target.value);
                                console.log(e.target.value);
                              }}
                            />
                          </div>
                          <div className="fieldset">
                            <LuIndianRupee size={18} />
                            <input
                              type="text"
                              placeholder="Approved by client Rs"
                              className="field-input"
                              value={approvedByClient}
                              onChange={(e) =>
                                setApprovedByClient(e.target.value)
                              }
                            />
                          </div>
                          <div className="fieldset">
                            <MdDateRange size={18} />
                            <input
                              type="text"
                              placeholder="Approved by client on date"
                              className="field-input"
                              value={approvedOnDate}
                              onFocus={(e) => (e.target.type = "date")}
                              onChange={(e) =>
                                setApprovedOnDate(e.target.value)
                              }
                            />
                          </div>
                        </>
                      )}

                      {item.invoiceStatus === "PAID" && (
                        <>
                          <div className="fieldset">
                            <LuIndianRupee size={18} />
                            <input
                              type="number"
                              placeholder="Amount received"
                              className="field-input"
                              onChange={(e) =>
                                evaluateAmountReceived(
                                  e.target.value,
                                  item.invoiceAmount
                                )
                              }
                            />
                          </div>
                          <div className="fieldset">
                            <MdDateRange size={18} />
                            <input
                              type="text"
                              placeholder="Amount received date"
                              className="field-input"
                              onFocus={(e) => (e.target.type = "date")}
                              onChange={(e) =>
                                setAmountReceivedDate(e.target.value)
                              }
                            />
                          </div>
                          {showDeductionInput && (
                            <>
                              <div className="fieldset">
                                <LuIndianRupee size={18} />
                                <input
                                  type="number"
                                  placeholder="Deduction"
                                  className="field-input"
                                  value={calculateDeduction(
                                    item.invoiceAmount,
                                    amountReceived
                                  )}
                                  disabled
                                />
                              </div>
                              <div className="fieldset">
                                <MdOutlineDescription size={18} />
                                <input
                                  type="text"
                                  placeholder="Reason for deduction"
                                  className="field-input"
                                  onChange={(e) =>
                                    setDeductionReason(e.target.value)
                                  }
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                      <button
                        className="submit-btn"
                        onClick={() =>
                          submitInvoice(
                            entity._id,
                            item._id,
                            item.invoiceAmount
                          )
                        }
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
                {isInfoOverlayOpen(item._id) && (
                  <div className="Invoices__main__table__records__status__info-overlay">
                    <div className="Invoices__main__table__records__status__info-overlay__form-section">
                      {item.invoiceStatus === "HOLD" && (
                        <>
                          <div className="fieldset">
                            Reason to hold invoice: <u>{item.holdReason}</u>
                          </div>
                          <div className="fieldset">
                            Tentative time to hold invoice:{" "}
                            <u>{item.holdTime}</u>
                          </div>
                        </>
                      )}
                      {item.invoiceStatus === "PAID" && (
                        <>
                          <div className="fieldset">
                            Total amount received: <u>{item.amountReceived}</u>
                          </div>
                          <div className="fieldset">
                            Deduction reason: <u>{item.deductionReason}</u>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default InvoicesTable;

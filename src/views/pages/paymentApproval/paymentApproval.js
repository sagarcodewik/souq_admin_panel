import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CBadge,
  CSpinner,
  CRow,
  CCol,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilCheckCircle,
  cilCloudDownload,
  cilSearch,
  cilMoney,
} from "@coreui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDriverPayments,
  approveDriverPayment,
} from "../../../redux/slice/paymentApproval";
import DataTable from "../../../components/datatable/datatable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useDebounce } from "use-debounce";

const DriverPaymentsApproval = () => {
  const dispatch = useDispatch();
  const { list, total, page, pageSize, status } = useSelector(
    (state) => state.adminDriverPayments
  );

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);

  useEffect(() => {
    dispatch(fetchDriverPayments({ page, pageSize, search: debouncedSearch }));
  }, [dispatch, page, pageSize, debouncedSearch]);

  const handleApprove = (id) => {
    dispatch(approveDriverPayment(id));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Driver Payments Ledger", 14, 15);

    const tableColumns = [
      "Ledger ID",
      "Driver Name",
      "Driver ID",
      "Contact Number",
      "Order ID",
      "Amount",
      "Source",
      "Status",
      "Date",
    ];

    const tableRows = list.map((row) => [
      row._id,
      row.driverId?.FullName || "-",
      row.driverId?._id || "-",
      row.driverId?.mobileNumber || "-",
      row.orderId,
      row.amountCollected?.toFixed(2),
      row.source.replaceAll("_", " "),
      row.status || "-",
      new Date(row.date).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 25,
    });

    const date = new Date().toISOString().split("T")[0];
    doc.save(`driver_payments_${date}.pdf`);
  };



  const headers = [
    { key: "_id", label: "Ledger ID" },
    {
      key: "driver",
      label: "Driver Info.",
      render: (row) => (
        <div className="d-flex flex-column">
          <span className="fw-bold">{row.driverId?.FullName || "-"}</span>
          <small className="text-muted">ID: {row.driverId?._id || "-"}</small>
          <small className="text-muted">Contact: {row.driverId?.mobileNumber || "-"}</small>
        </div>
      ),
    },
    { key: "orderId", label: "Order ID" },
    {
      key: "amountCollected",
      label: "Amount",
      render: (row) => (
        <strong className="text-success">₹{row.amountCollected?.toFixed(2)}</strong>
      ),
    },
    {
      key: "source",
      label: "Source",
      render: (row) => (
        <CBadge
          color={row.source === "paid_to_admin" ? "warning" : "info"}
          className="text-uppercase px-3 py-2 fw-semibold"
        >
          {row.source.replaceAll("_", " ")}
        </CBadge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <CBadge
          color={
            row.status === "approved"
              ? "success"
              : row.status === "pending"
                ? "secondary"
                : "dark"
          }
          className="px-3 py-2 fw-semibold"
        >
          {row.status}
        </CBadge>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row) =>
        row.status === "pending" && row.source === "paid_to_admin" ? (
          <CTooltip content="Approve Payment">
            <CButton
              color="success"
              size="sm"
              variant="outline"
              className="fw-semibold"
              onClick={() => handleApprove(row._id)}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <CSpinner size="sm" />
              ) : (
                <>
                  <CIcon icon={cilCheckCircle} className="me-1" />
                  Approve
                </>
              )}
            </CButton>
          </CTooltip>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
  ];



  return (
    <div className="fade-in">
      <CCard className="shadow-sm border-0 rounded-4">
        <CCardHeader className="bg-light d-flex justify-content-between align-items-center flex-wrap py-3 px-4 border-0">
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
            Driver Payment Approvals
          </h5>

          <div className="d-flex align-items-center gap-3">
            <div className="input-group" style={{ width: "300px" }}>
              <span className="input-group-text bg-white border-end-0">
                <CIcon icon={cilSearch} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search driver or order..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <CButton color="primary" variant="outline" onClick={handleDownloadPDF}>
              <CIcon icon={cilCloudDownload} className="me-2" />
              Export PDF
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody className="px-4 py-3">
          <DataTable
            data={list}
            headers={headers}
            totalRecords={total}
            currentPage={page}
            pageSize={pageSize}
            isLoading={status === "loading"}
            onPageChange={(p) =>
              dispatch(
                fetchDriverPayments({
                  page: p,
                  pageSize,
                  search: debouncedSearch,
                })
              )
            }
          />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default DriverPaymentsApproval;

import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilReload, cilCloudDownload } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFinancialBreakdown } from '../../../redux/slice/finance'
import DataTable from '../../../components/datatable/datatable'
import { useDebounce } from 'use-debounce'

// ✅ Import jsPDF & autoTable
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const Finance = () => {
  const dispatch = useDispatch()
  const { financials, status, totalRecords, currentPage, pageSize } = useSelector(
    (state) => state.finance,
  )

  const [searchText, setSearchText] = useState('')
  const [debouncedSearch] = useDebounce(searchText, 500)

  useEffect(() => {
    dispatch(fetchFinancialBreakdown({ page: currentPage, pageSize, search: debouncedSearch }))
  }, [dispatch, currentPage, pageSize, debouncedSearch])

  const handlePageChange = (page) => {
    dispatch(fetchFinancialBreakdown({ page, pageSize, search: debouncedSearch }))
  }

  // ---------------- PDF Download ----------------
  const handleDownloadPDF = () => {
    if (!financials || financials.length === 0) {
      alert('No data available to download.')
      return
    }

    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(16)
    doc.text('Admin Financial Breakdown', 14, 15)

    const tableColumns = [
      'Order Number',
      'Vendor Email',
      'Grand Total (SYP)',
      'Driver Earnings (SYP)',
      'Admin Commission (SYP)',
      'Vendor Earnings (SYP)',
      'Date',
    ]

    const tableRows = financials.map((row) => [
      row.orderNumber || '',
      row.vendor?.email || '',
      row.grandTotal?.toFixed(2) || '0.00',
      row.driverEarnings?.toFixed(2) || '0.00',
      row.adminCommission?.toFixed(2) || '0.00',
      row.vendorEarnings?.toFixed(2) || '0.00',
      row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '',
    ])

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [51, 102, 204] },
    })

    const date = new Date().toISOString().split('T')[0]
    doc.save(`admin_financial_breakdown_${date}.pdf`)
  }
  // -------------------------------------------------

  const headers = [
    { key: 'orderNumber', label: 'Order Number', sortable: true },
    { key: 'vendor', label: 'Vendor Email', sortable: true, render: (row) => row.vendor?.email },
    { key: 'grandTotal', label: 'Grand Total(SYP)', sortable: true, render: (row) => `${row.grandTotal.toFixed(2)}` },
    { key: 'driverEarnings', label: 'Driver Earnings(SYP)', sortable: true, render: (row) => `${row.driverEarnings.toFixed(2)}` },
    { key: 'adminCommission', label: 'Admin Commission(SYP)', sortable: true, render: (row) => `${row.adminCommission.toFixed(2)}` },
    { key: 'vendorEarnings', label: 'Vendor Earnings(SYP)', sortable: true, render: (row) => `${row.vendorEarnings.toFixed(2)}` },
    { key: 'createdAt', label: 'Date', sortable: true, render: (row) => new Date(row.createdAt).toLocaleDateString() },
  ]

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">Admin Financial Breakdown</h5>
          <div className="d-flex align-items-center gap-3">
            <div className="input-group" style={{ width: '350px' }}>
              <span className="input-group-text bg-white">
                <CIcon icon={cilSearch} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search vendor email and order number"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <CButton color="primary" onClick={handleDownloadPDF}>
              <CIcon icon={cilCloudDownload} className="me-2" />
              Download PDF
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <DataTable
            data={financials}
            headers={headers}
            totalRecords={totalRecords}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            isLoading={status === 'loading'}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Finance

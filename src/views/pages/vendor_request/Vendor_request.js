import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPendingVendors, updateVendorStatus } from '../../../redux/slice/vendorApprovalSlice'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { FaEye } from 'react-icons/fa'
import Loader from './../../../components/loader/Loader'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const Vendor_request = () => {
  const dispatch = useDispatch()
  const { pendingVendors, totalPages, status, error } = useSelector((state) => state.vendorApproval)

  const [statusUpdating, setStatusUpdating] = useState(false)
  const [visible, setVisible] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [searchQuery, setSearchQuery] = useState({ businessName: '', ownerName: '', email: '' })
  const [page, setPage] = useState(1)
  const limit = 10 // items per page

  // Debounce effect for live search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData()
    }, 400) // triggers 400ms after user stops typing

    return () => clearTimeout(delayDebounce)
  }, [searchQuery, page])

  const fetchData = () => {
    dispatch(fetchPendingVendors({ page, limit, ...searchQuery }))
  }

  const handleStatusUpdate = (vendorId, newStatus) => {
    setStatusUpdating(true)
    dispatch(updateVendorStatus({ vendorId, status: newStatus }))
      .unwrap()
      .then(() => {
        fetchData()
      })
      .catch((err) => {
        console.error('Status update failed:', err)
      })
      .finally(() => {
        setStatusUpdating(false)
      })
  }

  const openVendorDetails = (vendor) => {
    setSelectedVendor(vendor)
    setVisible(true)
  }

  return (
    <div className="p-3">
      <h4 className="mb-4 text-center">Pending Vendor Requests</h4>
      <div className="d-flex gap-3 mb-3">

        <div className="input-group" style={{ maxWidth: '320px' }}>
          <span className="input-group-text bg-white border-end-0">
            <CIcon icon={cilSearch} />
          </span>
          <CFormInput
            placeholder="Search By Business Name"
            value={searchQuery.businessName}
            onChange={(e) => {
              setPage(1)
              setSearchQuery({ ...searchQuery, businessName: e.target.value })
            }}
          />
        </div>

        <div className="input-group" style={{ maxWidth: '320px' }}>
          <span className="input-group-text bg-white border-end-0">
            <CIcon icon={cilSearch} />
          </span>
          <CFormInput
            placeholder="Search By Owner Name"
            value={searchQuery.ownerName}
            onChange={(e) => {
              setPage(1)
              setSearchQuery({ ...searchQuery, ownerName: e.target.value })
            }}
          />
        </div>

        <div className="input-group" style={{ maxWidth: '320px' }}>
          <span className="input-group-text bg-white border-end-0">
            <CIcon icon={cilSearch} />
          </span>
          <CFormInput
            placeholder="Search By Email"
            value={searchQuery.email}
            onChange={(e) => {
              setPage(1)
              setSearchQuery({ ...searchQuery, email: e.target.value })
            }}
          />
        </div>

      </div>



      {(status === 'loading' || statusUpdating) && <Loader />}
      {error && <p className="text-danger text-center">{error}</p>}

      {pendingVendors.length === 0 && status === 'succeeded' && (
        <p className="text-center">No pending vendors found.</p>
      )}

      {pendingVendors.length > 0 && (
        <>
          <CTable striped bordered hover responsive>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>S.No.</CTableHeaderCell>
                <CTableHeaderCell>Business Name</CTableHeaderCell>
                <CTableHeaderCell>Owner Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {pendingVendors.map((vendor, index) => (
                <CTableRow key={vendor._id}>
                  <CTableHeaderCell>{(page - 1) * limit + index + 1}</CTableHeaderCell>
                  <CTableDataCell>{vendor.businessName}</CTableDataCell>
                  <CTableDataCell>{vendor.ownerName}</CTableDataCell>
                  <CTableDataCell>{vendor.userId?.email}</CTableDataCell>
                  <CTableDataCell>{vendor.status}</CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-2">
                      <CButton
                        color="success"
                        size="sm"
                        onClick={() => handleStatusUpdate(vendor._id, 'Approved')}
                      >
                        Approve
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleStatusUpdate(vendor._id, 'Rejected')}
                      >
                        Reject
                      </CButton>
                      <CButton color="info" size="sm" onClick={() => openVendorDetails(vendor)}>
                        <FaEye />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          {/* Pagination */}
          <CPagination align="center" className="mt-3">
            {[...Array(totalPages).keys()].map((p) => (
              <CPaginationItem
                key={p + 1}
                active={p + 1 === page}
                onClick={() => setPage(p + 1)}
              >
                {p + 1}
              </CPaginationItem>
            ))}
          </CPagination>
        </>
      )}

      {/* Vendor Details Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Vendor Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedVendor && (
            <div>
              <p><strong>Business Name:</strong> {selectedVendor.businessName}</p>
              <p><strong>Owner Name:</strong> {selectedVendor.ownerName}</p>
              <p><strong>Email:</strong> {selectedVendor.userId?.email}</p>
              <p><strong>Category:</strong> {selectedVendor.category}</p>
              <p><strong>BusinessPhone:</strong> {selectedVendor.businessPhone || 'N/A'}</p>
              <p><strong>Whatsapp Number:</strong> {selectedVendor.whatsappNumber || 'N/A'}</p>
              <p>
                <strong>License Document:</strong>{' '}
                {selectedVendor.licenseDocument ? (
                  <a href={selectedVendor.licenseDocument} target="_blank" rel="noopener noreferrer">
                    View Document
                  </a>
                ) : (
                  'N/A'
                )}
              </p>
              <p><strong>bankOrMobilePayInfo:</strong> {selectedVendor.bankOrMobilePayInfo || 'N/A'}</p>
              <p><strong>Status:</strong> {selectedVendor.status}</p>
              <p>
                <strong>Address:</strong>{' '}
                {selectedVendor.address
                  ? `${selectedVendor.address.street}, ${selectedVendor.address.city}, ${selectedVendor.address.state}, ${selectedVendor.address.country}`
                  : 'N/A'}
              </p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Vendor_request

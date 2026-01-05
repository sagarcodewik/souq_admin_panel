import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../components/datatable/datatable'
import { fetchAllVendors, updateVendorStatus } from '../../../redux/slice/vendorApprovalSlice'
import { AllVendorHeaders } from '../../../utils/header'
import Loader from '../../../components/loader/Loader'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
} from '@coreui/react'
import { useDebounce } from 'use-debounce'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const ManageVendor = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { vendors, status, totalRecords } = useSelector((state) => state.vendorApproval)

  const [selectedVendor, setSelectedVendor] = useState(null)
  const [visible, setVisible] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')

  // ✅ Debounced search
  const [searchText, setSearchText] = useState('')
  const [debouncedSearch] = useDebounce(searchText, 500)

  const loadVendors = useCallback(() => {
    dispatch(
      fetchAllVendors({
        page: currentPage,
        pageSize,
        sortKey,
        sortDirection,
        search: debouncedSearch,
      }),
    )
  }, [dispatch, currentPage, pageSize, sortKey, sortDirection, debouncedSearch])

  useEffect(() => {
    loadVendors()
  }, [loadVendors])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSort = (key, direction) => {
    setSortKey(key)
    setSortDirection(direction === 'asc' ? 'asc' : 'desc')
    setCurrentPage(1)
  }

  const onToggleDelete = (vendor) => {
    console.log('Toggling delete for vendor:', vendor)
    if (!vendor?._id) return

    const vendorId = vendor._id
    const deleted = !vendor.user.deleted

    console.log('Dispatching updateVendorStatus with:', { vendorId, deleted })
    setIsUpdating(true)
    dispatch(updateVendorStatus({ vendorId, deleted }))
      .unwrap()
      .then(() => loadVendors())
      .catch((err) => console.error('Delete toggle failed:', err))
      .finally(() => setIsUpdating(false))
  }

  const onToggleStatus = (vendor) => {
    if (!vendor?._id) return

    const vendorId = vendor._id
    const status = vendor.status === 'Approved' ? 'Rejected' : 'Approved'

    setIsUpdating(true)
    dispatch(updateVendorStatus({ vendorId, status }))
      .unwrap()
      .then(() => loadVendors())
      .catch((err) => console.error('Status update failed:', err))
      .finally(() => setIsUpdating(false))
  }

  const headers = AllVendorHeaders(
    navigate,
    dispatch,
    setSelectedVendor,
    setVisible,
    onToggleDelete,
    onToggleStatus,
  )

  return (
    <div>
      {status === 'loading' || isUpdating ? (
        <Loader />
      ) : (
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-3">Approved Vendors</h4>
            <div className="input-group" style={{ maxWidth: '400px' }}>
              <span className="input-group-text bg-white border-end-0">
                <CIcon icon={cilSearch} />
              </span>
              <CFormInput
                type="text"
                placeholder="Search by email, business name, and name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DataTable
            data={vendors}
            headers={headers}
            isLoading={false}
            pageSize={pageSize}
            currentPage={currentPage}
            totalRecords={totalRecords}
            onPageChange={handlePageChange}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        </div>
      )}
      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Vendor Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedVendor && (
            <div>
              <p>
                <strong>Business Name:</strong> {selectedVendor.businessName}
              </p>
              <p>
                <strong>Owner Name:</strong> {selectedVendor.ownerName}
              </p>
              <p>
                <strong>Email:</strong> {selectedVendor.user?.email}
              </p>
              <p>
                <strong>Category:</strong> {selectedVendor.category}
              </p>
              <p>
                <strong>BusinessPhone:</strong> {selectedVendor.businessPhone || 'N/A'}
              </p>
              <p>
                <strong>Whatsapp Number:</strong> {selectedVendor.whatsappNumber || 'N/A'}
              </p>
              <p>
                <strong>License Document:</strong>{' '}
                {selectedVendor.licenseDocument ? (
                  <a
                    href={selectedVendor.licenseDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'blue', textDecoration: 'underline' }}
                  >
                    View Document
                  </a>
                ) : (
                  'N/A'
                )}
              </p>
              <p>
                <strong>bankOrMobilePayInfo:</strong> {selectedVendor.bankOrMobilePayInfo || 'N/A'}
              </p>
              <p>
                <strong>Status:</strong> {selectedVendor.status}
              </p>
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
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ManageVendor

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
import { useTranslation } from 'react-i18next'

const ManageVendor = () => {
  const { t } = useTranslation('vendors')
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
    t,
  )

  return (
    <div>
      {status === 'loading' || isUpdating ? (
        <Loader />
      ) : (
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-3">{t('title')}</h4>
            <div className="input-group" style={{ maxWidth: '400px' }}>
              <span className="input-group-text bg-white border-end-0">
                <CIcon icon={cilSearch} />
              </span>
              <CFormInput
                type="text"
                placeholder={t('search_placeholder')}
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
          <CModalTitle>{t('modal.title')}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedVendor && (
            <div>
              <p>
                <strong>{t('modal.business_name')}:</strong> {selectedVendor.businessName}
              </p>
              <p>
                <strong>{t('modal.owner_name')}:</strong> {selectedVendor.ownerName}
              </p>
              <p>
                <strong>{t('modal.email')}:</strong> {selectedVendor.user?.email}
              </p>
              <p>
                <strong>{t('modal.category')}:</strong> {selectedVendor.category}
              </p>
              <p>
                <strong>{t('modal.business_phone')}:</strong> {selectedVendor.businessPhone || 'N/A'}
              </p>
              <p>
                <strong>{t('modal.whatsapp')}:</strong> {selectedVendor.whatsappNumber || 'N/A'}
              </p>
              <p>
                <strong>{t('license')}:</strong>{' '}
                {selectedVendor.licenseDocument ? (
                  <a
                    href={selectedVendor.licenseDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'blue', textDecoration: 'underline' }}
                  >
                      {t('modal.view_document')}
                  </a>
                ) : (
                  'N/A'
                )}
              </p>
              <p>
                <strong>{t('modal.bank_info')}:</strong> {selectedVendor.bankOrMobilePayInfo || 'N/A'}
              </p>
              <p>
                <strong>{t('modal.status')}:</strong> {selectedVendor.status}
              </p>
              <p>
                <strong>{t('modal.address')}:</strong>{' '}
                {selectedVendor.address
                  ? `${selectedVendor.address.street}, ${selectedVendor.address.city}, ${selectedVendor.address.state}, ${selectedVendor.address.country}`
                  : 'N/A'}
              </p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
           {t('modal.close')}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ManageVendor

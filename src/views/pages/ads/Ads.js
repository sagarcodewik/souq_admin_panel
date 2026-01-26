import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CCarousel,
  CCarouselItem,
  CPagination,
  CPaginationItem,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAdvertisements,
  approveAdvertisement,
  rejectAdvertisement,
  deleteAdvertisement,
} from '../../../redux/slice/advertisemnet'
import Loader from '../../../components/loader/Loader'
import { useTranslation } from 'react-i18next'

const AdminAdvertisements = () => {
  const { t } = useTranslation('advertisements')

  const dispatch = useDispatch()
  const { data, status, pagination } = useSelector((state) => state.advertisements) || {}
  const advertisements = data || []

  const [selectedAd, setSelectedAd] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [reportedFilter, setReportedFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [statusTab, setStatusTab] = useState('pending')
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [adToReject, setAdToReject] = useState(null)

  const itemsPerPage = 10

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, reportedFilter, statusTab])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length === 0 || searchQuery.length >= 2) {
        const query = {
          search: searchQuery || undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          reported:
            reportedFilter === 'reported'
              ? true
              : reportedFilter === 'not_reported'
                ? false
                : undefined,
          status: statusTab,
          page: currentPage,
          limit: itemsPerPage,
        }
        dispatch(fetchAdvertisements(query)).unwrap()
      }
    }, 400)

    return () => clearTimeout(delayDebounce)
  }, [dispatch, searchQuery, categoryFilter, reportedFilter, currentPage, statusTab])

  // Approve
  const handleApprove = async (id) => {
    await dispatch(approveAdvertisement(id)).unwrap()
    dispatch(fetchAdvertisements({ status: statusTab, page: currentPage, limit: itemsPerPage }))
  }

  // Reject
  const handleReject = async () => {
    if (!rejectReason.trim()) return
    await dispatch(rejectAdvertisement({ id: adToReject, reason: rejectReason })).unwrap()
    setRejectModal(false)
    setRejectReason('')
    setAdToReject(null)
    dispatch(fetchAdvertisements({ status: statusTab, page: currentPage, limit: itemsPerPage }))
  }

  // Delete
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAdvertisement(id)).unwrap()
      dispatch(fetchAdvertisements({ status: statusTab, page: currentPage, limit: itemsPerPage }))
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-4">{t('title')}</h4>

      {/* Tabs */}
      <CNav variant="tabs" className="mb-4">
        <CNavItem>
          <CNavLink active={statusTab === 'pending'} onClick={() => setStatusTab('pending')}>
            {t('tabs.pending')}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={statusTab === 'approved'} onClick={() => setStatusTab('approved')}>
            {t('tabs.approved')}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={statusTab === 'rejected'} onClick={() => setStatusTab('rejected')}>
            {t('tabs.rejected')}
          </CNavLink>
        </CNavItem>
      </CNav>

      {/* Filters */}
      <CRow className="mb-3">
        <CCol md={4}>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              placeholder={t('filters.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CInputGroup>
        </CCol>
        <CCol md={4}>
          {/* <CFormSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            <option value="real_estate">Real Estate</option>
            <option value="car">Cars</option>
            <option value="used_item">Used Items</option>
          </CFormSelect> */}
          <CFormSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">{t('filters.allCategories')}</option>
            <option value="real_estate">{t('filters.realEstate')}</option>
            <option value="car">{t('filters.cars')}</option>
            <option value="used_item">{t('filters.usedItems')}</option>
          </CFormSelect>
        </CCol>
        <CCol md={4}>
          {/* <CFormSelect value={reportedFilter} onChange={(e) => setReportedFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="not_reported">Active</option>
            <option value="reported">Reported</option>
          </CFormSelect> */}
          <CFormSelect value={reportedFilter} onChange={(e) => setReportedFilter(e.target.value)}>
            <option value="">{t('filters.allStatus')}</option>
            <option value="not_reported">{t('filters.active')}</option>
            <option value="reported">{t('filters.reported')}</option>
          </CFormSelect>
        </CCol>
      </CRow>

      {/* Ads List */}
      <CRow>
        {status === 'loading' ? (
          <Loader />
        ) : advertisements.length ? (
          advertisements.map((ad) => (
            <CCol md={4} key={ad._id} className="mb-4">
              <CCard>
                <div
                  className="overflow-hidden"
                  style={{ height: '13em', cursor: 'pointer' }}
                  onClick={() => setSelectedAd(ad)}
                >
                  <img src={ad.images?.[0]} className="card-img-top" alt={ad.title} />
                </div>
                <CCardBody>
                  <h5>{ad.title}</h5>
                  <p className="text-muted">{ad.price}(SYP)</p>
                  <CBadge
                    color={
                      ad.status === 'approved'
                        ? 'success'
                        : ad.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                    }
                  >
                    {ad.status}
                  </CBadge>

                  {/* Pending Section */}
                  {ad.status === 'pending' && (
                    <div className="d-flex justify-content-between mt-3">
                      <CButton
                        size="sm"
                        color="success"
                        className="text-white"
                        onClick={() => handleApprove(ad._id)}
                      >
                        {t('actions.approve')}
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        className="text-white"
                        onClick={() => {
                          setAdToReject(ad._id)
                          setRejectModal(true)
                        }}
                      >
                        {t('actions.reject')}
                      </CButton>
                    </div>
                  )}

                  {/* Approved Section (Delete Button) */}
                  {ad.status === 'approved' && (
                    <div className="d-flex justify-content-end mt-3">
                      <CButton
                        size="sm"
                        color="danger"
                        className="text-white"
                        onClick={() => handleDelete(ad._id)}
                      >
                        {t('actions.delete')}
                      </CButton>
                    </div>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          ))
        ) : (
          <p>{t('empty.noAds')}</p>
        )}
      </CRow>

      {/* Reject Modal */}
      <CModal visible={rejectModal} onClose={() => setRejectModal(false)}>
        <CModalHeader>
          <CModalTitle>{t('modal.rejectTitle')}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormTextarea
            rows={3}
            placeholder={t('modal.rejectPlaceholder')}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="d-flex justify-content-end mt-3">
            <CButton color="secondary" onClick={() => setRejectModal(false)} className="me-2">
              {t('actions.cancel')}
            </CButton>
            <CButton color="danger" onClick={handleReject}>
              {t('actions.reject')}
            </CButton>
          </div>
        </CModalBody>
      </CModal>

      {/* 🔹 Ad Details Modal */}
      <CModal size="md" visible={!!selectedAd} onClose={() => setSelectedAd(null)}>
        <CModalHeader>
          <CModalTitle>{t('modal.detailsTitle')}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedAd && (
            <>
              {selectedAd.images?.length > 0 && (
                <CCarousel controls indicators>
                  {selectedAd.images.map((img, idx) => (
                    <CCarouselItem key={idx}>
                      <img
                        src={img}
                        className="d-block w-100"
                        style={{ height: '300px', objectFit: 'cover' }}
                        alt={`slide-${idx}`}
                      />
                    </CCarouselItem>
                  ))}
                </CCarousel>
              )}
              <h5 className="mt-3">{selectedAd.title}</h5>
              <p className="text-muted">{selectedAd.price} SYP</p>
              <p>
                <strong>{t('labels.category')}:</strong>{' '}
                {selectedAd.category || t('labels.notSpecified')}
              </p>
              <p>
                <strong>{t('labels.status')}:</strong>{' '}
                <CBadge
                  color={
                    selectedAd.status === 'approved'
                      ? 'success'
                      : selectedAd.status === 'rejected'
                        ? 'danger'
                        : 'warning'
                  }
                >
                  {selectedAd.status}
                </CBadge>
              </p>

              <p>
                <strong>{t('labels.description')}:</strong>{' '}
                {selectedAd.description || t('labels.noDescription')}
              </p>
              <p>
                <strong>{t('labels.location')}:</strong>{' '}
                {selectedAd.location || t('labels.notSpecified')}
              </p>
            <p>
            <strong>{t('labels.status')}:</strong>{' '}
            {selectedAd.status
              ? t(`statusMap.${selectedAd.status}`)
              : t('labels.notSpecified')}
          </p>
              <p>
                <strong>{t('labels.email')}:</strong> {selectedAd.email || t('labels.notSpecified')}
              </p>

              <p>
                <strong>{t('labels.phone')}:</strong> {selectedAd.phone || t('labels.notSpecified')}
              </p>
              <p>
                <strong>{t('labels.contactMethod')}:</strong>{' '}
                {selectedAd.contactPreferences_preferredMethod || t('labels.notSpecified')}
              </p>
              <p>
                <strong>{t('labels.contactTime')}:</strong>{' '}
                {selectedAd.contactPreferences_preferredTime || t('labels.notSpecified')}
              </p>
              <p>
                <strong>{t('labels.agent')}:</strong> {selectedAd.agent || t('labels.notSpecified')}
              </p>
              <p>
                <strong>{t('labels.reported')}:</strong>{' '}
                {selectedAd.reported ? (
                  <CBadge color="danger">{t('labels.yes')}</CBadge>
                ) : (
                  <CBadge color="success">{t('labels.no')}</CBadge>
                )}
              </p>
            </>
          )}
        </CModalBody>
      </CModal>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <CPagination align="center">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              &laquo;
            </CPaginationItem>
            {Array.from({ length: pagination.totalPages }, (_, i) => {
              const page = i + 1
              return (
                <CPaginationItem
                  key={page}
                  active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </CPaginationItem>
              )
            })}
            <CPaginationItem
              disabled={currentPage === pagination.totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
            >
              &raquo;
            </CPaginationItem>
          </CPagination>
        </div>
      )}
    </div>
  )
}

export default AdminAdvertisements

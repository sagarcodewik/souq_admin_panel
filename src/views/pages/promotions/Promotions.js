import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormInput,
  CInputGroup,
  CInputGroupText
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import DataTable from '../../../components/datatable/datatable'
import Loader from '../../../components/loader/Loader'
import { fetchPromotions,updatePromotionStatus } from '../../../redux/slice/promotion'
import { PromotionHeaders } from '../../../utils/header'

const Promotions = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    list: promotions,
    status,
    pageSize,
    currentPage,
    totalRecords,
    sortKey,
    sortDirection,
  } = useSelector((state) => state.promotions)

  const [selectedPromotion, setSelectedPromotion] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [titleSearch, setTitleSearch] = useState('')
  const [typeSearch, setTypeSearch] = useState('')
  const [codeSearch, setCodeSearch] = useState('')
  const [isActiveSearch, setIsActiveSearch] = useState('')

  const handleView = (promotion) => {
    setSelectedPromotion(promotion)
    setShowModal(true)
  }
  const handleStatusChange = async (updatePayload) => {
    await dispatch(updatePromotionStatus(updatePayload));
    dispatch(fetchPromotions({
      page: currentPage,
      pageSize,
      sortKey,
      sortDirection
    }));
  };

  const fetch = useCallback(() => {
    dispatch(
      fetchPromotions({
        page: currentPage || 1,
        pageSize: pageSize || 10,
        sortKey: sortKey || 'createdAt',
        sortDirection: sortDirection || 'desc',
        title: titleSearch,
        type: typeSearch,
        promotionCode: codeSearch,
        isActive: isActiveSearch, // NEW FILTER
      }),
    )
  }, [dispatch, currentPage, pageSize, sortKey, sortDirection, titleSearch, typeSearch, codeSearch, isActiveSearch])

  useEffect(() => {
    fetch()
  }, [fetch])

  const handleSort = (key, direction) => {
    dispatch(
      fetchPromotions({
        page: currentPage,
        pageSize,
        sortKey: key,
        sortDirection: direction,
        title: titleSearch,
        type: typeSearch,
        promotionCode: codeSearch,
        isActive: isActiveSearch,
      }),
    )
  }

  const handlePageChange = (page) => {
    dispatch(
      fetchPromotions({
        page,
        pageSize,
        sortKey,
        sortDirection,
        title: titleSearch,
        type: typeSearch,
        promotionCode: codeSearch,
        isActive: isActiveSearch,
      }),
    )
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Promotions</h4>
      </div>

      {/* Search Inputs */}
      <div className="d-flex gap-2 mb-3">
        <CInputGroup style={{ maxWidth: '250px' }}>
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
          <CFormInput
            type="text"
            placeholder="Search by Title..."
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
          />
        </CInputGroup>

        <CInputGroup style={{ maxWidth: '250px' }}>
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
          <CFormInput
            type="text"
            placeholder="Search by Type..."
            value={typeSearch}
            onChange={(e) => setTypeSearch(e.target.value)}
          />
        </CInputGroup>

        <CInputGroup style={{ maxWidth: '270px' }}>
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
          <CFormInput
            type="text"
            placeholder="Search by promotion code..."
            value={codeSearch}
            onChange={(e) => setCodeSearch(e.target.value)}
          />
        </CInputGroup>

        {/* Is Active Filter */}
        <CInputGroup style={{ maxWidth: '200px' }}>
          <CInputGroupText>Status</CInputGroupText>
          <select
            className="form-select"
            value={isActiveSearch}
            onChange={(e) => setIsActiveSearch(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </CInputGroup>
      </div>

      {status === 'loading' ? (
        <Loader />
      ) : (
        <DataTable
          data={promotions}
          headers={PromotionHeaders(handleView, handleStatusChange)}
          isLoading={status === 'loading'}
          pageSize={pageSize}
          currentPage={currentPage}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
      )}

      {/* Details Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Promotion Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPromotion && (
            <div className="p-2">
              <p>
                <strong>Title:</strong> {selectedPromotion.title}
              </p>
              <p>
                <strong>Description:</strong> {selectedPromotion.description}
              </p>
              <p>
                <strong>Type:</strong> {selectedPromotion.type}
              </p>
              <p>
                <strong>Promotion Code:</strong> {selectedPromotion.promotionCode}
              </p>
              <p>
                <strong>Discount:</strong> {selectedPromotion.discountPercentage}%
              </p>
              <p>
                <strong>Products: </strong>
              </p>
              <CTable striped bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Product Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Price(SYP)</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedPromotion.productIds.map((product, index) => (
                    <CTableRow key={product._id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{product.productName}</CTableDataCell>
                      <CTableDataCell>{product.discountedprice}</CTableDataCell>
                      <CTableDataCell>{product.category?.category}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <p>
                <strong>Start Date:</strong>{' '}
                {new Date(selectedPromotion.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{' '}
                {new Date(selectedPromotion.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Is Active:</strong> {selectedPromotion.isActive ? 'Yes' : 'No'}
              </p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Promotions

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsWithReviews } from '../../../redux/slice/review'
import Loader from '../../../components/loader/Loader'
import moment from 'moment'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CCollapse,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const renderStars = (rating) => {
  const fullStars = Math.floor(rating)
  const emptyStars = 5 - fullStars
  return (
    <span style={{ color: '#f1c40f', fontSize: '1rem' }}>
      {'★'.repeat(fullStars)}
      {'☆'.repeat(emptyStars)}
    </span>
  )
}

const ReviewsController = () => {
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector((state) => state.review)

  const [expandedProductId, setExpandedProductId] = useState(null)
  const [activeTabs, setActiveTabs] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('latest')

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchProductsWithReviews({ search: searchTerm, sort: sortOrder }))
    }, 500)
    return () => clearTimeout(delayDebounce)
  }, [dispatch, searchTerm, sortOrder])

  const handleToggle = (productId) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId))
    setActiveTabs((prev) => ({
      ...prev,
      [productId]: 'product',
    }))
  }

  const handleTabClick = (productId, tab) => {
    setActiveTabs((prev) => ({
      ...prev,
      [productId]: tab,
    }))
  }

  const sortReviews = (reviews) => {
    return [...reviews].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime()
      const timeB = new Date(b.createdAt).getTime()
      return sortOrder === 'latest' ? timeB - timeA : timeA - timeB
    })
  }

  const products = list?.data || []

  return (
    <div>
      <div className="d-flex justify-content-between align-items-end mb-5">
        <h4 className="mb-0">Products with Reviews</h4>
        <div className="d-flex gap-3">
          <CInputGroup style={{ maxWidth: '1000px' }}>
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>

          <label style={{ paddingTop: '5px' }}>Sort:</label>
          <CFormSelect
            style={{ maxWidth: '140px' }}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highrating">High Rating</option>
            <option value="lowrating">Low Rating</option>
          </CFormSelect>
        </div>
      </div>

      {loading && <Loader />}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      {!loading &&
        !error &&
        products.map((product) => {
          const imageUrl = product.variants?.[0]?.images?.[0] || product.images?.[0]
          const isExpanded = expandedProductId === product._id
          const productReviews = (product.reviews || []).filter(
            (review) => !review.userType || review.userType === 'user'
          )
          const driverReviews = (product.reviews || []).filter(
            (review) => review.userType === 'driver'
          )
          const activeTab = activeTabs[product._id] || 'product'
          const overallRating = product.ratings?.overall || 0
          const reviewsCount = product.reviewsCount || product.reviews?.length || 0

          return (
            <CCard
              className="mb-3 shadow-sm"
              style={{
                border: isExpanded ? '1px solid rgb(33, 110, 116)' : '1px solid #dee2e6',
                borderRadius: '0.375rem',
              }}
              key={product._id}
            >
              <CCardBody>
                <div
                  className="d-flex justify-content-between align-items-center p-3 rounded"
                  style={{
                    cursor: 'pointer',
                    background: isExpanded
                      ? 'linear-gradient(135deg,rgb(30, 95, 100),rgb(14, 171, 188))'
                      : '#f8f9fa',
                    color: isExpanded ? 'white' : 'inherit',
                  }}
                  onClick={() => handleToggle(product._id)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={imageUrl}
                      alt={product.productName}
                      width="70"
                      height="50"
                      style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div>
                      <CCardTitle className={`mb-1 fw-bold ${isExpanded ? 'text-white' : ''}`}>
                        {product.productName}
                      </CCardTitle>
                      <CCardText className={isExpanded ? 'text-white' : ''}>
                        Rating: {renderStars(overallRating)} ({reviewsCount} reviews)
                      </CCardText>
                    </div>
                  </div>
                </div>

                <CCollapse visible={isExpanded}>
                  <div className="mt-3">
                    <CNav variant="tabs">
                      <CNavItem>
                        <CNavLink
                          active={activeTab === 'product'}
                          onClick={() => handleTabClick(product._id, 'product')}
                        >
                          Product Reviews
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          active={activeTab === 'driver'}
                          onClick={() => handleTabClick(product._id, 'driver')}
                        >
                          Driver Reviews
                        </CNavLink>
                      </CNavItem>
                    </CNav>

                    <CTabContent className="mt-3">
                      <CTabPane visible={activeTab === 'product'}>
                        {productReviews.length === 0 && (
                          <p className="text-muted">No product reviews found.</p>
                        )}
                        {sortReviews(productReviews).map((review) => (
                          <ReviewCard key={review._id} review={review} />
                        ))}
                      </CTabPane>

                      <CTabPane visible={activeTab === 'driver'}>
                        {driverReviews.length === 0 && (
                          <p className="text-muted">No driver reviews found.</p>
                        )}
                        {sortReviews(driverReviews).map((review) => (
                          <ReviewCard key={review._id} review={review} isDriver />
                        ))}
                      </CTabPane>
                    </CTabContent>
                  </div>
                </CCollapse>
              </CCardBody>
            </CCard>
          )
        })}
    </div>
  )
}

const ReviewCard = ({ review, isDriver }) => {
  return (
    <CCard className="mb-2 border border-info">
      <CCardBody className="d-flex align-items-start gap-3">
        <img
          src={review.userProfileImage}
          alt={review.userFullName}
          width="50"
          height="50"
          style={{ objectFit: 'cover', borderRadius: '50%', flexShrink: 0 }}
        />
        <div>
          <CCardTitle className="fw-semibold mb-1 text-info">
            {review.userFullName} {isDriver && '(Driver)'}
            <span className="ms-2">{renderStars(review.rating)}</span>
          </CCardTitle>
          <div className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
            {moment(review.createdAt).format('MMMM D, YYYY h:mm A')}
          </div>
          <CCardText className="mb-2">{review.review}</CCardText>
          {review.reply && (
            <div className="mt-2 p-2 bg-light border-start border-success border-3 rounded">
              <div className="fw-bold mb-1 text-success">Vendor Reply:</div>
              <div>{review.reply.message}</div>
            </div>
          )}
        </div>
      </CCardBody>
    </CCard>
  )
}

export default ReviewsController;

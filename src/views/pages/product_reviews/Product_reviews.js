// import React, { useEffect, useState } from 'react'
// import { CCard, CCardBody, CFormInput, CFormSelect, CAlert, CBadge } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilSearch, cilCommentSquare, cilCommentBubble } from '@coreui/icons'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchReviewsByProductId, fetchRatingByProductId } from '../../../redux/slice/review'
// import { localDateFormat } from '../../../utils'

// const Product_reviews = () => {
//   const productId = useSelector((state) => state.products.selectedProductId)
//   const dispatch = useDispatch()
//   const { reviews, totalReviews, averageRating } = useSelector((state) => state.review)

//   const [searchQuery, setSearchQuery] = useState('')
//   const [sortBy, setSortBy] = useState('newest')

//   useEffect(() => {
//     if (productId) {
//       dispatch(fetchReviewsByProductId(productId))
//       dispatch(fetchRatingByProductId(productId))
//     }
//   }, [dispatch, productId])

//   const getRatingColor = (rating) => {
//     if (rating >= 4) return 'text-success'
//     if (rating >= 3) return 'text-warning'
//     return 'text-danger'
//   }

//   const filteredReviews = Array.isArray(reviews)
//     ? reviews.filter(
//         (review) =>
//           review.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           review.review?.toLowerCase().includes(searchQuery.toLowerCase()),
//       )
//     : []

//   const sortedReviews = [...filteredReviews].sort((a, b) => {
//     switch (sortBy) {
//       case 'newest':
//         return new Date(b.createdAt) - new Date(a.createdAt)
//       case 'oldest':
//         return new Date(a.createdAt) - new Date(b.createdAt)
//       case 'highest':
//         return b.rating - a.rating
//       case 'lowest':
//         return a.rating - b.rating
//       default:
//         return 0
//     }
//   })

//   return (
//     <div className="container py-4">
//       <h4 className="text-xl fw-semibold mb-4">Product Reviews</h4>

//       <div className="row mb-4">
//         <div className="col-md-6">
//           <CCard>
//             <CCardBody>
//               <h6 className="text-muted">Total Reviews</h6>
//               <h4 className="fw-bold">{totalReviews}</h4>
//             </CCardBody>
//           </CCard>
//         </div>
//         <div className="col-md-6">
//           <CCard>
//             <CCardBody>
//               <h6 className="text-muted">Average Rating</h6>
//               <h4 className="fw-bold">
//                 {[...Array(5)].map((_, i) => (
//                   <span
//                     key={i}
//                     className={i < Math.round(averageRating || 0) ? 'text-warning' : 'text-muted'}
//                   >
//                     ★
//                   </span>
//                 ))}
//               </h4>
//             </CCardBody>
//           </CCard>
//         </div>
//       </div>

//       <div className="row mb-4">
//         <div className="col-md-8">
//           <div className="input-group">
//             <span className="input-group-text">
//               <CIcon icon={cilSearch} />
//             </span>
//             <CFormInput
//               type="text"
//               placeholder="Search reviews..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="col-md-4">
//           <CFormSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//             <option value="newest">Newest</option>
//             <option value="oldest">Oldest</option>
//             <option value="highest">Highest Rating</option>
//             <option value="lowest">Lowest Rating</option>
//           </CFormSelect>
//         </div>
//       </div>

//       {sortedReviews.length > 0 ? (
//         sortedReviews.map((review) => (
//           <CCard key={review.id} className="mb-4">
//             <CCardBody>
//               <div className="d-flex justify-content-between">
//                 <div>
//                   <h5 className="mb-1 fw-semibold">{review.user}</h5>
//                   <div className="d-flex align-items-center mb-2">
//                     {[...Array(5)].map((_, i) => (
//                       <span
//                         key={i}
//                         className={`me-1 ${i < review.rating ? 'text-warning' : 'text-muted'}`}
//                       >
//                         ★
//                       </span>
//                     ))}
//                     <span className={`ms-2 fw-medium ${getRatingColor(review.rating)}`}>
//                       {review.rating}.0
//                     </span>
//                   </div>
//                   <small className="text-muted">{localDateFormat(review.createdAt)}</small>
//                   {review.verified && (
//                     <CBadge color="success" className="ms-2">
//                       Verified Purchase
//                     </CBadge>
//                   )}
//                 </div>
//               </div>

//               <p className="mt-3">{review.review}</p>

//               {review.reply && (
//                 <CAlert color="primary" className="mt-4 mb-0">
//                   <div className="fw-semibold mb-1">
//                     <CIcon icon={cilCommentBubble} className="me-2" />
//                     Vendor Reply • {localDateFormat(review.reply.repliedAt)}
//                   </div>
//                   <p className="mb-0">{review.reply.message}</p>
//                 </CAlert>
//               )}
//               <div className="mt-4 d-flex gap-2 justify-content-end">
//                 <button className="btn btn-success btn-sm">Approve</button>
//                 <button className="btn btn-warning btn-sm">Hide</button>
//                 <button className="btn btn-danger btn-sm">Delete</button>
//               </div>
//             </CCardBody>
//           </CCard>
//         ))
//       ) : (
//         <div className="text-center py-5">
//           <CIcon icon={cilCommentSquare} size="xxl" className="text-muted mb-3" />
//           <p className="text-muted fs-5">No reviews found for this product.</p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Product_reviews

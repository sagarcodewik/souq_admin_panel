import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchActiveOrders } from '../../../redux/slice/activeOrders.js'
import Loader from '../../../components/loader/Loader.js'
import OrderCard from '../../../components/OrderCard.jsx'
import styles from './order.module.scss'
import { CPagination, CPaginationItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChevronLeft, cilChevronRight } from '@coreui/icons'
import { useDebounce } from 'use-debounce'
import { cilSearch } from '@coreui/icons'

const FailedOrders = () => {
  const dispatch = useDispatch()

  /* ───────────── local UI state ───────────── */
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 500)
  const [typeFilter, setTypeFilter] = useState('0')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loadingId, setLoadingId] = useState(null)

  /* ───────────── redux state ───────────── */
  const {
    orders = [],
    status = 'idle',
    totalRecords = 0,
    currentPage = 1,
    pageSize = 10,
  } = useSelector((state) => state.activeOrders ?? {})

  /* ───────────── fetch wrapper ───────────── */
  const loadOrders = useCallback(
    (page = 1) => {
      dispatch(
        fetchActiveOrders({
          page,
          pageSize,
          search: debouncedSearch.trim(),
          type: typeFilter,
          excludedStatuses: [
            'pending',
            'confirmed',
            'Ready',
            'driver-accepted',
            'picked',
            'delivered',
          ],
        }),
      )
    },
    [dispatch, pageSize, debouncedSearch, typeFilter],
  )

  /* initial + reactive fetch */
  useEffect(() => {
    loadOrders(1) // reset to page-1 when deps change
  }, [loadOrders])

  /* pagination handler */
  const handlePageChange = (page) => loadOrders(page)

  return (
    <div className="p-3">
      <h4 className="mb-3">Failed Orders</h4>

      {/* Filters */}
      <div className="d-flex flex-wrap gap-3 mb-3">
        <div className="input-group" style={{ maxWidth: '580px' }}>
          <span className="input-group-text bg-white border-end-0">
            <CIcon icon={cilSearch} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by order number, customer/vendor e-mail, or product name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="form-select w-auto"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="1">15 min</option>
          <option value="2">Market Place</option>
        </select>
      </div>

      {status === 'loading' ? (
        <Loader />
      ) : (
        <>
          <div className="mt-4">
            {orders.length === 0 ? (
              <div className="text-center">
                <p className="text-muted">No orders found.</p>
              </div>
            ) : (
              <div className={styles.orderList}>
                {orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    loading={loadingId === order._id}
                    type="ready"
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {orders.length > 0 && Math.ceil(totalRecords / pageSize) > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <CPagination align="center">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>

            {Array.from({ length: Math.ceil(totalRecords / pageSize) }, (_, i) => (
              <CPaginationItem
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </CPaginationItem>
            ))}

            <CPaginationItem
              disabled={currentPage === Math.ceil(totalRecords / pageSize)}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
          </CPagination>
        </div>
      )}
    </div>
  )
}

export default FailedOrders

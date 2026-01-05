import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../components/datatable/datatable'
import { fetchVendors } from '../../../redux/slice/store'
import { VendorHeaders } from '../../../utils/header'
import Loader from '../../../components/loader/Loader'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { useDebounce } from 'use-debounce'

const Store = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { vendors, status, totalRecords } = useSelector((state) => state.store)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')

  const [searchText, setSearchText] = useState('')
  const [debouncedSearch] = useDebounce(searchText, 500)

  const loadVendors = useCallback(() => {
    dispatch(
      fetchVendors({
        page: currentPage,
        pageSize,
        sortKey,
        sortDirection,
        search: debouncedSearch, // Include debounced search in dispatch
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

  const headers = VendorHeaders(navigate, dispatch)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h4 className="mb-0">Approved Vendors</h4>
        <div className="input-group" style={{ width: '300px' }}>
          <span className="input-group-text bg-white">
            <CIcon icon={cilSearch} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search vendor..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {status === 'loading' ? (
        <Loader />
      ) : (
        <div className="card-body">
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
    </div>
  )
}

export default Store

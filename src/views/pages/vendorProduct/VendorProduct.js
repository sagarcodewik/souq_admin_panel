import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../components/datatable/datatable'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../../redux/slice/product'
import { ProductHeaders } from '../../../utils/header'
import { setSelectedProductId } from '../../../redux/slice/product'
import { fetchCategories } from '../../../redux/slice/category'

const VendorProduct = () => {
  const vendorId = useSelector((state) => state.store.selectedVendorId)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { products, totalRecords, status } = useSelector((state) => state.products)
  const { categories } = useSelector((state) => state.categories)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')

  // 🔍 Search
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // ⏱ Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1) // reset page when searching
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  // 🚀 Load products
  const loadProducts = useCallback(() => {
    if (!vendorId) return
    dispatch(
      fetchProducts({
        page: currentPage,
        pageSize,
        sortKey,
        sortDirection,
        vendorId,
        search: debouncedSearch,
        categoryName: selectedCategory,
      }),
    )
  }, [
    dispatch,
    currentPage,
    pageSize,
    sortKey,
    sortDirection,
    vendorId,
    debouncedSearch,
    selectedCategory,
  ])

  useEffect(() => {
    if (vendorId) loadProducts()
  }, [loadProducts, vendorId])

  // 📂 Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handlePageChange = (page) => setCurrentPage(page)

  const handleSort = (key, direction) => {
    setSortKey(key)
    setSortDirection(direction)
    setCurrentPage(1)
  }

  const handleReview = (productId) => {
    dispatch(setSelectedProductId(productId))
    navigate(`/stores/products/reviews`)
  }

  const headers = ProductHeaders.map((header) => {
    if (header.key === 'actions') {
      return {
        ...header,
        render: (item) => header.render(item, handleReview),
      }
    }
    return header
  })

  return (
    <div className="p-4">
      {/* 🔍 Top bar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Vendor Products</h2>
        <div className="d-flex gap-2">
          {/* Search box */}
          <input
            type="text"
            placeholder="Search vendor products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ maxWidth: '220px' }}
          />

          {/* Category Filter */}
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1) // reset to first page on filter change
            }}
            style={{ maxWidth: '200px' }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 📊 Table */}
      <DataTable
        data={products}
        headers={headers}
        isLoading={status === 'loading'}
        pageSize={pageSize}
        currentPage={currentPage}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
      />
    </div>
  )
}

export default VendorProduct

import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilSearch } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../redux/slice/category'
import DataTable from '../../../components/datatable/datatable'
import { useDebounce } from 'use-debounce'

const Category = () => {
  const dispatch = useDispatch()
  const { categories, status, totalRecords, currentPage, pageSize } = useSelector(
    (state) => state.categories,
  )

  const [searchText, setSearchText] = useState('')
  const [debouncedSearch] = useDebounce(searchText, 500)

  const [visibleModal, setVisibleModal] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    color: false,
    commission: 0,
  })
  const [editId, setEditId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null })

  useEffect(() => {
    dispatch(fetchCategories({ page: currentPage, pageSize, search: debouncedSearch }))
  }, [dispatch, currentPage, pageSize, debouncedSearch])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      subCategory: formData.subCategory.split(',').map((s) => s.trim()),
      commission: parseFloat(formData.commission),
    }

    try {
      if (editId) {
        await dispatch(updateCategory({ categoryId: editId, updatedData: payload })).unwrap()
      } else {
        await dispatch(createCategory(payload)).unwrap()
      }
      setVisibleModal(false)
      setFormData({ category: '', subCategory: '', color: false, commission: 0 })
      setEditId(null)
      dispatch(fetchCategories({ page: currentPage, pageSize, search: debouncedSearch }))
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (category) => {
    setEditId(category._id)
    setFormData({
      category: category.category,
      subCategory: category.subCategory.join(', '),
      color: category.color,
      commission: category.commission,
    })
    setVisibleModal(true)
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteCategory(confirmDelete.id)).unwrap()
      setConfirmDelete({ show: false, id: null })
      dispatch(fetchCategories({ page: currentPage, pageSize, search: debouncedSearch }))
    } catch (err) {
      console.error(err)
    }
  }

  const handlePageChange = (page) => {
    dispatch(fetchCategories({ page, pageSize, search: debouncedSearch }))
  }

  const headers = [
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'subCategory',
      label: 'Subcategories',
      sortable: false,
      render: (row) => row.subCategory.join(', '),
    },
    { key: 'color', label: 'Color', sortable: false, render: (row) => (row.color ? 'Yes' : 'No') },
    { key: 'commission', label: 'Commission (%)', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <>
          <CButton size="sm" color="info" className="me-2" onClick={() => handleEdit(row)}>
            <CIcon icon={cilPencil} size="sm" />
          </CButton>
          <CButton
            size="sm"
            color="danger"
            onClick={() => setConfirmDelete({ show: true, id: row._id })}
          >
            <CIcon icon={cilTrash} size="sm" />
          </CButton>
        </>
      ),
      style: { textAlign: 'center', whiteSpace: 'nowrap' },
    },
  ]

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">Categories</h5>
          <div className="d-flex align-items-center gap-3">
            <div className="input-group" style={{ width: '300px' }}>
              <span className="input-group-text bg-white">
                <CIcon icon={cilSearch} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search category..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <CButton color="primary" onClick={() => setVisibleModal(true)}>
              <CIcon icon={cilPlus} className="me-2" /> Add Category
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <DataTable
            data={categories}
            headers={headers}
            totalRecords={totalRecords}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            isLoading={status === 'loading'}
          />
        </CCardBody>
      </CCard>

      {/* Add/Edit Modal */}
      <CModal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <CModalHeader closeButton>{editId ? 'Edit Category' : 'Add Category'}</CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="mb-3"
            />
            <CFormInput
              label="Subcategories (comma separated)"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              required
              className="mb-3"
            />
            <CFormCheck
              type="checkbox"
              name="color"
              label="Color"
              checked={formData.color}
              onChange={handleInputChange}
              className="mb-3"
            />
            <CFormInput
              type="number"
              label="Commission (%)"
              name="commission"
              value={formData.commission}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
              className="mb-3"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            {editId ? 'Update' : 'Create'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal
        visible={confirmDelete.show}
        onClose={() => setConfirmDelete({ show: false, id: null })}
      >
        <CModalHeader closeButton>Confirm Delete</CModalHeader>
        <CModalBody>Are you sure you want to delete this category?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setConfirmDelete({ show: false, id: null })}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Category

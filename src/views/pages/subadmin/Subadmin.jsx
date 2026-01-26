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
  fetchSubAdmins,
  fetchPermissions,
  updateSubAdmin,
  deleteSubAdmin,
  createSubAdmin,
} from '../../../redux/slice/subAdmin'
import DataTable from '../../../components/datatable/datatable'
import { useDebounce } from 'use-debounce'
import { formatPermissionLabel } from '../../../utils/constants'

const SubAdmin = () => {
  const dispatch = useDispatch()
  const { list, permissions, status, totalRecords, currentPage, pageSize } = useSelector(
    (state) => state.subAdmin,
  )

  const [searchText, setSearchText] = useState('')
  const [debouncedSearch] = useDebounce(searchText, 500)

  const [visibleModal, setVisibleModal] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    permissions: [],
  })
  const [editId, setEditId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null })
  const hasAtLeastOnePermission = formData.permissions.length > 0
  useEffect(() => {
    dispatch(fetchPermissions())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchSubAdmins({ page: currentPage, pageSize, search: debouncedSearch }))
  }, [dispatch, currentPage, pageSize, debouncedSearch])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async () => {
    if (editId) {
      const updateData = {
        permissions: formData.permissions,
      }

      if (formData.password?.trim()) {
        updateData.password = formData.password
      }

      await dispatch(
        updateSubAdmin({
          id: editId,
          data: updateData,
        }),
      )
    } else {
      await dispatch(
        createSubAdmin({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password, // ✅ REQUIRED
          permissions: formData.permissions,
        }),
      )
    }

    setVisibleModal(false)
  }

  const handleEdit = (row) => {
    setEditId(row._id)
    setFormData({
      fullName: row.fullName,
      email: row.email,
      permissions: row.permissions,
    })
    setVisibleModal(true)
  }
  const handleDelete = async () => {
    await dispatch(deleteSubAdmin(confirmDelete.id))
    setConfirmDelete({ show: false, id: null })
  }

  const handlePageChange = (page) => {
    dispatch(fetchSubAdmins({ page, pageSize, search: debouncedSearch }))
  }

  const headers = [
    { key: 'fullName', label: 'Sub Admin Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'permissions',
      label: 'Permissions',
      sortable: false,
      render: (row) => (row.permissions || []).join(', '),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <>
          <CButton size="sm" color="info" onClick={() => handleEdit(row)}>
            <CIcon icon={cilPencil} />
          </CButton>
          <CButton
            size="sm"
            color="danger"
            className="ms-2"
            onClick={() => setConfirmDelete({ show: true, id: row._id })}
          >
            <CIcon icon={cilTrash} />
          </CButton>
        </>
      ),
    },
  ]

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">Sub Admin</h5>
          <div className="d-flex align-items-center gap-3">
            <div className="input-group" style={{ width: '300px' }}>
              <span className="input-group-text bg-white">
                <CIcon icon={cilSearch} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search with fullname and email..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            {/* <CButton color="primary" onClick={() => setVisibleModal(true)}> */}
            <CButton
              color="primary"
              onClick={() => {
                setEditId(null)
                setFormData({
                  fullName: '',
                  email: '',
                  permissions: [],
                })

                setVisibleModal(true)
              }}
            >
              <CIcon icon={cilPlus} className="me-2" /> Add Subadmin
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <DataTable
            data={list}
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
      {/* <CModal visible={visibleModal} onClose={() => setVisibleModal(false)}> */}
      <CModal
        visible={visibleModal}
        onClose={() => {
          setVisibleModal(false)
          setEditId(null)
          setFormData({
            fullName: '',
            email: '',
            password: '',
            permissions: [],
          })
        }}
      >
        <CModalHeader closeButton>{editId ? 'Edit Sub Admin' : 'Add Sub Admin'}</CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              label="Full Name"
              name="fullName"
              placeholder="Enter a full name"
              value={formData.fullName}
              disabled={!!editId}
              onChange={handleInputChange}
              required
              className="mb-3"
            />

            <CFormInput
              label="Email"
              type="email"
              name="email"
              placeholder="Enter a email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!!editId}
              required
              className="mb-3"
            />
            <CFormInput
              label={editId ? 'New Password' : 'Password'}
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleInputChange}
              placeholder={
                editId
                  ? 'Leave blank to keep current password'
                  : 'Enter a password (at least 6 characters)'
              }
              className="mb-3"
            />

            <div className="mb-2 fw-semibold">Permissions</div>

            {permissions.map((p) => (
  <CFormCheck
    key={p}
    label={formatPermissionLabel(p)}
    checked={formData.permissions.includes(p)}
    onChange={() =>
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.includes(p)
          ? prev.permissions.filter((x) => x !== p)
          : [...prev.permissions, p],
      }))
    }
  />
))}
            {!hasAtLeastOnePermission && (
              <div className="text-danger small mt-2">Please select at least one permission</div>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit} disabled={!hasAtLeastOnePermission}>
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
        <CModalBody>Are you sure you want to delete this sub-admin?</CModalBody>

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

export default SubAdmin

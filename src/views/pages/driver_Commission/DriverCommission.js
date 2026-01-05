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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSearch } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDriverCommissions,
  updateDriverCommission,
} from '../../../redux/slice/driverCommission'
import DataTable from '../../../components/datatable/datatable'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

// ✅ Yup schema
const commissionSchema = Yup.object().shape({
  commissionPercentage: Yup.number()
    .typeError('Commission must be a number')
    .required('Commission is required')
    .min(0, 'Commission cannot be less than 0')
    .max(100, 'Commission cannot be greater than 100'),
})

const DriverCommission = () => {
  const dispatch = useDispatch()
  const { commissions, status } = useSelector((state) => state.driverCommission)

  const [searchText, setSearchText] = useState('')
  const [visibleModal, setVisibleModal] = useState(false)
  const [editItem, setEditItem] = useState(null)

  useEffect(() => {
    dispatch(fetchDriverCommissions())
  }, [dispatch])

  const handleEdit = (commission) => {
    setEditItem(commission)
    setVisibleModal(true)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateDriverCommission(values)).unwrap()
      setVisibleModal(false)
      setEditItem(null)
      dispatch(fetchDriverCommissions()) // refresh
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const headers = [
    {
      key: 'driverType',
      label: 'Driver Type',
      sortable: true,
      render: (row) => (row.driverType === 'full_time' ? 'Full Time' : 'Part Time'),
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      sortable: true,
      render: (row) => row.vehicle.charAt(0).toUpperCase() + row.vehicle.slice(1),
    },
    { key: 'commissionPercentage', label: 'Commission (%)', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <CButton size="sm" color="info" onClick={() => handleEdit(row)}>
          <CIcon icon={cilPencil} /> Edit
        </CButton>
      ),
    },
  ]

  const filteredData = commissions.filter((c) => {
    const driverTypeLabel = c.driverType === 'full_time' ? 'Full Time' : 'Part Time'
    const vehicleLabel = c.vehicle.charAt(0).toUpperCase() + c.vehicle.slice(1)

    return (
      driverTypeLabel.toLowerCase().includes(searchText.toLowerCase()) ||
      vehicleLabel.toLowerCase().includes(searchText.toLowerCase())
    )
  })

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">Driver Commissions</h5>
          <div className="input-group" style={{ width: '300px' }}>
            <span className="input-group-text bg-white">
              <CIcon icon={cilSearch} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search driver type or vehicle..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </CCardHeader>

        <CCardBody>
          <DataTable
            data={filteredData}
            headers={headers}
            totalRecords={filteredData.length}
            currentPage={1}
            pageSize={10}
            onPageChange={() => {}}
            isLoading={status === 'loading'}
          />
        </CCardBody>
      </CCard>

      {/* Update Modal */}
      <CModal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <CModalHeader closeButton>Update Commission</CModalHeader>
        {editItem && (
          <Formik
            initialValues={{
              driverType: editItem.driverType,
              vehicle: editItem.vehicle,
              commissionPercentage: editItem.commissionPercentage,
            }}
            validationSchema={commissionSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <CModalBody>
                  <div className="mb-3">
                    <label className="form-label">Driver Type</label>
                    <input
                      type="text"
                      value={editItem.driverType === 'full_time' ? 'Full Time' : 'Part Time'}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vehicle</label>
                    <input
                      type="text"
                      value={editItem.vehicle.charAt(0).toUpperCase() + editItem.vehicle.slice(1)}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Commission (%)</label>
                    <Field
                      name="commissionPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="commissionPercentage"
                      component="div"
                      className="text-danger small mt-1"
                    />
                  </div>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisibleModal(false)}>
                    Cancel
                  </CButton>
                  <CButton type="submit" color="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </CButton>
                </CModalFooter>
              </Form>
            )}
          </Formik>
        )}
      </CModal>
    </>
  )
}

export default DriverCommission

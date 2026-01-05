import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPendingDrivers, updateDriverStatus } from '../../../redux/slice/driverApprovelSlice'
import {
  CButton,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { FaEye } from 'react-icons/fa'
import Loader from './../../../components/loader/Loader'
const Vendor_request = () => {
  const dispatch = useDispatch()
  const { pendingDrivers, status, error } = useSelector((state) => state.drivers)

  const [visible, setVisible] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    dispatch(fetchPendingDrivers())
  }, [dispatch])

  const handleStatusUpdate = (driverId, newStatus) => {
    setUpdatingId(driverId)
    dispatch(updateDriverStatus({ driverId, status: newStatus }))
      .unwrap()
      .then(() => {
        dispatch(fetchPendingDrivers())
      })
      .catch((err) => {
        console.error('Status update failed:', err)
      })
      .finally(() => {
        setUpdatingId(null)
      })
  }

  const openVendorDetails = (vendor) => {
    setSelectedVendor(vendor)
    setVisible(true)
  }

  return (
    <>
      {updatingId && <Loader />}
      <div className="p-3">
        <h4 className="mb-4 text-center">Pending Driver Requests</h4>

        {status === 'loading' && <Loader />}

        {error && <p className="text-danger text-center">{error}</p>}

        {pendingDrivers.length === 0 && status === 'succeeded' && (
          <p className="text-center">No pending drivers found.</p>
        )}

        {pendingDrivers.length > 0 && (
          <CTable striped bordered hover responsive>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell className="text-nowrap fw-medium">S.No.</CTableHeaderCell>
                <CTableHeaderCell className="text-nowrap fw-medium">Email</CTableHeaderCell>
                <CTableHeaderCell className="text-nowrap fw-medium">Status</CTableHeaderCell>
                <CTableHeaderCell className="text-nowrap fw-medium">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {pendingDrivers.map((driver, index) => (
                <CTableRow key={driver._id}>
                  <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{driver.userId?.email}</CTableDataCell>
                  <CTableDataCell>{driver.status}</CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-2">
                      <CButton
                        color="success"
                        size="sm"
                        onClick={() => handleStatusUpdate(driver._id, 'Approved')}
                      >
                        Approve
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleStatusUpdate(driver._id, 'Rejected')}
                      >
                        Reject
                      </CButton>
                      <CButton color="info" size="sm" onClick={() => openVendorDetails(driver)}>
                        <FaEye />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}

        {/* Modal to show full vendor details */}
        <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>Driver Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedVendor && (
              <div>
                <p>
                  <strong>Email:</strong> {selectedVendor.userId?.email}
                </p>
                <p>
                  <strong>Full Name:</strong> {selectedVendor.FullName}
                </p>
                <p>
                  <strong>Id Document Front:</strong>{' '}
                  {selectedVendor.idCardFrontUrl ? (
                    <a
                      href={selectedVendor.idCardFrontUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                      View Document
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
                <p>
                  <strong>Id Document Back:</strong>{' '}
                  {selectedVendor.idCardBackUrl ? (
                    <a
                      href={selectedVendor.idCardBackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                      View Document
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
                <p>
                  <strong>Driving License Document Front:</strong>{' '}
                  {selectedVendor.drivingLicenseFrontUrl ? (
                    <a
                      href={selectedVendor.drivingLicenseFrontUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                      View Document
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
                <p>
                  <strong>Driving License Document Back:</strong>{' '}
                  {selectedVendor.drivingLicenseBackUrl ? (
                    <a
                      href={selectedVendor.drivingLicenseBackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                      View Document
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
                <p>
                  <strong>Status:</strong> {selectedVendor.status}
                </p>
              </div>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    </>
  )
}

export default Vendor_request

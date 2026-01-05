import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../components/datatable/datatable'
import { fetchAllDrivers, updateDriverStatus } from '../../../redux/slice/driverApprovelSlice'
import { AllDriverHeaders } from '../../../utils/header'
import Loader from '../../../components/loader/Loader'
import io from 'socket.io-client'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
} from '@coreui/react'
import { useDebounce } from 'use-debounce'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import GoogleMapMarkers from '../../../components/GoogleMapMarkers'

const ManageDriver = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [socket, setSocket] = useState(null)

  const {
    drivers = [],
    status = 'idle',
    totalRecords = 0,
  } = useSelector((state) => state.drivers || {})

  const [selectedDriver, setSelectedDriver] = useState(null)
  const [visible, setVisible] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [activeDeliveringDrivers, setActiveDeliveringDrivers] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')
  const [searchText, setSearchText] = useState('')
  const [debouncedSearch] = useDebounce(searchText, 500)

  const loadDrivers = useCallback(() => {
    dispatch(
      fetchAllDrivers({
        page: currentPage,
        pageSize,
        sortKey,
        sortDirection,
        search: debouncedSearch,
      }),
    )
  }, [dispatch, currentPage, pageSize, sortKey, sortDirection, debouncedSearch])

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BASE_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })

    newSocket.on('connect', () => {
      console.log('Socket connected successfully')
      setSocketConnected(true)
      setSocket(newSocket)
      // Request active drivers once connected
      newSocket.emit('getActiveDeliveringDrivers')
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      setSocketConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setSocketConnected(false)
    })

    newSocket.on('activeDriversResponse', (response) => {
      console.log('Active drivers received:', response)
      if (response.success) {
        setActiveDeliveringDrivers(response.drivers || [])
      } else {
        console.error('Failed to get active drivers:', response.message)
        setActiveDeliveringDrivers([])
      }
    })

    // Cleanup on component unmount
    return () => {
      if (newSocket) {
        newSocket.off('connect')
        newSocket.off('disconnect')
        newSocket.off('connect_error')
        newSocket.off('activeDriversResponse')
        newSocket.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    loadDrivers()
  }, [loadDrivers])

  // Request active drivers when socket connects or reconnects
  useEffect(() => {
    if (socketConnected && socket) {
      socket.emit('getActiveDeliveringDrivers')
    }
  }, [socketConnected, socket])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSort = (key, direction) => {
    setSortKey(key)
    setSortDirection(direction === 'asc' ? 'asc' : 'desc')
    setCurrentPage(1)
  }

  const onToggleDelete = (driver) => {
    if (!driver?._id) return
    const driverId = driver._id
    const deleted = !driver.user.deleted
    setIsUpdating(true)
    dispatch(updateDriverStatus({ driverId, deleted }))
      .unwrap()
      .then(() => loadDrivers())
      .catch((err) => console.error('Delete toggle failed:', err))
      .finally(() => setIsUpdating(false))
  }

  const onToggleStatus = (driver) => {
    if (!driver?._id) return
    const driverId = driver._id
    const status = driver.status === 'Approved' ? 'Rejected' : 'Approved'

    setIsUpdating(true)
    dispatch(updateDriverStatus({ driverId, status }))
      .unwrap()
      .then(() => loadDrivers())
      .catch((err) => console.error('Status update failed:', err))
      .finally(() => setIsUpdating(false))
  }

  const headers = AllDriverHeaders(
    navigate,
    dispatch,
    setSelectedDriver,
    setVisible,
    onToggleDelete,
    onToggleStatus,
  )

  return (
    <div>
      {status === 'loading' || isUpdating ? (
        <Loader />
      ) : (
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-3">Drivers</h4>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <span className="input-group-text bg-white border-end-0">
                <CIcon icon={cilSearch} />
              </span>
              <CFormInput
                type="text"
                placeholder="Search by email and name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DataTable
            data={drivers}
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

      {/* Active Delivering Drivers Section */}
      <div className="mt-4">
        <h5>Active Delivering Drivers</h5>

        {/* Debug Information */}
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            marginBottom: '10px',
            fontSize: '14px',
          }}
        >
          <strong>Debug Information:</strong>
          <br />• API Key Present: {process.env.REACT_APP_GOOGLE_MAP_API ? 'Yes' : 'No'}
          <br />• Total Drivers: {activeDeliveringDrivers.length}
          <br />• Drivers with Location:{' '}
          {activeDeliveringDrivers.filter((d) => d?.location?.coordinates).length}
          <br />• Socket Connected: {socketConnected ? 'Yes' : 'No'}
          <br />• Base URL: {process.env.REACT_APP_BASE_URL || 'Not set'}
        </div>

        {!socketConnected ? (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
            }}
          >
            ⚠️ Waiting for real-time connection...
            {socketConnected === false && (
              <div style={{ marginTop: '10px', fontSize: '12px' }}>
                Trying to connect to server...
              </div>
            )}
          </div>
        ) : activeDeliveringDrivers.length > 0 ? (
          <GoogleMapMarkers
            drivers={activeDeliveringDrivers}
            onDriverClick={(driver) => {
              setSelectedDriver(driver)
              setVisible(true)
            }}
          />
        ) : (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#d1ecf1',
              border: '1px solid #bee5eb',
              borderRadius: '4px',
            }}
          >
            No active delivering drivers at the moment
          </div>
        )}
      </div>

      {/* Driver Details Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Driver Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedDriver && (
            <div>
              <p>
                <strong>Name:</strong> {selectedDriver.FullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedDriver.user?.email}
              </p>
              <p>
                <strong>Status:</strong> {selectedDriver.status}
              </p>
              <p>
                <strong>Vehicle Type:</strong> {selectedDriver.vehicleType}
              </p>
              <p>
                <strong>Currently Delivering:</strong> {selectedDriver.isDelivering ? 'Yes' : 'No'}
              </p>
              {selectedDriver.location?.coordinates && (
                <p>
                  <strong>Location:</strong>
                  Lat: {selectedDriver.location.coordinates[1]}, Lng:{' '}
                  {selectedDriver.location.coordinates[0]}
                </p>
              )}
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
  )
}

export default ManageDriver

import React, { useEffect, useRef, useState } from 'react'

const GoogleMapMarkers = ({ drivers = [], onDriverClick }) => {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markers = useRef([])
  const [mapState, setMapState] = useState('loading') // loading, loaded, error

  // Validate API key
  const apiKey = process.env.REACT_APP_GOOGLE_MAP_API

  useEffect(() => {
    if (!apiKey) {
      setMapState('error')
      console.error('Google Maps API key is missing')
      return
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setMapState('loaded')
      return
    }

    // Check if script is already loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      console.log('Google Maps script already loading...')
      return
    }

    // Load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true

    script.onload = () => {
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps script loaded successfully')
        setMapState('loaded')
      } else {
        console.error('❌ Google Maps not available after script load')
        setMapState('error')
      }
    }

    script.onerror = (error) => {
      console.error('❌ Failed to load Google Maps script:', error)
      setMapState('error')
    }

    document.head.appendChild(script)

    // Handle Google Maps authentication errors
    window.gm_authFailure = () => {
      console.error('❌ Google Maps authentication failed')
      setMapState('error')
    }
  }, [apiKey])

  // Initialize map when script is loaded
  useEffect(() => {
    if (mapState !== 'loaded' || !mapRef.current) return

    try {
      console.log('Initializing map...')

      // Find valid drivers with location data
      const validDrivers = drivers.filter(
        (driver) =>
          driver?.location?.coordinates &&
          Array.isArray(driver.location.coordinates) &&
          driver.location.coordinates.length === 2 &&
          Math.abs(driver.location.coordinates[0]) > 0.001 && // Not near zero
          Math.abs(driver.location.coordinates[1]) > 0.001,
      )

      console.log('Valid drivers with location:', validDrivers.length)

      // Set center based on available drivers or default
      let center = { lat: 40.7128, lng: -74.006 } // New York default
      let zoom = 4

      if (validDrivers.length > 0) {
        // Use first driver's location as center
        center = {
          lat: validDrivers[0].location.coordinates[1],
          lng: validDrivers[0].location.coordinates[0],
        }
        zoom = 12
      }

      // Initialize map
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        zoom,
        center,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      })

      // Create markers
      createMarkers(validDrivers)

      console.log('✅ Map initialized successfully')
    } catch (error) {
      console.error('❌ Error initializing map:', error)
      setMapState('error')
    }
  }, [mapState, drivers])

  const createMarkers = (validDrivers) => {
    if (!mapInstance.current || validDrivers.length === 0) return

    // Clear existing markers
    markers.current.forEach((marker) => marker.setMap(null))
    markers.current = []

    const infowindow = new window.google.maps.InfoWindow()
    const bounds = new window.google.maps.LatLngBounds()

    validDrivers.forEach((driver) => {
      try {
        const position = {
          lat: driver.location.coordinates[1],
          lng: driver.location.coordinates[0],
        }

        const marker = new window.google.maps.Marker({
          position,
          map: mapInstance.current,
          title: driver.FullName || 'Driver',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(32, 32),
          },
        })

        // Info window content
        const contentString = `
          <div style="padding: 12px; min-width: 220px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #333;">${driver.FullName || 'Unknown Driver'}</h3>
            <p style="margin: 4px 0; color: #666;">
              <strong>📱 Phone:</strong> ${driver.mobileNumber || 'N/A'}
            </p>
            <p style="margin: 4px 0; color: #666;">
              <strong>🚗 Vehicle:</strong> ${driver.vehicleType || 'N/A'}
            </p>
            <p style="margin: 4px 0; color: #666;">
              <strong>Status:</strong> 
              <span style="color: ${driver.status === 'Approved' ? 'green' : 'orange'}">
                ${driver.status || 'N/A'}
              </span>
            </p>
            <button onclick="window.handleDriverClick('${driver._id}')" 
              style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; 
                     border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
              View Details
            </button>
          </div>
        `

        marker.addListener('click', () => {
          infowindow.setContent(contentString)
          infowindow.open(mapInstance.current, marker)
        })

        bounds.extend(position)
        markers.current.push(marker)
      } catch (error) {
        console.error('Error creating marker for driver:', driver._id, error)
      }
    })

    // Fit map to show all markers
    if (validDrivers.length > 0) {
      mapInstance.current.fitBounds(bounds)

      // Prevent over-zooming
      window.google.maps.event.addListenerOnce(mapInstance.current, 'idle', () => {
        if (mapInstance.current.getZoom() > 15) {
          mapInstance.current.setZoom(15)
        }
      })
    }
  }

  // Set up global click handler
  useEffect(() => {
    window.handleDriverClick = (driverId) => {
      const driver = drivers.find((d) => d._id === driverId)
      if (driver && onDriverClick) {
        onDriverClick(driver)
      }
    }

    return () => {
      window.handleDriverClick = null
    }
  }, [drivers, onDriverClick])

  if (mapState === 'error') {
    return (
      <div
        style={{
          height: '400px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
        <h4 style={{ color: '#721c24', marginBottom: '12px' }}>Map Unavailable</h4>
        <p style={{ color: '#856404', marginBottom: '16px' }}>
          Google Maps failed to load. Please check your API key configuration.
        </p>
        <div
          style={{
            backgroundColor: '#fff3cd',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '12px',
            textAlign: 'left',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <strong>Troubleshooting steps:</strong>
          <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Verify API key in Google Cloud Console</li>
            <li>Enable "Maps JavaScript API"</li>
            <li>Check API key restrictions</li>
            <li>Ensure billing is set up</li>
          </ol>
        </div>
      </div>
    )
  }

  if (mapState === 'loading') {
    return (
      <div
        style={{
          height: '400px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e9ecef',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
        }}
      >
        <div style={{ fontSize: '36px', marginBottom: '16px' }}>⏳</div>
        <h4 style={{ color: '#495057', marginBottom: '8px' }}>Loading Map...</h4>
        <p style={{ color: '#6c757d', fontSize: '14px' }}>Initializing Google Maps</p>
      </div>
    )
  }

  return (
    <div>
      <div
        ref={mapRef}
        style={{
          height: '500px',
          width: '100%',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
        }}
      />
      <div
        style={{
          marginTop: '12px',
          fontSize: '14px',
          color: '#6c757d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          Showing {drivers.filter((d) => d?.location?.coordinates).length} drivers with location
          data
        </span>
        <span style={{ fontSize: '12px' }}>{markers.current.length} markers on map</span>
      </div>
    </div>
  )
}

export default GoogleMapMarkers

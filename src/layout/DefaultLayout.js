import React, { Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { AppSidebar, AppHeader, AppFooter } from '../components/index'
import routes from '../routes'
import { Routes, Route } from 'react-router-dom'
import Loader from '../components/loader/Loader'
import { role } from '../utils/constants'
const DefaultLayout = () => {
  const [isAuthorized, setIsAuthorized] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setIsAuthorized(false)
      return
    }
    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token')
        setIsAuthorized(false)
        return
      }
      if (decoded?.role === role) {
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
      }
    } catch (error) {
      setIsAuthorized(false)
    }
  }, [])

  // useEffect(() => {
  //   if (isAuthorized === false) {
  //     navigate('/login', { replace: true })
  //   }
  // }, [isAuthorized, navigate])

  if (isAuthorized === null) {
    return <Loader />
  }
  if (isAuthorized === false) {
    navigate('/', { replace: true })
  }
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {routes.map((route, idx) => (
                <Route
                  key={idx}
                  path={route.path}
                  element={route.element ? React.createElement(route.element) : null}
                />
              ))}
            </Routes>
          </Suspense>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout

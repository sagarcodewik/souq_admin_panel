import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useColorModes } from '@coreui/react'
import Loader from './components/loader/Loader'
import './scss/style.scss'
import './scss/examples.scss'
import { Navigate } from 'react-router-dom'
// Lazy-loaded components
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const theme = useSelector((state) => state.ui.theme)
  // Theme setup
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const themeParam = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0]
    if (themeParam) {
      setColorMode(themeParam)
      return
    }
    localStorage.setItem('coreui-free-react-admin-template-theme', 'light')
    // if (!localTheme) {
    //   // force light mode at first load
    //   setColorMode('light')
    //   localStorage.setItem('coreui-free-react-admin-template-theme', 'light')
    // }
  }, [isColorModeSet, setColorMode])

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} /> ,
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/*" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

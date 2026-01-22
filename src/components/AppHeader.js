import React, { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilContrast, cilMenu, cilMoon, cilSun } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { set } from '../redux/slice/uiSlice'
import { useTranslation } from 'react-i18next'

const AppHeader = () => {
  const { t } = useTranslation('common')

  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)
  const location = useLocation()

  // Route path to title mapping
//   export const routeTitles = {
//   '/dashboard': 'Dashboard',

//   // Vendors
//   '/vendors/manage': 'Manage Vendors',
//   '/vendors/requests': 'Vendor Requests',

//   // Drivers
//   '/drivers/manage': 'Manage Drivers',
//   '/drivers/requests': 'Driver Requests',

//   // Orders
//   '/orders': 'Active Orders',
//   '/failed-orders': 'Failed Orders',

//   // Stores & Category
//   '/stores': 'Stores',
//   '/category': 'Category',

//   // Ads & Promotions
//   '/advertisements': 'Advertisements',
//   '/promotions': 'Promotions',

//   // Reviews
//   '/reviews': 'Reviews',

//   // Chats
//   '/customer-chats': 'Customer Chats',
//   '/driver-chats': 'Driver Chats',
//   '/vendor-chats': 'Vendor Chats',

//   // Pricing & Finance
//   '/driver-commission': 'Driver Commission',
//   '/add-on-pricing': 'Add-on Pricing',
//   '/promotion-pricing': 'Promotion Pricing',
//   '/finances': 'Finances',
//   '/driver-payments': 'Driver Payments',
// }
 const routeTitles = {
  '/dashboard': 'nav.dashboard',

  // Vendors
  '/vendors/manage': 'nav.manage_vendors',
  '/vendors/requests': 'nav.vendor_requests',

  // Drivers
  '/drivers/manage': 'nav.manage_drivers',
  '/drivers/requests': 'nav.driver_requests',

  // Orders
  '/orders': 'nav.active_orders',
  '/failed-orders': 'nav.failed_orders',

  // Stores & Category
  '/stores': 'nav.stores',
  '/category': 'nav.category',

  // Ads & Promotions
  '/advertisements': 'nav.advertisements',
  '/promotions': 'nav.promotions',

  // Reviews
  '/reviews': 'nav.reviews',

  // Chats
  '/customer-chats': 'nav.customer_chats',
  '/driver-chats': 'nav.driver_chats',
  '/vendor-chats': 'nav.vendor_chats',

  // Pricing & Finance
  '/driver-commission': 'nav.driver_commission',
  '/add-on-pricing': 'nav.add_on_pricing',
  '/promotion-pricing': 'nav.promotion_pricing',
  '/finances': 'nav.finances',
  '/driver-payments': 'nav.driver_payments',
}
  // Extract title based on current route
  const getPageTitle = (pathname, t) => {
    // exact match
    if (routeTitles[pathname]) {
      return t(routeTitles[pathname])
    }
   


  // nested routes support
  const matchedRoute = Object.keys(routeTitles).find((route) =>
    pathname.startsWith(route),
  )

  return matchedRoute ? t(routeTitles[matchedRoute]) : t('nav.dashboard')
}
 const pageTitle = getPageTitle(location.pathname, t)
  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer
        className="border-bottom px-4 d-flex align-items-center justify-content-between"
        fluid
      >
        <div className="d-flex align-items-center">
          <CHeaderToggler
            onClick={() => dispatch(set({ sidebarShow: !sidebarShow }))}
            style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <span className="ms-3 fw-bold fs-5">{pageTitle }</span>
        </div>

        <CHeaderNav className="ms-auto">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader

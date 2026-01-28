import React from 'react'
import CIcon from '@coreui/icons-react'
import {cilSpeedometer, cilTruck, cilCart, cilTags, cilStar, cilChatBubble, cilMoney, cilDollar, cilCheckCircle, cilPeople, cilBullhorn,} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const getNav = (t) => [
  {
    component: CNavItem,
    name: t('Dashboard'),
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Sub Admin',
    to: '/sub-admin',
    icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
    adminOnly: true,
  },

  {
    component: CNavGroup,
    name: t('Vendors'),
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {component: CNavItem, name: t('Manage Vendors'), to: '/vendors/manage',},
      {component: CNavItem, name: t('Vendor Requests'), to: '/vendors/requests',},
      {component: CNavItem, name: t('Approved Stores'), to: '/stores',},
    ],
  },

  {
    component: CNavGroup,
    name: t('Drivers'),
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    items: [
      {component: CNavItem, name: t('Manage Drivers'), to: '/drivers/manage',},
      {component: CNavItem, name: t('Driver Requests'), to: '/drivers/requests',},
    ],
  },

  {
    component: CNavGroup,
    name: t('Order'),
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {component: CNavItem, name: t('Active Order'), to: '/orders',},
      {component: CNavItem, name: t('Failed Order'), to: '/failed-orders',},
    ],
  },

  {
    component: CNavItem,
    name: t('Category'),
    to: '/category',
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: t('Marketing'),
    icon: <CIcon icon={cilBullhorn} customClassName="nav-icon" />,
    items: [
      {component: CNavItem, name: t('Advertisements'), to: '/advertisements',},
      {component: CNavItem, name: t('Promotions'), to: '/promotions',},
    ],
  },

  {
    component: CNavGroup,
    name: t('nav.chats'),
    icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
    permission: 'chats',
    items: [
      {component: CNavItem, name: t('nav.customer_chats'), to: '/customer-chats', permission: 'chats',},
      {component: CNavItem, name: t('nav.driver_chats'), to: '/driver-chats', permission: 'chats',},
      {component: CNavItem, name: t('nav.vendor_chats'), to: '/vendor-chats', permission: 'chats',},
    ],
  },

  {
    component: CNavItem,
    name: t('Reviews'),
    to: '/reviews',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: t('Finance'),
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    items: [
      {component: CNavItem, name: t('Driver Commission'), to: '/driver-commission',},
      {component: CNavItem, name: t('Driver Payment'), to: '/driver-payments',},
    ],
  },

  {
    component: CNavGroup,
    name: t('Pricing'),
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
    items: [
      {component: CNavItem, name: t('Add On Pricing'), to: '/add-on-pricing',},
      {component: CNavItem, name: t('Promotion Pricing'), to: '/promotion-pricing',},
    ],
  },
]

export default getNav
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilSpeedometer,
  cilTruck,
  cilBuilding,
  cilCart,
  cilFolderOpen,
  cilNewspaper,
  cilTags,
  cilStar,
  cilChatBubble,
  cilMoney,
  cilTag,
  cilDollar,
  cilWallet,
  cilCheckCircle,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Vendors',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Manage Vendors',
        to: '/vendors/manage',
      },
      {
        component: CNavItem,
        name: 'Vendor Requests',
        to: '/vendors/requests',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Drivers',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Manage Drivers',
        to: '/drivers/manage',
      },
      {
        component: CNavItem,
        name: 'Driver Requests',
        to: '/drivers/requests',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Active Orders',
    to: '/orders',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Failed Orders',
    to: '/failed-orders',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Stores',
    to: '/stores',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Category',
    to: '/category',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Advertisements',
    to: '/advertisements',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Promotions',
    to: '/promotions',
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reviews',
    to: '/reviews',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Chats',
    icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Customer Chats',
        to: '/customer-chats',
      },
      {
        component: CNavItem,
        name: 'Driver Chats',
        to: '/driver-chats',
      },
      // {
      //   component: CNavItem,
      //   name: 'Order Chats',
      //   to: '/order-chats',
      // },
      {
        component: CNavItem,
        name: 'Vendor Chats',
        to: '/vendor-chats',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Driver Commission',
    to: '/driver-commission',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Add On Pricing',
    to: '/add-on-pricing',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Promotion Pricing',
    to: '/promotion-pricing',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Finances',
    to: '/finances',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Driver Payments',
    to: '/driver-payments',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
]

export default _nav

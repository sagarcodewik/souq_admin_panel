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
  cilCheckCircle,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const  getNav  = (t) => [
  {
    component: CNavItem,
    name: t('nav.dashboard'),
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    permission: 'dashboard',
  },

  {
  component: CNavItem,
  name: 'Sub Admin',
  to: '/sub-admin',
  icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
  adminOnly: true, //  adminOnly intent
},

  {
    component: CNavGroup,
    name: t('nav.vendors'),
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    permission: 'vendors_view',
    items: [
      {
        component: CNavItem,
        name: t('nav.manage_vendors'),
        to: '/vendors/manage',
        permission: 'vendors_manage',
      },
      {
        component: CNavItem,
        name: t('nav.vendor_requests'),
        to: '/vendors/requests',
        permission: 'vendors_view',
      },
    ],
  },

  {
    component: CNavGroup,
    name: t('nav.drivers'),
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    permission: 'drivers_view',
    items: [
      {
        component: CNavItem,
        name: t('nav.manage_drivers'),
        to: '/drivers/manage',
        permission: 'drivers_manage',
      },
      {
        component: CNavItem,
        name: t('nav.driver_requests'),
        to: '/drivers/requests',
        permission: 'drivers_view',
      },
    ],
  },

  {
    component: CNavItem,
    name: t('nav.active_orders'),
    to: '/orders',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    permission: 'orders_view',
  },
  {
    component: CNavItem,
    name: t('nav.failed_orders'),
    to: '/failed-orders',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: t('nav.stores'),
    to: '/stores',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    permission: 'stores',
  },

  {
    component: CNavItem,
    name: t('nav.category'),
    to: '/category',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
    permission: 'category',
  },

  {
    component: CNavItem,
    name: t('nav.advertisements'),
    to: '/advertisements',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    permission: 'ads',
  },
  {
    component: CNavItem,
    name: t('nav.promotions'),
    to: '/promotions',
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
    permission: 'promotions',
  },

  {
    component: CNavItem,
    name: t('nav.reviews'),
    to: '/reviews',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    permission: 'reviews',
  },

  {
    component: CNavGroup,
    name: t('nav.chats'),
    icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
    permission: 'chats',
    items: [
      {
        component: CNavItem,
        name: t('nav.customer_chats'),
        to: '/customer-chats',
        permission: 'chats',
      },
      {
        component: CNavItem,
        name: t('nav.driver_chats'),
        to: '/driver-chats',
        permission: 'chats',
      },
      {
        component: CNavItem,
        name: t('nav.vendor_chats'),
        to: '/vendor-chats',
        permission: 'chats',
      },
    ],
  },

  {
    component: CNavItem,
    name: t('nav.driver_commission'),
    to: '/driver-commission',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
    permission: 'driver_commission',
  },

  {
    component: CNavItem,
    name: t('nav.add_on_pricing'),
    to: '/add-on-pricing',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
    permission: 'addon_pricing',
  },

  {
    component: CNavItem,
    name: t('nav.promotion_pricing'),
    to: '/promotion-pricing',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
    permission: 'promotion_pricing',
  },

  {
    component: CNavItem,
    name: t('nav.finances'),
    to: '/finances',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    permission: 'finances',
  },

  {
    component: CNavItem,
    name: t('nav.driver_payments'),
    to: '/driver-payments',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    permission: 'driver_payments',
  },
]

export default getNav

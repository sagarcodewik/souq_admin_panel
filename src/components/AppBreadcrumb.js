import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { useTranslation } from 'react-i18next'

import routes from '../routes'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const routeNameToKeyMap = {
    Dashboard: 'nav.dashboard',

    'Manage Drivers': 'nav.manage_drivers',
    'Driver Requests': 'nav.driver_requests',

    'Manage Vendors': 'nav.manage_vendors',
    'Vendor Requests': 'nav.vendor_requests',

    'Active Orders': 'nav.active_orders',
    'Failed Orders': 'nav.failed_orders',

    Stores: 'nav.stores',
    Category: 'nav.category',

    Advertisements: 'nav.advertisements',
    Promotions: 'nav.promotions',

    Reviews: 'nav.reviews',

    'Customer Chats': 'nav.customer_chats',
    'Driver Chats': 'nav.driver_chats',
    'Vendor Chats': 'nav.vendor_chats',

    'Driver Commission': 'nav.driver_commission',
    'Add On Pricing': 'nav.add_on_pricing',
    'Promotion Pricing': 'nav.promotion_pricing',

    Finances: 'nav.finances',
    'Driver Payments': 'nav.driver_payments',
  }
  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    if (!currentRoute) return false

    const translationKey = routeNameToKeyMap[currentRoute.name]
    return translationKey ? t(translationKey) : currentRoute.name
  }
  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)

      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length,
        })

      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          key={index}
          active={breadcrumb.active}
          {...(!breadcrumb.active && {
            style: { cursor: 'pointer' },
            onClick: () => navigate(breadcrumb.pathname),
          })}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)

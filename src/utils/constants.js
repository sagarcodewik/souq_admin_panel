export const ROLE = {
  CUSTOMER: 1,
  VENDOR: 2,
  DRIVER: 3,
  ADMIN: 10,
  CITY_MANAGER: 11,
  SUPPORT: 12,
  SUB_ADMIN: 13, // ✅ ADD THIS
}

export const PERMISSOINS = {
  MANAGE_PARAMETER: 'manage_parameter',
  MANAGE_JOB_RUN: 'manage_job_run',
  ACCESS_AUDIT_LOGS: 'access_audit_logs',
  MANGE_STAFF_USER: 'mange_staff_user',
  ACCESS_METRICS: 'access_metrics',
  MANAGE_ACCOUNT_DETAILS: 'manage_account_details',
}
export const ROLE_NAMES = {
  1: 'Customer',
  2: 'Vendor',
  3: 'Driver',
  10: 'Admin',
  11: 'City Manager',
  12: 'Support',
  13: 'Sub Admin',
}

export const POST_TYPE = {
  NEWS_FEED: 'news',
  STOCK_FEED: 'stock',
}

export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  COUNTY_CODE_PHONE: /^\+?[1-9]\d{0,2} ?\d{10}$/,
}

export const getAdminLandingRoute = (user) => {
  // SUPER ADMIN → always dashboard
  if (user.role === 10) {
    return '/dashboard'
  }

  // SUB ADMIN → first allowed screen
  if (user.role === 13 && Array.isArray(user.permissions)) {
    if (user.permissions.includes('vendors_manage')) return '/vendors/manage'
    if (user.permissions.includes('vendors_view')) return '/vendors/requests'
    if (user.permissions.includes('drivers_manage')) return '/drivers/manage'
    if (user.permissions.includes('drivers_view')) return '/drivers/requests'
    if (user.permissions.includes('orders_view')) return '/orders'
    if (user.permissions.includes('stores')) return '/stores'
    if (user.permissions.includes('category')) return '/category'
    if (user.permissions.includes('ads')) return '/advertisements'
    if (user.permissions.includes('promotions')) return '/promotions'
    if (user.permissions.includes('reviews')) return '/reviews'
    if (user.permissions.includes('chats')) return '/customer-chats'
  }

  // fallback
  return '/login'
}

export const formatPermissionLabel = (permission) => {
  return permission
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

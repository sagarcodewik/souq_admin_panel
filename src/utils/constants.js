export const role = 10
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
}

export const POST_TYPE = {
  NEWS_FEED: 'news',
  STOCK_FEED: 'stock',
}

export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  COUNTY_CODE_PHONE: /^\+?[1-9]\d{0,2} ?\d{10}$/,
}

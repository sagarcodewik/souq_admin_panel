import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Theme
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

// Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

// Charts
const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

// Widgets
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

// Optional error/fallback pages
// const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
//pages
const Vendor_request = React.lazy(() => import('./views/pages/vendor_request/Vendor_request'))
const Active_orders = React.lazy(() => import('./views/pages/active_orders/Active_orders'))
const Store = React.lazy(() => import('./views/pages/store/store'))
const VendorProduct = React.lazy(() => import('./views/pages/vendorProduct/VendorProduct'))
const Category = React.lazy(() => import('./views/pages/category/category'))
const Driver_request = React.lazy(() => import('./views/pages/driver_request/Driver_request'))
const Product_reviews = React.lazy(() => import('./views/pages/product_reviews/Product_reviews'))
const AdminAdvertisements = React.lazy(() => import('./views/pages/ads/Ads'))
const Manage_driver = React.lazy(() => import('./views/pages/manage_driver/Manage_driver'))
const Manage_vendor = React.lazy(() => import('./views/pages/manage_vendor/Manage_vendor'))
const Promotions = React.lazy(() => import('./views/pages/promotions/Promotions'))
const Reviews = React.lazy(() => import('./views/pages/reviews/reviews'))
const CustomerChats = React.lazy(() => import('./views/pages/CustomerChats/Chats'))
const DriverChats = React.lazy(() => import('./views/pages/DriverChats/Chats'))
const OrderChats = React.lazy(() => import('./views/pages/OrderChats/Chats'))
const VendorChats = React.lazy(() => import('./views/pages/VendorChats/Chats'))
const Manage_driver_commission = React.lazy(
  () => import('./views/pages/driver_Commission/DriverCommission'),
)
const Finances = React.lazy(() => import('./views/pages/finance/finance'))
const Failed_Orders = React.lazy(() => import('./views/pages/failed_orders/Failed_orders'))
const Add_on_pricing = React.lazy(() => import('./views/pages/add_on_pricing/Add_on_pricing'))
const PromotionPricing = React.lazy(() => import('./views/pages/promotionPricing/PromotionPricing'))
const DriverPaymentsApproval = React.lazy(() => import('./views/pages/paymentApproval/paymentApproval'))

// Route definitions
const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/vendors/requests', name: 'Vendor Requests', element: Vendor_request },
  { path: '/vendors/manage', name: 'Manage Vendors', element: Manage_vendor },
  { path: '/orders', name: 'Active Orders', element: Active_orders },
  { path: '/drivers/requests', name: 'Driver Requests', element: Driver_request },
  { path: '/drivers/manage', name: 'Manage Drivers', element: Manage_driver },
  { path: '/stores', name: 'Stores', element: Store },
  { path: '/stores/products', name: 'Vendor Products', element: VendorProduct },
  { path: '/category', name: 'Category', element: Category },
  {
    path: '/stores/products/reviews',
    name: 'Product Review',
    element: Product_reviews,
  },
  {
    path: '/advertisements',
    name: 'Advertisements',
    element: AdminAdvertisements,
  },
  {
    path: '/promotions',
    name: 'Promotions',
    element: Promotions,
  },
  {
    path: '/reviews',
    name: 'Reviews',
    element: Reviews,
  },
  {
    path: '/customer-chats',
    name: 'Customer Chats',
    element: CustomerChats,
  },
  {
    path: '/driver-chats',
    name: 'Driver Chats',
    element: DriverChats,
  },
  {
    path: '/order-chats',
    name: 'Order Chats',
    element: OrderChats,
  },
  {
    path: '/vendor-chats',
    name: 'Vendor Chats',
    element: VendorChats,
  },
  {
    path: '/driver-commission',
    name: 'Driver Commission',
    element: Manage_driver_commission,
  },
  {
    path: '/finances',
    name: 'Finances',
    element: Finances,
  },
  {
    path: '/failed-orders',
    name: 'Failed Orders',
    element: Failed_Orders,
  },
  {
    path: '/add-on-pricing',
    name: 'Add On Pricing',
    element: Add_on_pricing,
  },
  {
    path: '/promotion-pricing',
    name: 'Promotion Pricing',
    element: PromotionPricing,
  },
  {
    path: '/driver-payments',
    name: 'Driver Payments',
    element: DriverPaymentsApproval,
  },
  // Theme
  { path: '/theme', name: 'Theme', exact: true, element: Colors },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },

  // Base
  { path: '/base', name: 'Base', exact: true, element: Cards },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },

  // Buttons
  { path: '/buttons', name: 'Buttons', exact: true, element: Buttons },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },

  // Forms
  { path: '/forms', name: 'Forms', exact: true, element: FormControl },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },

  // Charts
  { path: '/charts', name: 'Charts', element: Charts },

  // Icons
  { path: '/icons', name: 'Icons', exact: true, element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },

  // Notifications
  { path: '/notifications', name: 'Notifications', exact: true, element: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },

  // Widgets
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes

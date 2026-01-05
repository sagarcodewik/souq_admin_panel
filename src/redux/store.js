// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slice/auth'
import vendorApprovalReducer from './slice/vendorApprovalSlice'
import uiReducer from './slice/uiSlice' // ← new
import activeOrderReducer from './slice/activeOrders' // ← legacy state converted to ui
import storeReducer from './slice/store'
import productReducer from './slice/product' // ← legacy state converted to ui
import categoryReducer from './slice/category'
import driverReducer from './slice/driverApprovelSlice'
import reviewReducer from './slice/review'
import advertisementReducer from './slice/advertisemnet'
import promotionsReducer from './slice/promotion'
import chatReducer from './slice/chats'
import dashboardReducer from './slice/dashboard' // ← new
import commissionReducer from './slice/driverCommission' // ← new
import financeReducer from './slice/finance'
import addonPricingReducer from './slice/addonPricing' // ← new
import promotionPricingReducer from './slice/promotionPricing' // ← new
import adminDriverPaymentsReducer from "./slice/paymentApproval";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    vendorApproval: vendorApprovalReducer,
    ui: uiReducer, // ← legacy state converted to ui
    activeOrders: activeOrderReducer, // ← legacy state converted to ui
    store: storeReducer,
    products: productReducer,
    categories: categoryReducer, // ← legacy state converted to ui
    drivers: driverReducer,
    review: reviewReducer,
    advertisements: advertisementReducer,
    promotions: promotionsReducer,
    chats: chatReducer,
    dashboard: dashboardReducer,
    driverCommission: commissionReducer,
    finance: financeReducer,
    addonPricing: addonPricingReducer, // ← new
    promotionPricing: promotionPricingReducer, // ← new
    adminDriverPayments: adminDriverPaymentsReducer,
  },
})

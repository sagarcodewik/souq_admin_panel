
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slice/auth'
import vendorApprovalReducer from './slice/vendorApprovalSlice'
import uiReducer from './slice/uiSlice'
import activeOrderReducer from './slice/activeOrders' 
import storeReducer from './slice/store'
import productReducer from './slice/product' 
import categoryReducer from './slice/category'
import driverReducer from './slice/driverApprovelSlice'
import reviewReducer from './slice/review'
import advertisementReducer from './slice/advertisemnet'
import promotionsReducer from './slice/promotion'
import chatReducer from './slice/chats'
import dashboardReducer from './slice/dashboard' 
import commissionReducer from './slice/driverCommission' 
import financeReducer from './slice/finance'
import addonPricingReducer from './slice/addonPricing' 
import promotionPricingReducer from './slice/promotionPricing' 
import adminDriverPaymentsReducer from "./slice/paymentApproval";
import languageReducer from './slice/languageSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    vendorApproval: vendorApprovalReducer,
    ui: uiReducer, 
    activeOrders: activeOrderReducer,
    store: storeReducer,
    products: productReducer,
    categories: categoryReducer,
    drivers: driverReducer,
    review: reviewReducer,
    advertisements: advertisementReducer,
    promotions: promotionsReducer,
    chats: chatReducer,
    dashboard: dashboardReducer,
    driverCommission: commissionReducer,
    finance: financeReducer,
    addonPricing: addonPricingReducer, 
    promotionPricing: promotionPricingReducer,
    adminDriverPayments: adminDriverPaymentsReducer,
    language: languageReducer,
  },
})

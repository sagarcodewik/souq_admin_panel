import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// English
import enVendors from '../locales/en/vendors.json'
import enVendorRequests from '../locales/en/vendorRequests.json'
import enActiveOrders from '../locales/en/activeOrders.json'
import enFailedOrders from '../locales/en/failedOrders.json'
import enStores from '../locales/en/stores.json'
import enCategories from '../locales/en/categories.json'
import enReviews from '../locales/en/reviews.json'
import enCommon from '../locales/en/common.json'
import enDrivers from '../locales/en/drivers.json'
import enDriverRequests from '../locales/en/driverRequests.json'
import enPromotions from '../locales/en/promotions.json'
import enDashboard from '../locales/en/dashboard.json'
import enDriverCommission from '../locales/en/driverCommission.json'
import enAddonPricing from '../locales/en/addonPricing.json'
import enPromotionPricing from '../locales/en/promotionPricing.json'
import enFinances from '../locales/en/finances.json'
import enDriverPayments from "../locales/en/driverPayments.json";
import enCustomerChats from '../locales/en/customerChats.json'
import enDriverChats from '../locales/en/driverChats.json'
import enChatBox from '../locales/en/chatBox.json'
import enVendorChats from '../locales/en/vendorChats.json'
import enAdvertisements from '../locales/en/advertisements.json'


// Arabic
import arVendors from '../locales/ar/vendors.json'
import arVendorRequests from '../locales/ar/vendorRequests.json'
import arActiveOrders from '../locales/ar/activeOrders.json'
import arFailedOrders from '../locales/ar/failedOrders.json'
import arStores from '../locales/ar/stores.json'
import arCategories from '../locales/ar/categories.json'
import arReviews from '../locales/ar/reviews.json'
import arCommon from '../locales/ar/common.json'
import arDrivers from '../locales/ar/drivers.json'
import arDriverRequests from '../locales/ar/driverRequests.json'
import arPromotions from '../locales/ar/promotions.json'
import arDashboard from '../locales/ar/dashboard.json'
import arDriverCommission from '../locales/ar/driverCommission.json'
import arAddonPricing from '../locales/ar/addonPricing.json'
import arPromotionPricing from '../locales/ar/promotionPricing.json'
import arFinances from '../locales/ar/finances.json'
import arDriverPayments from "../locales/ar/driverPayments.json";
import arCustomerChats from '../locales/ar/customerChats.json'
import arDriverChats from '../locales/ar/driverChats.json'
import arChatBox from '../locales/ar/chatBox.json'
import arVendorChats from '../locales/ar/vendorChats.json'
import arAdvertisements from '../locales/ar/advertisements.json'

const savedLang = localStorage.getItem('lang') || 'en'
document.body.dir = savedLang === 'ar' ? 'rtl' : 'ltr'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      vendors: enVendors,
      vendorRequests: enVendorRequests,
      activeOrders: enActiveOrders,
      failedOrders: enFailedOrders,
      stores: enStores,
      categories: enCategories,
      reviews: enReviews,
      drivers: enDrivers,
      driverRequests: enDriverRequests,
      promotions: enPromotions,
      dashboard: enDashboard,
      driverCommission: enDriverCommission,
      addonPricing: enAddonPricing,
      promotionPricing: enPromotionPricing,
      finances: enFinances,
      chatBox: enChatBox,
      driverPayments: enDriverPayments,
      customerChats: enCustomerChats,
      driverChats: enDriverChats,
      vendorChats: enVendorChats,
      advertisements: enAdvertisements
    },
    ar: {
      common: arCommon,
      vendors: arVendors,
      vendorRequests: arVendorRequests,
      activeOrders: arActiveOrders,
      failedOrders: arFailedOrders,
      stores: arStores,
      categories: arCategories,
      reviews: arReviews,
      drivers: arDrivers,
      driverRequests: arDriverRequests,
      promotions: arPromotions,
      dashboard: arDashboard,
      driverCommission: arDriverCommission,
      addonPricing: arAddonPricing,
      promotionPricing: arPromotionPricing,
      finances: arFinances,
      chatBox: arChatBox,
      driverPayments: arDriverPayments,
      customerChats: arCustomerChats,
      driverChats: arDriverChats,
      vendorChats: arVendorChats,
      advertisements: arAdvertisements

    },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

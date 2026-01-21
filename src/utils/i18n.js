import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// English
import enVendors from '../locales/en/vendors.json'
import enVendorRequests from '../locales/en/vendorRequests.json'
import enActiveOrders from '../locales/en/activeOrders.json'
import enFailedOrders from '../locales/en/failedOrders.json'
import enStores from '../locales/en/stores.json'
import enCategories from '../locales/en/categories.json'

// Arabic
import arVendors from '../locales/ar/vendors.json'
import arVendorRequests from '../locales/ar/vendorRequests.json'
import arActiveOrders from '../locales/ar/activeOrders.json'
import arFailedOrders from '../locales/ar/failedOrders.json'
import arStores from '../locales/ar/stores.json'
import arCategories from '../locales/ar/categories.json'


const savedLang = localStorage.getItem('lang') || 'en'
document.body.dir = savedLang === 'ar' ? 'rtl' : 'ltr'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      vendors: enVendors,
      vendorRequests: enVendorRequests,
      activeOrders: enActiveOrders,
      failedOrders: enFailedOrders,
      stores: enStores,
      categories: enCategories,
    },
    ar: {
      vendors: arVendors,
      vendorRequests: arVendorRequests,
      activeOrders: arActiveOrders,
      failedOrders: arFailedOrders,
      stores: arStores,
      categories: arCategories,
    },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

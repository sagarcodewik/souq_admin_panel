import React, { useState } from 'react'
import { CButton, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCheck,
  cilCheckCircle,
  cilX,
  cilTruck,
  cilArrowRight,
  cilHome,
  cilLocationPin,
} from '@coreui/icons'
import Loader from './loader/Loader.js'
import styles from './orderCard.module.scss'
import ProductModal from './ProductModal.js'
import DriverDetailsModal from './DriverDetailsModal.js'
import { useTranslation } from 'react-i18next'

const OrderCard = ({ order, loading, onStatusChange, type }) => {
    const { t } = useTranslation('Orders')

  const {
    _id,
    customerId,
    vendor,
    productId,
    quantity,
    subTotal,
    shippingFee,
    items = [],
    grandTotal,
    deliveryAddress,
    status,
    paymentStatus,
    createdAt,
  } = order
  const [driverVisible, setDriverVisible] = useState(false)
  const [productModalVisible, setProductModalVisible] = useState(false)
  const StatusBadge = ({ status }) => {
    const statusMap = {
      pending: { class: 'bg-warning text-dark', label: 'Pending' },
      confirmed: { class: 'bg-info text-white', label: 'Confirmed' },
      cancelled: { class: 'bg-danger text-white', label: 'Cancelled' },
      'driver-accepted': { class: 'bg-primary text-white', label: 'Driver Accepted' },
      returned: { class: 'bg-secondary text-white', label: 'Returned' },
      Ready: { class: 'bg-primary text-white', label: 'Ready' },
      ready: { class: 'bg-primary text-white', label: 'Ready' },
      shipped: { class: 'bg-primary text-white', label: 'Shipped' },
      'in-transit': { class: 'bg-primary text-white', label: 'In Transit' },
      delivered: { class: 'bg-success text-white', label: 'Delivered' },
    }

    const { class: badgeClass = 'bg-light text-dark', label = status } = statusMap[status] || {}

    return <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeClass}`}>{label}</span>
  }

  const PaymentBadge = ({ status }) => {
    const paymentMap = {
      paid: 'bg-success text-white',
      unpaid: 'bg-danger text-white',
      pending: 'bg-warning text-dark',
    }

    const badgeClass = `px-2 py-1 rounded text-xs font-semibold ${
      paymentMap[status] || 'bg-light text-dark'
    }`

    return <span className={badgeClass}>{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>
  }
  const firstProduct = items[0]
  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <h4> {order.orderNumber}</h4>
        <p> {new Date(createdAt).toLocaleString()}</p>
      </div>
      <div className={styles.orderBody}>
       <p>{t('labels.customer')}: {customerId?.email || '—'}</p>
       <p>{t('labels.vendor')}: {vendor?.email || '—'}</p>
        <div className={styles.locationSection}>
          <div className="px-3 py-2 bg-light border-bottom">
            <h6 className="mb-2 text-primary">
              <CIcon icon={cilTruck} className="me-2" />
             {t('labels.delivery_route')}
            </h6>
          </div>

          <div className="px-3 py-3">
            {/* Pickup Location */}
            <div className="d-flex align-items-start mb-3">
              <div>
                <div className={`${styles.locationIcon} ${styles.pickupIcon}`}>
                  <CIcon icon={cilLocationPin} className="text-white" size="l" />
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-1">
                  <strong className="text-primary me-2">{t('labels.pickup')}</strong>
                  <CBadge color="primary" variant="outline" className="text-xs">
                   {t('labels.from')}
                  </CBadge>
                </div>
                <p className="text-muted mb-1 small">
                  <>
                    {order.pickupStreet}, {order.pickupCity}, {order.pickupState},{' '}
                    {order.pickupCountry}
                  </>
                </p>
              </div>
            </div>

            {/* Route Connector */}
            <div className="d-flex align-items-center mb-3 ms-3">
              <div
                className="border-start border-2 border-primary"
                style={{ height: '30px', width: '2px' }}
              ></div>
              {/* <div className="ms-3">
                <CIcon icon={cilArrowRight} className="text-primary" />
                <small className="text-muted ms-2">
                  Estimated: {order.type === '1' ? '15 mins' : '2-3 hours'}
                </small>
              </div> */}
            </div>

            {/* Drop Location */}
            <div className="d-flex align-items-start">
              <div>
                <div className={`${styles.locationIcon} ${styles.dropIcon}`}>
                  <CIcon icon={cilHome} className="text-white" size="sm" />
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-1">
                  <strong className="text-success me-2">{t('labels.delivery_address')}</strong>
                  <CBadge color="success" variant="outline" className="text-xs">
                    {t('labels.to')}
                  </CBadge>
                </div>
                <p className="text-muted mb-1 small">
                  {order.dropStreet}, {order.dropCity}, {order.dropState}, {order.dropCountry}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-3 py-2 bg-light border-bottom mb-1">
          <h6 className="mb-2 text-primary">📦 {t('labels.order_details')}</h6>
        </div>

        {/* Inline Product Section */}
        <div className={styles.productSection}>
          {firstProduct && (
            <div className={styles.productDetails}>
              <div className={styles.productInfo}>
                <p>{firstProduct.productId.productName || '—'}</p>
              </div>
              <div className={styles.quantity}>
                <p>{firstProduct.quantity}x</p>
              </div>
            </div>
          )}

          {/* Show More button */}
          {items.length > 1 && (
            <CButton
              size="sm"
              color="secondary"
              variant="outline"
              className="mt-2"
              onClick={() => setProductModalVisible(true)}
            >
              +{items.length - 1} {t('labels.more_items')}
            </CButton>
          )}
        </div>

        <div className={styles.orderDetails}>
          <div className={styles.detailBlock}>
            {subTotal !== undefined && 
            <p>{t('labels.subtotal')}: {subTotal} {t('labels.currency')}</p>
            }
            <span className={styles.detailBadge}>
              {
              order.type === '1'
                ? t('filter.quick')
                : order.type === '2'
                  ? t('filter.marketplace')
                  : t('filter.all')
                  }
            </span>
          </div>

          <div className={styles.detailBlock}>
            {shippingFee !== undefined && 
           <p>{t('labels.shipping_fee')}: {shippingFee} {t('labels.currency')}</p>
            }
            <StatusBadge status={order.Status} />
          </div>

          <div className={styles.detailBlock}>
            <p>{t('labels.grand_total')}: {grandTotal} {t('labels.currency')}</p>
            {paymentStatus && <PaymentBadge status={paymentStatus} />}
          </div>
        </div>
        <div className={styles.actions}>
          {order.driver && (
            <CButton
              size="sm"
              color="info"
              variant="outline"
              className={styles.chatButton}
              onClick={() => setDriverVisible(true)}
            >
              View Driver
            </CButton>
          )}
        </div>
        {/* <p>City: {deliveryAddress?.city || '—'}</p> */}
      </div>
      <DriverDetailsModal
        visible={driverVisible}
        setVisible={setDriverVisible}
        driver={order.driver}
      />
      <ProductModal
        visible={productModalVisible}
        setVisible={setProductModalVisible}
        products={items}
        orderNumber={order.orderNumber}
      />
    </div>
  )
}

export default OrderCard

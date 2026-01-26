
import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSearch } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAddonPricing, updateAddonPricing } from '../../../redux/slice/addonPricing'
import DataTable from '../../../components/datatable/datatable'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import style from './add_on_pricing.module.scss'
import { useTranslation } from 'react-i18next'

// const addonSchema = Yup.object().shape({
//   price: Yup.number()
//     .typeError('Price must be a number')
//     .required('Price is required')
//     .min(0, 'Price cannot be negative'),
//   days: Yup.number()
//     .nullable()
//     .min(0, 'Days cannot be negative')
//     .typeError('Days must be a number'),
// })
const addonSchema = (t) =>
  Yup.object().shape({
    price: Yup.number()
      .typeError(t('validation.price_number'))
      .required(t('validation.price_required'))
      .min(0, t('validation.price_min')),

    days: Yup.number()
      .nullable()
      .typeError(t('validation.days_number'))
      .min(0, t('validation.days_min')),
  })


const formatPricingType = (value) => {
  if (!value) return '-'
  return value
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const Add_on_pricing = () => {
  const { t } = useTranslation('addonPricing')

  const dispatch = useDispatch()
  const { addonPricing, status } = useSelector((state) => state.addonPricing)

  const [searchText, setSearchText] = useState('')
  const [visibleModal, setVisibleModal] = useState(false)
  const [editItem, setEditItem] = useState(null)

  useEffect(() => {
    dispatch(fetchAddonPricing())
  }, [dispatch])

  const handleEdit = (addon) => {
    setEditItem(addon)
    setVisibleModal(true)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateAddonPricing(values)).unwrap()
      setVisibleModal(false)
      setEditItem(null)
      dispatch(fetchAddonPricing()) 
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  // const headers = [
  //   { key: 'addonName', label: 'Addon', sortable: true },
  //   { key: 'price', label: 'Price', sortable: true },
  //   {
  //     key: 'days',
  //     label: 'Days',
  //     sortable: true,
  //     render: (row) => (row.days !== null && row.days !== undefined ? row.days : '-'),
  //   },
  //   {
  //     key: 'pricingType',
  //     label: 'Pricing Type',
  //     sortable: true,
  //     render: (row) => formatPricingType(row.pricingType),
  //   },
  //   {
  //     key: 'actions',
  //     label: 'Actions',
  //     render: (row) => (
  //       <CButton size="sm" color="info" onClick={() => handleEdit(row)}>
  //         <CIcon icon={cilPencil} /> Edit
  //       </CButton>
  //     ),
  //   },
  // ]
  const headers = [
  { key: 'addonName', label: t('table.addon'), sortable: true },
  { key: 'price', label: t('table.price'), sortable: true },
  {
    key: 'days',
    label: t('table.days'),
    sortable: true,
    render: (row) => (row.days ?? '-'),
  },
  {
    key: 'pricingType',
    label: t('table.pricingType'),
    sortable: true,
    render: (row) => formatPricingType(row.pricingType, t),
  },
  {
    key: 'actions',
    label: t('table.actions'),
    render: (row) => (
      <CButton size="sm" color="info" onClick={() => handleEdit(row)}>
        <CIcon icon={cilPencil} /> {t('buttons.edit')}
      </CButton>
    ),
  },
]


  const filteredData = addonPricing.filter((a) =>
    a.addonName.toLowerCase().includes(searchText.toLowerCase()),
  )

  const noDaysAddons = ['Extra Photo Pack', 'Premium Badge', 'Push Notification']
  const noPricingTypeAddons = ['Featured Ad', 'Search Boost', 'Extend Ad Life']

  return (
    <div className={style.add_on_pricing}>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">{t('title')}</h5>
          <div className="input-group" style={{ width: '300px' }}>
            <span className="input-group-text bg-white">
              <CIcon icon={cilSearch} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder={t('search')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </CCardHeader>

        <CCardBody>
          <DataTable
            data={filteredData}
            headers={headers}
            totalRecords={filteredData.length}
            currentPage={1}
            pageSize={10}
            onPageChange={() => {}}
            isLoading={status === 'loading'}
          />
        </CCardBody>
      </CCard>

      {/* Update Modal */}
      <CModal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <CModalHeader closeButton>  {t('modal.title')}</CModalHeader>
        {editItem && (
          <Formik
            initialValues={{
              addonName: editItem.addonName,
              price: editItem.price,
              days: editItem.days ?? '',
              pricingType: editItem.pricingType ?? '',
            }}
            validationSchema={addonSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <CModalBody>
                  <div className="mb-3">
                    <label className="form-label">{t('form.addon')}</label>
                    <input
                      type="text"
                      value={editItem.addonName}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">{t('form.price')}</label>
                    <Field
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                    />
                    <ErrorMessage name="price" component="div" className="text-danger small mt-1" />
                  </div>

                  {/* Days editable only if not in restricted addons */}
                  {!noDaysAddons.includes(editItem.addonName) && (
                    <div className="mb-3">
                      <label className="form-label">{t('form.days')}</label>
                      <Field name="days" type="number" min="0" className="form-control" />
                      <ErrorMessage
                        name="days"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>
                  )}

                  {/* Pricing Type: shown only if not in noPricingTypeAddons */}
                  {!noPricingTypeAddons.includes(editItem.addonName) && (
                    <div className="mb-3">
                      <label className="form-label">{t('form.pricingType')}</label>
                      <input
                        type="text"
                        value={formatPricingType(editItem.pricingType)}
                        className="form-control"
                        disabled
                      />
                    </div>
                  )}
                </CModalBody>

                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisibleModal(false)}>
                  {t('buttons.cancel')}
                  </CButton>
                  <CButton type="submit" color="primary" disabled={isSubmitting}>
                   {isSubmitting ? t('buttons.updating') : t('buttons.update')}
                  </CButton>
                </CModalFooter>
              </Form>
            )}
          </Formik>
        )}
      </CModal>
    </div>
  )
}

export default Add_on_pricing

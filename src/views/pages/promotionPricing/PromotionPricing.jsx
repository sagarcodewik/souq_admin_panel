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
import {
  fetchPromotionPricing,
  updatePromotionPricing,
} from '../../../redux/slice/promotionPricing'
import DataTable from '../../../components/datatable/datatable'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

// ✅ Yup schema
const promotionSchema = Yup.object().shape({
  price: Yup.number()
    .typeError('Price must be a number')
    .required('Price is required')
    .min(0, 'Price cannot be negative'),
  pricingType: Yup.string().nullable(),
})

const formatPricingType = (value) => {
  if (!value) return '-'
  return value
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const PromotionPricing = () => {
  const dispatch = useDispatch()
  const { promotionPricing, status } = useSelector((state) => state.promotionPricing)

  const [searchText, setSearchText] = useState('')
  const [visibleModal, setVisibleModal] = useState(false)
  const [editItem, setEditItem] = useState(null)

  useEffect(() => {
    dispatch(fetchPromotionPricing())
  }, [dispatch])

  const handleEdit = (promotion) => {
    setEditItem(promotion)
    setVisibleModal(true)
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updatePromotionPricing(values)).unwrap()
      setVisibleModal(false)
      setEditItem(null)
      dispatch(fetchPromotionPricing()) // refresh list
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }
  const formatPromotionType = (value) => {
    if (!value) return '-'
    return value
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  const headers = [
    {
      key: 'type',
      label: 'Promotion Type',
      sortable: true,
      render: (row) => formatPromotionType(row.type),
    },
    { key: 'price', label: 'Price (SYP)', sortable: true },
    {
      key: 'pricingType',
      label: 'Pricing Type',
      sortable: true,
      render: (row) => formatPricingType(row.pricingType),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <CButton size="sm" color="info" onClick={() => handleEdit(row)}>
          <CIcon icon={cilPencil} /> Edit
        </CButton>
      ),
    },
  ]

  const filteredData = promotionPricing.filter((p) =>
    (p?.type ?? '').toLowerCase().includes(searchText.toLowerCase()),
  )

  const noPricingTypePromotions = ['flash-sale'] // example: flash-sale might not use pricingType

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">Promotion Pricing</h5>
          <div className="input-group" style={{ width: '300px' }}>
            <span className="input-group-text bg-white">
              <CIcon icon={cilSearch} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search promotion..."
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
        <CModalHeader closeButton>Update Promotion Pricing</CModalHeader>
        {editItem && (
          <Formik
            initialValues={{
              type: editItem.type,
              price: editItem.price,
              pricingType: editItem.pricingType ?? '',
            }}
            validationSchema={promotionSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <CModalBody>
                  <div className="mb-3">
                    <label className="form-label">Promotion Type</label>
                    <input type="text" value={editItem.type} className="form-control" disabled />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <Field
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                    />
                    <ErrorMessage name="price" component="div" className="text-danger small mt-1" />
                  </div>

                  {/* PricingType: shown only if allowed */}
                  {!noPricingTypePromotions.includes(editItem.type) && (
                    <div className="mb-3">
                      <label className="form-label">Pricing Type</label>
                      <Field as="select" name="pricingType" className="form-select">
                        <option value="">Select Pricing Type</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="one-time">One Time</option>
                        <option value="lifetime">Lifetime</option>
                        <option value="per-use">Per Use</option>
                        <option value="daily">Daily</option>
                        <option value="hourly">Hourly</option>
                        <option value="free">Free</option>
                      </Field>
                      <ErrorMessage
                        name="pricingType"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>
                  )}
                </CModalBody>

                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisibleModal(false)}>
                    Cancel
                  </CButton>
                  <CButton type="submit" color="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update'}
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

export default PromotionPricing

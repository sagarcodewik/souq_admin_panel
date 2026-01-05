// import { render } from '@testing-library/react'
import { FiEye } from 'react-icons/fi'
import {
  cilPencil,
  cilTrash,
  cilEyedropper,
  cilCheck,
  cilX,
  cilCheckCircle,
  cilCommentSquare,
} from '@coreui/icons'
import { CTooltip } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { setSelectedVendorId } from '../redux/slice/store'
import { CButton } from '@coreui/react'
import { updatePromotionStatus, fetchPromotions } from '../redux/slice/promotion'
import {
  FaEye,
  FaUserSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaTrashRestore,
  FaToggleOn,
  FaToggleOff,
} from 'react-icons/fa'
const fallback = (value) => (value !== null && value !== undefined ? value : '-')
// eslint-disable-next-line react-hooks/rules-of-hooks
export const ActiveOrdersheaders = (handleViewOrder) => [
  { key: '_id', label: 'Order ID', sortable: true, render: (row) => fallback(row._id) },
  {
    key: 'customerId',
    label: 'Customer Email',
    sortable: false,
    render: (row) => fallback(row.customerId?.email),
  },
  {
    key: 'vendorEmail',
    label: 'Vendor Email',
    sortable: true,
    render: (row) => fallback(row.vendorEmail),
  },
  {
    key: 'productId',
    label: 'Product Name',
    sortable: false,
    render: (row) => fallback(row.productId?.productName),
  },
  {
    key: 'quantity',
    label: 'Quantity',
    sortable: true,
    render: (row) => fallback(row.quantity),
  },
  {
    key: 'subTotal',
    label: 'Subtotal (SYP)',
    sortable: true,
    render: (row) => fallback(row.subTotal),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <button
        className="btn btn-sm btn-outline-primary"
        onClick={() => handleViewOrder(row)}
        title="View Details" // Tooltip on hover
      >
        <FiEye size={16} />
      </button>
    ),
  },
]

// utils/header.js

export const VendorHeaders = (navigate, dispatch) => [
  {
    key: 'userId',
    label: 'Email',
    render: (row) => {
      const email = fallback(row.userId?.email)
      const id = row.userId?._id
      return id ? (
        <button
          onClick={() => {
            dispatch(setSelectedVendorId(id))
            navigate(`/stores/products`)
          }}
          style={{
            textDecoration: 'none',
            color: '#103033',
            fontWeight: 700,
            border: 'none',
            background: 'none',
          }}
        >
          {email}
        </button>
      ) : (
        email
      )
    },
  },
  {
    key: 'businessName',
    label: 'Business Name',
    render: (row) => fallback(row.businessName),
  },
  {
    key: 'ownerName',
    label: 'Name',
    render: (row) => fallback(row.ownerName),
  },
  {
    key: 'businessPhone',
    label: 'Phone',
    render: (row) => fallback(row.businessPhone),
  },
  {
    key: 'createdAt',
    label: 'Registered On',
    format: 'date',
  },
]

export const ProductHeaders = [
  {
    key: 'productName',
    label: 'Product Name',
    render: (row) => fallback(row.productName),
  },
  {
    key: 'discountedprice',
    label: 'Discounted Price (SYP)',
    render: (row) => fallback(row.discountedprice),
  },
  {
    key: 'stockQuantity',
    label: 'Stock',
    render: (row) => fallback(row.stockQuantity),
  },
  {
    key: 'subCategory',
    label: 'Sub Category',
    render: (row) => fallback(row.subCategory),
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true,
    render: (row) => fallback(row?.category?.category),
  },
  // {
  //   key: 'actions',
  //   label: 'Actions',
  //   render: (item, handleReview) => (
  //     <div className="d-flex align-items-center justify-content-center">
  //       <CTooltip content="Review" placement="top">
  //         <button className="btn btn-sm btn-outline-info" onClick={() => handleReview(item._id)}>
  //           <CIcon icon={cilCommentSquare} size="sm" />
  //         </button>
  //       </CTooltip>
  //     </div>
  //   ),
  // },
]
export const AllVendorHeaders = (
  navigate,
  dispatch,
  setSelectedVendor,
  setVisible,
  onToggleDelete,
  onToggleStatus,
) => [
  {
    key: 'userId',
    label: 'Email',
    render: (row) => fallback(row.user?.email),
  },
  {
    key: 'businessName',
    label: 'Business Name',
    render: (row) => fallback(row.businessName),
  },
  {
    key: 'ownerName',
    label: 'Name',
    render: (row) => fallback(row.ownerName),
  },
  {
    key: 'businessPhone',
    label: 'Phone',
    render: (row) => fallback(row.businessPhone),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => fallback(row.status),
  },
  {
    key: 'deleted',
    label: 'Deleted',
    render: (row) => (row.user?.deleted ? 'Yes' : 'No'),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <div className="d-flex gap-2">
        <CTooltip content="View Vendor Details" placement="top">
          <CButton
            color="info"
            size="sm"
            onClick={() => {
              setSelectedVendor(row)
              setVisible(true)
            }}
          >
            <FaEye />
          </CButton>
        </CTooltip>

        <CTooltip
          content={row.user?.deleted ? 'Activate Vendor' : 'Deactivate Vendor'}
          placement="top"
        >
          <CButton
            color={row.user?.deleted ? 'success' : 'danger'}
            size="sm"
            onClick={() => onToggleDelete(row)}
          >
            <FaUserSlash />
          </CButton>
        </CTooltip>

        <CTooltip
          content={row.status === 'Approved' ? 'Reject Vendor' : 'Approve Vendor'}
          placement="top"
        >
          <CButton
            color={row.status === 'Approved' ? 'warning' : 'success'}
            size="sm"
            onClick={() => onToggleStatus(row)}
          >
            {row.status === 'Approved' ? <FaTimesCircle /> : <FaCheckCircle />}
          </CButton>
        </CTooltip>
      </div>
    ),
  },
]

export const AllDriverHeaders = (
  navigate,
  dispatch,
  setSelectedVendor,
  setVisible,
  onToggleDelete,
  onToggleStatus,
) => [
  {
    key: 'userId',
    label: 'Email',
    render: (row) => fallback(row.user?.email),
  },
  {
    key: 'FullName',
    label: 'Name',
    render: (row) => fallback(row.FullName),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => fallback(row.status),
  },
  {
    key: 'deleted',
    label: 'Deleted',
    render: (row) => (row.user?.deleted ? 'Yes' : 'No'),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <div className="d-flex gap-2">
        <CTooltip content="View Driver Details" placement="top">
          <CButton
            color="info"
            size="sm"
            onClick={() => {
              setSelectedVendor(row)
              setVisible(true)
            }}
          >
            <FaEye />
          </CButton>
        </CTooltip>

        <CTooltip
          content={row.user?.deleted ? 'Activate Driver' : 'Deactivate Driver'}
          placement="top"
        >
          <CButton
            color={row.user?.deleted ? 'success' : 'danger'}
            size="sm"
            onClick={() => onToggleDelete(row)}
          >
            <FaUserSlash />
          </CButton>
        </CTooltip>

        <CTooltip
          content={row.status === 'Approved' ? 'Reject Driver' : 'Approve Driver'}
          placement="top"
        >
          <CButton
            color={row.status === 'Approved' ? 'warning' : 'success'}
            size="sm"
            onClick={() => onToggleStatus(row)}
          >
            {row.status === 'Approved' ? <FaTimesCircle /> : <FaCheckCircle />}
          </CButton>
        </CTooltip>
      </div>
    ),
  },
]

export const PromotionHeaders = (handleView, handleStatusChange) => [
  {
    key: 'title',
    label: 'Title',
    sortable: true,
    render: (row) => fallback(row.title),
  },
  {
    key: 'description',
    label: 'Description',
    sortable: true,
    render: (row) => fallback(row.description),
  },
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    render: (row) => fallback(row.type?.toUpperCase()),
  },
  {
    key: 'promotionCode',
    label: 'Promotion Code',
    sortable: true,
    render: (row) => fallback(row.promotionCode),
  },
  {
    key: 'isDeleted',
    label: 'Deleted',
    sortable: true,
    render: (row) => (row.isDeleted ? 'Yes' : 'No'),
  },
  {
    key: 'isActive',
    label: 'Active',
    sortable: true,
    render: (row) => (row.isActive ? 'Yes' : 'No'),
  },
  {
    key: 'startDate',
    label: 'Start Date',
    sortable: true,
    format: 'date',
  },
  {
    key: 'endDate',
    label: 'End Date',
    sortable: true,
    format: 'date',
  },
  {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    format: 'date',
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <>
        <CTooltip content="View Details">
          <CButton
            onClick={() => handleView(row)}
            size="sm"
            variant="outline"
            color="info"
            className="me-2"
          >
            <FaEye />
          </CButton>
        </CTooltip>

        <CTooltip content={row.isDeleted ? 'Restore Promotion' : 'Delete Promotion'}>
          <CButton
            onClick={() => handleStatusChange({ id: row._id, isDeleted: !row.isDeleted })}
            size="sm"
            variant="outline"
            color={row.isDeleted ? 'success' : 'danger'}
            className="me-2"
          >
            {row.isDeleted ? <FaTrashRestore /> : <FaTrash />}
          </CButton>
        </CTooltip>

        <CTooltip content={row.isActive ? 'Deactivate Promotion' : 'Activate Promotion'}>
          <CButton
            onClick={() => handleStatusChange({ id: row._id, isActive: !row.isActive })}
            size="sm"
            variant="outline"
            color="secondary"
          >
            {row.isActive ? <FaToggleOn /> : <FaToggleOff />}
          </CButton>
        </CTooltip>
      </>
    ),
  },
]

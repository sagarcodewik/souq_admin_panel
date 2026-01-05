import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Store,
  UserCheck,
  UserPlus,
  Activity,
  BarChart3,
  Eye,
} from 'lucide-react'
import Loader from '../../components/loader/Loader'
import { fetchAdminDashboard, fetchAdminSalesLineGraph } from '../../redux/slice/dashboard'
import { useSelector, useDispatch } from 'react-redux'
import styles from './dashboard.module.scss'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'
import CIcon from '@coreui/icons-react'
import { cilLayers } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const EcommerceDashboard = () => {
  const dispatch = useDispatch()
  const [selectedRange, setSelectedRange] = useState(30)
  const navigate = useNavigate()
  const KPICard = ({
    title,
    value,
    icon: Icon,
    change,
    changeType,
    gradientClass,
    delay = 0,
    to,
  }) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }, [delay])

    return (
      <div
        onClick={() => to && navigate(to)}
        className={`${styles.kpiCardAnimate} ${isVisible ? styles.visible : ''}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className={`card h-100 shadow-sm border-0 ${styles.kpiCard}`}>
          <div className={`${styles.kpiGradientBar} ${styles[gradientClass]}`}></div>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className={`${styles.kpiIcon} ${styles[gradientClass]}`}>
                <Icon size={28} className="text-white" />
              </div>
              <div
                className={`d-flex align-items-center text-sm fw-semibold ${
                  changeType === 'positive'
                    ? styles.textSuccess
                    : changeType === 'negative'
                      ? styles.textDanger
                      : styles.textMuted
                }`}
              >
                {changeType === 'positive' ? (
                  <TrendingUp size={16} className={styles.me1} />
                ) : changeType === 'negative' ? (
                  <TrendingDown size={16} className={styles.me1} />
                ) : null}
                <small>{change}</small>
              </div>
            </div>
            <div className={`${styles.display6} fw-bold ${styles.textDark} ${styles.mb1}`}>
              {typeof value === 'number' && value > 1000
                ? `$${(value / 1000).toFixed(1)}k`
                : typeof value === 'number'
                  ? value.toLocaleString()
                  : value}
            </div>
            <div className={`${styles.textMuted} fw-medium`}>{title}</div>
          </div>
        </div>
      </div>
    )
  }

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      delivered: styles.badgeDelivered,
      processing: styles.badgeProcessing,
      pending: styles.badgePending,
      cancelled: styles.badgeCancelled,
    }

    return (
      <span
        className={`${styles.statusBadge} ${statusConfig[status] || 'bg-secondary-subtle text-secondary'}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const ProgressBar = ({ percentage, colorClass = 'bg-primary' }) => (
    <div className={styles.progress}>
      <div
        className={`progress-bar ${colorClass} ${styles.progressBar}`}
        role="progressbar"
        style={{ width: `${percentage}%` }}
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  )
  useEffect(() => {
    dispatch(fetchAdminDashboard()) // Fetch data on component mount
    dispatch(fetchAdminSalesLineGraph({ days: selectedRange }))
  }, [dispatch])
  const { data, status, error } = useSelector((state) => state.dashboard)
  const generateDistinctColors = (count) => {
    const hues = [186, 206, 226, 246, 266, 286, 306, 326, 346, 6, 26, 46]
    return Array.from({ length: count }, (_, i) => {
      const hue = hues[i % hues.length]
      const lightness = 30 + (i * 40) / count
      return `hsl(${hue}, 75%, ${lightness}%)`
    })
  }

  const categoryColors = generateDistinctColors(12)

  // Prepare category data with consistent color assignment
  const categories = data?.categoryDistribution || []
  const categoryData = categories
    .filter((c) => c.value > 0)
    .map((category, index) => ({
      name: category.name,
      value: Number(category.value) || 0,
      color: categoryColors[index % categoryColors.length],
    }))
  if (status === 'loading') return <Loader />
  if (status === 'failed') return <p className="text-danger">{error}</p>
  return (
    <div className={`container-fluid ${styles.container}`}>
      {/* Page Header */}
      <div className={styles.mb3}>
        <h1 className={` ${styles.pageHeader}`}>Dashboard Overview</h1>
        <p className={styles.textMuted}>
          Monitor your ecommerce platform performance and key metrics
        </p>
      </div>
      <div className={`row g-4 ${styles.mb5}`}>
        <div className="col-xl-3 col-lg-6 col-md-6">
          <KPICard
            title="Vendor Requests"
            value={data.vendorReqCount}
            icon={UserPlus}
            change="New requests"
            changeType="neutral"
            gradientClass="gradientInfo"
            delay={400}
            to="/vendors/requests"
          />
        </div>
        <div className="col-xl-3 col-lg-6 col-md-6">
          <KPICard
            title="Total Vendors"
            value={data.totalApprovedVendors}
            icon={UserPlus}
            changeType="neutral"
            gradientClass="gradientInfo"
            delay={400}
            to="/vendors/manage"
          />
        </div>
        <div className="col-xl-3 col-lg-6 col-md-6">
          <KPICard
            title="Total Customers"
            value={data.totalCustomers || 0}
            icon={UserPlus}
            changeType="neutral"
            gradientClass="gradientInfo"
            delay={400}
            // to="/vendors/manage"
          />
        </div>
        <div className="col-xl-3 col-lg-6 col-md-6">
          <KPICard
            title="Driver Requests"
            value={data.driverReqCount}
            icon={UserCheck}
            change="Pending approval"
            changeType="neutral"
            gradientClass="gradientTeal"
            delay={500}
            to="/drivers/requests"
          />
        </div>
        <div className="col-xl-3 col-lg-6 col-md-6">
          <KPICard
            title="Active Orders"
            value={data.activeOrderCount}
            icon={Activity}
            change="In progress"
            changeType="positive"
            gradientClass="gradientPrimary"
            delay={600}
            to="/orders"
          />
        </div>
        <div className="col-xl-3 col-lg-6 col-md-6">
          <KPICard
            title="Total Stores"
            value={data.totalApprovedVendors}
            icon={Store}
            change={`${data.approvedDiff} this month`}
            changeType="positive"
            gradientClass="gradientPink"
            delay={700}
            to="/stores"
          />
        </div>
      </div>
      {/* Charts and Stats Row */}
      <div className={`row g-4 ${styles.mb5}`}>
        {/* Sales Overview */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div
              className={`card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-3 ${styles.cardHeader}`}
            >
              <h5 className="card-title mb-0 fw-bold">Sales Overview</h5>
              <select
                className="form-select w-auto"
                value={selectedRange}
                onChange={(e) => setSelectedRange(Number(e.target.value))}
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            <div className="card-body">
              <div className={styles.chartContainer}>
                {data.salesGraph.sales.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.salesGraph.sales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                          new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        }
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`${value} SYP`, 'Total Sales']}
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="totalSales"
                        stroke="#0d6efd"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center">
                    <BarChart3 size={64} className="text-muted mb-3" />
                    <p className="fw-semibold text-muted">No sales data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className={`card-header bg-transparent border-0 py-3 ${styles.cardHeader}`}>
              <h5 className="card-title mb-0 fw-bold">Performance Metrics</h5>
            </div>
            <div className="card-body">
              <div className={styles.mb4}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted fw-medium">Avg Order Value</span>
                  <span className="fw-bold text-primary">{data.avgOrderValue} SYP</span>
                </div>
                <ProgressBar percentage={data.avgOrderValuePercentage} colorClass="bg-primary" />
              </div>
              <div className={styles.mb4}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted fw-medium">Return Rate</span>
                  <span className="fw-bold text-warning">{data.returnRate}</span>
                </div>
                <ProgressBar percentage={parseFloat(data.returnRate)} colorClass="bg-warning" />
              </div>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted fw-medium">Customer Satisfaction</span>
                  <span className="fw-bold text-success">{data.customerSatisfaction}/5</span>
                </div>
                <ProgressBar
                  percentage={(data.customerSatisfaction / 5) * 100}
                  colorClass="bg-success"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Orders and Performance Row */}
      <div className={`row g-4 ${styles.mb5}`}>
        {/* Recent Orders */}
        <div className="col-lg-8">
          <div className="card">
            <div
              className={`card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-3 ${styles.cardHeader}`}
            >
              <h5 className="card-title mb-0 fw-bold">Recent Orders</h5>
              <button
                onClick={() => navigate('/orders')}
                className={`btn btn-outline-primary btn-sm d-flex align-items-center gap-2 ${styles.btnOutlinePrimary}`}
              >
                <Eye size={16} />
                View All
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className={`table table-hover mb-0 ${styles.table}`}>
                  <thead>
                    <tr>
                      <th className="border-0 px-4 py-3 text-muted fw-semibold text-uppercase small">
                        Order ID
                      </th>
                      <th className="border-0 px-4 py-3 text-muted fw-semibold text-uppercase small">
                        Customer
                      </th>
                      <th className="border-0 px-4 py-3 text-muted fw-semibold text-uppercase small">
                        Amount(SYP)
                      </th>
                      <th className="border-0 px-4 py-3 text-muted fw-semibold text-uppercase small">
                        Status
                      </th>
                      <th className="border-0 px-4 py-3 text-muted fw-semibold text-uppercase small">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 fw-bold text-dark">{order.orderNumber}</td>
                        <td className="px-4 py-3">{order.customer}</td>
                        <td className="px-4 py-3 fw-bold text-dark">{order.amount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-muted small">
                          {' '}
                          {new Date(order.date).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm  h-100 chart-card ">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="card-title mb-1">Sales by Category</h5>
                  <p className="text-muted small mb-0">Distribution</p>
                </div>
                <CIcon
                  icon={cilLayers}
                  style={{ color: '#0b737f', width: '16px', height: '16px' }}
                />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={1}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="row mt-3">
                {categoryData.map((item, index) => (
                  <div key={index} className="col-6 mb-2">
                    <div className="d-flex align-items-center category-item">
                      <div
                        className="rounded-circle me-2"
                        style={{ width: '8px', height: '8px', backgroundColor: item.color }}
                      ></div>
                      <small className="text-muted me-1" style={{ fontSize: '11px' }}>
                        {item.name}
                      </small>
                      <span className="fw-semibold small ms-auto">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Top Customers */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className={`card-header bg-transparent border-0 py-3 ${styles.cardHeader}`}>
              <h5 className="card-title mb-0 fw-bold">Top Vendors</h5>
            </div>
            <div className="card-body">
              <div className="row g-4">
                {data.topVendors.map((vendor, index) => (
                  <div key={index} className="col-lg-4 col-md-6">
                    <div
                      className={`d-flex align-items-center p-3 bg-light rounded-3 ${styles.customerCard}`}
                    >
                      <div
                        className={`${styles.customerAvatar} me-3 ${
                          index === 0
                            ? styles.gradientPrimary
                            : index === 1
                              ? styles.gradientSuccess
                              : styles.gradientWarning
                        }`}
                      >
                        {vendor?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className={styles.flexGrow1}>
                        <div className="fw-bold text-dark">{vendor.name}</div>
                        {/* <div className="text-muted small">{vendor.email}</div> */}
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="fw-bold text-dark">
                            {' '}
                            {Number(vendor.totalSales).toFixed(2)} (SYP)
                          </div>
                          <div className="text-muted small">{vendor.totalOrders} orders</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Top vendor */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className={`card-header bg-transparent border-0 py-3 ${styles.cardHeader}`}>
              <h5 className="card-title mb-0 fw-bold">Top Customers</h5>
            </div>
            <div className="card-body">
              <div className="row g-4">
                {data.topCustomers.map((customer, index) => (
                  <div key={index} className="col-lg-4 col-md-6">
                    <div
                      className={`d-flex align-items-center p-3 bg-light rounded-3 ${styles.customerCard}`}
                    >
                      <div
                        className={`${styles.customerAvatar} me-3 ${
                          index === 0
                            ? styles.gradientPrimary
                            : index === 1
                              ? styles.gradientSuccess
                              : styles.gradientWarning
                        }`}
                      >
                        {customer?.name?.charAt(0).toUpperCase() || '?'}
                      </div>

                      <div className={styles.flexGrow1}>
                        <div className="fw-bold text-dark">{customer.name}</div>
                        {/* <div className="text-muted small">{customer.email}</div> */}
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="fw-bold text-dark">
                            {' '}
                            {Number(customer.totalSpent).toFixed(2)} (SYP)
                          </div>
                          <div className="text-muted small">{customer.totalOrders} orders</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EcommerceDashboard

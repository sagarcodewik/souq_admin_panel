import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilBlind, cilLowVision } from '@coreui/icons'
import Loader from '../../../components/loader/Loader'
import { loginValidationSchema } from '../../../utils/validations'
import { login } from '../../../redux/slice/auth'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import styles from './login.module.scss'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [processing, setProcessing] = useState(false)
  const initialValues = {
    email: '',
    password: '',
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setProcessing(true)
      await dispatch(login(values)).unwrap()
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      setProcessing(false)
    } finally {
      setSubmitting(false)
      // setProcessing(false)
    }
  }
  if (status === 'loading' || processing) return <Loader />

  return (
    <div className={styles.loginPage}>
      {/* Left Side - Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.floatingElements}>
          <div className={styles.floatingCircle}></div>
          <div className={styles.floatingCircle}></div>
          <div className={styles.floatingCircle}></div>
        </div>
        <div className={styles.heroIllustration}>
          <div className={styles.heroIcon}>
            <img className={styles.logoImg} src="/login.png" alt="Hero Illustration" />
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className={styles.formSection}>
        <CContainer>
          <CRow className="justify-content-center h-100">
            <CCol lg={10} xl={8}>
              <div className={styles.formWrapper}>
                {/* Logo Section */}
                <div className={styles.logoSection}>
                  <div className={styles.logoContainer}>
                    <img src="/LOGO_Icon.png" alt="Souq Logo" className={styles.logoImage} />
                  </div>
                </div>

                {/* Welcome Text */}
                <div className={styles.welcomeText}>
                  <h1 className={styles.title}>Souq Admin Access</h1>
                  <p className={styles.subtitle}>Enter your administrator credentials</p>
                </div>

                {/* Login Form */}
                <CCard className={styles.loginCard}>
                  <CCardBody className={styles.cardBody}>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={loginValidationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ touched, errors, isSubmitting }) => (
                        <Form>
                          {/* Email Field */}
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Administrator Email</label>
                            <CInputGroup className={styles.inputGroup}>
                              <CInputGroupText className={styles.inputIcon}>
                                <CIcon icon={cilUser} />
                              </CInputGroupText>
                              <Field
                                as={CFormInput}
                                name="email"
                                placeholder="Enter admin email"
                                autoComplete="email"
                                className={`${styles.formInput} ${touched.email && errors.email ? styles.inputError : ''}`}
                              />
                            </CInputGroup>

                            {touched.email && errors.email && (
                              <div className={styles.errorMessage}>
                                <ErrorMessage name="email" />
                              </div>
                            )}
                          </div>

                          {/* Password Field */}
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Admin Password</label>
                            <CInputGroup className={styles.inputGroup}>
                              <CInputGroupText className={styles.inputIcon}>
                                <CIcon icon={cilLockLocked} />
                              </CInputGroupText>
                              <Field
                                as={CFormInput}
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter admin password"
                                autoComplete="current-password"
                                className={`${styles.formInput} ${touched.password && errors.password ? styles.inputError : ''}`}
                              />
                              <CInputGroupText
                                className={styles.passwordToggle}
                                role="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                <CIcon icon={showPassword ? cilBlind : cilLowVision} />
                              </CInputGroupText>
                            </CInputGroup>

                            {touched.password && errors.password && (
                              <div className={styles.errorMessage}>
                                <ErrorMessage name="password" />
                              </div>
                            )}
                          </div>

                          {/* Submit Button */}
                          <CButton
                            type="submit"
                            disabled={isSubmitting}
                            className={styles.loginBtn}
                          >
                            {isSubmitting ? 'Accessing Panel...' : 'Login'}
                          </CButton>
                        </Form>
                      )}
                    </Formik>
                  </CCardBody>
                </CCard>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  )
}

export default Login

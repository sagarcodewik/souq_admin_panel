import * as Yup from 'yup'

export const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  // .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/,'Password must contain at least one uppercase letter, one number, and one special character'),
})

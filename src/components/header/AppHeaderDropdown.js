import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLanguage,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import styles from './appHeaderDropDown.module.scss'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage } from '../../redux/slice/languageSlice'
import { useTranslation } from 'react-i18next'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation('common')

  const { lang } = useSelector((state) => state.language)

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success(t('logout_success') || 'Logged out successfully')
    navigate('/', { replace: true })
  }

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en'
    dispatch(setLanguage(newLang))
    localStorage.setItem('lang', newLang)
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}
      >
        <CAvatar
          src="/logo.png"
          size="lg"
          className={styles.adminAvatar}
        />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={toggleLanguage}>
          <CIcon icon={cilLanguage} className="me-2" />
          {lang === 'en'
            ? 'Switch to Arabic'
            : 'التبديل إلى الإنجليزية'}
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        >
          <CIcon icon={cilAccountLogout} className="me-2" />
        {lang === 'en' ? 'Logout' : 'تسجيل الخروج'}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown


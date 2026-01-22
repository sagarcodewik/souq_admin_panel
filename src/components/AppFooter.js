import React from 'react'
import { CFooter } from '@coreui/react'
import { useTranslation } from 'react-i18next'

const AppFooter = () => {
    const { t } = useTranslation('common')
  return (
    <CFooter className="px-4 justify-content-center text-center">
      <div>
        <span>
          <b>© {new Date().getFullYear()} {t('nav.footer_rights')}</b>
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

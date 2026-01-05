import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 justify-content-center text-center">
      <div>
        <span>
          <b>© {new Date().getFullYear()} Dual_App Marketplace. All rights reserved.</b>
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

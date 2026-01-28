import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {CCloseButton, CSidebar, CSidebarBrand, CSidebarFooter, CSidebarHeader, CSidebarToggler,} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import { set } from '../redux/slice/uiSlice'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import getNav from '../_nav'

const AppSidebar = () => {
  const { t } = useTranslation('common')
  const dispatch = useDispatch()

  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)

  const navigation = getNav(t)

  return (
    <CSidebar className="app-sidebar border-end" colorScheme="dark" position="fixed" unfoldable={unfoldable} visible={sidebarShow} onVisibleChange={(visible) => dispatch(set({ sidebarShow: visible }))}>
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand className="w-100 sidebar-brand" to="/dashboard">
          <img src="/logo.svg" alt="Logo" className="sidebar-brand-full"/>
          <img src="/x.png" alt="Logo" className="sidebar-brand-narrow"/>
        </CSidebarBrand>
        <CCloseButton className="d-lg-none" dark onClick={() => dispatch(set({ sidebarShow: false }))}/>
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={() => dispatch(set({ sidebarUnfoldable: !unfoldable }))}/>
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

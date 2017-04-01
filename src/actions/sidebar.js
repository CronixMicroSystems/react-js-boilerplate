import {actionTypes as types} from '../constants/action_types'

export function fnToggleSidebar (sidebarStatus) {
  return {
    type: types.TOGGLE_SIDEBAR,
    sidebarStatus
  }
}

export function fnToggleMobileSidebar (sidebarStatusMobile) {
  return {
    type: types.TOGGLE_MOBILE_SIDEBAR,
    sidebarStatusMobile
  }
}

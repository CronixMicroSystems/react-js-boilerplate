import { history } from '../../store'
import { actionTypes as types } from '../../constants/action_types'
import { fnChangeToken } from '../../actions'

export function fnLoginUser () {
  history.push('/')
  return (dispatch) => {
    dispatch(fnLoginReceive({}))
  }
}

export function fnRestorePassword () {
  history.push('/')
  return (dispatch) => {
    dispatch(fnLoginReceive({}))
  }
}

export function fnNewPassword () {
  history.push('/')
  return (dispatch) => {
    dispatch(fnLoginReceive({}))
  }
}

export function fnLogoutUser () {
  return dispatch => {
    dispatch(fnLogoutReceive())
    dispatch(fnChangeToken(null))
    history.push('/login')
  }
}

export function fnLoginErrorMesOverall (loginErrorMesOverall = '') {
  return {
    type: types.LOGIN_ERROR_MES_OVERALL,
    isAuthenticated: false,
    loginErrorMesOverall: loginErrorMesOverall
  }
}
function fnLoginReceive (userModel) {
  return {
    type: types.LOGIN_SUCCESS,
    isAuthenticated: true,
    userModel
  }
}

function fnLogoutReceive () {
  return {
    type: types.LOGOUT_SUCCESS,
    isAuthenticated: false
  }
}

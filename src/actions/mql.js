import {actionTypes as types} from '../constants/action_types'

export function fnInitMQL (mql) {
  return {
    type: types.MQL,
    mql
  }
}

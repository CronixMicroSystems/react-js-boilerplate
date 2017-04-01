import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fnLogoutUser } from '../../actions'

class Logout extends Component {
  componentWillMount () {
    this.props.fnLogoutUser()
  }

  render () {
    return (<div />)
  }
}
export default connect(null, { fnLogoutUser })(Logout)

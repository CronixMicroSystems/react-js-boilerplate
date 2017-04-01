import React, {Component} from 'react'
import {connect} from 'react-redux'
import NetworkSpinner from '../components/overall/network_spinner'
import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ReduxToastr from 'react-redux-toastr'
import AlertDialog from '../components/dialogs/alertDialog'

let muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
})

class Auth extends Component {
  render () {
    return (
      <div>
        <ReduxToastr />
        <NetworkSpinner visible={this.props.app.networkActive}
          message={this.props.app.networkMessage}/>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <AlertDialog />
            {this.props.children}
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}
function mapStateToProps ({app}) { return {app} }
export default connect(mapStateToProps)(Auth)

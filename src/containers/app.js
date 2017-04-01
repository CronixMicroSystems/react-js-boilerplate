import React, {Component} from 'react'
import {connect} from 'react-redux'
import Header from '../components/header'
import SidebarContent from '../components/sidebar'
import Workarea from '../components/workarea'
import {history} from '../store'
import {Grid} from 'react-bootstrap'
import Sidebar from 'react-sidebar'
import NetworkSpinner from '../components/overall/network_spinner'
import {fnToggleSidebar, fnToggleMobileSidebar, fnInitMQL} from '../actions'
import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AlertDialog from '../components/dialogs/alertDialog'
import {SIDEBAR_STYLE} from '../data/styles'

const muiTheme = getMuiTheme({palette: {accent1Color: deepOrange500}})

class App extends Component {
  constructor (props) {
    super(props)
    history.listen(() => { this.props.fnToggleMobileSidebar(false) })
  }

  componentWillMount () {
    let mql = window.matchMedia('(min-width: 800px)')
    mql.addListener(() => ::this.mediaQueryChanged)
    this.props.fnToggleMobileSidebar(!mql.matches)
    this.props.fnInitMQL(mql)
    this.mediaQueryChanged(mql)
  }

  componentWillUnmount () {
    let mql = this.props.app.mql
    mql.removeListener(() => ::this.mediaQueryChanged)
    this.props.fnInitMQL(mql)
  }

  onSetSidebarOpen () { this.props.fnToggleMobileSidebar(false) }

  mediaQueryChanged (mql) {
    if (mql) {
      if (mql.matches) {
        this.props.fnToggleSidebar(true)
      } else {
        this.props.fnToggleSidebar(false)
        this.props.fnToggleMobileSidebar(false)
      }
    } else {
      if (this.props.app.mql.matches) {
        this.props.fnToggleSidebar(true)
      } else {
        this.props.fnToggleSidebar(false)
        this.props.fnToggleMobileSidebar(false)
      }
    }
  }

  render () {
    let content = <div />
    if (this.props.app.loadedApp) {
      content = (<div>
        <Sidebar sidebar={<SidebarContent />}
          open={this.props.app.sidebarStatusMobile}
          docked={this.props.app.sidebarStatus}
          onSetOpen={::this.onSetSidebarOpen}
          styles={SIDEBAR_STYLE}>
          <div className="app">
            <Header />
            <AlertDialog />
            <Workarea>
              <Grid fluid style={{width: '100%', padding: '0'}}>
                {this.props.children}
              </Grid>
            </Workarea>
          </div>
        </Sidebar>
      </div>)
    }
    return (
      <div>
        <NetworkSpinner visible={this.props.app.networkActive} message={this.props.app.networkMessage}/>
        <MuiThemeProvider muiTheme={muiTheme}>
          {content}
        </MuiThemeProvider>
      </div>
    )
  }
}
function mapStateToProps ({app, auth, values}) { return {app, auth, values} }
export default connect(mapStateToProps, { fnToggleSidebar, fnToggleMobileSidebar, fnInitMQL })(App)


import {Component} from 'react'
import {connect} from 'react-redux'

class Footer extends Component {

  constructor (props) {
    super(props)

    this.state = {
      version: '1.0.0'
    }
  }

  render () { return null }
}

function mapStateToProps () { return {} }
export default connect(mapStateToProps)(Footer)

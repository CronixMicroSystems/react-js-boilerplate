import React, {Component} from 'react'

const IMG = require('../../img/header_logo.jpg')

class NetworkSpinner extends Component {

  render () {
    return (
      <div style={{
        display: this.props.visible ? 'flex' : 'none',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        position: 'fixed',
        top: '0',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: '99999'
      }}>
        <div className="spinlogo" style={{
          width: '100px',
          height: '100px',
          margin: '0 auto',
          border: '0px solid black',
          borderRadius: '40px',
          backgroundColor: 'rgba(185, 185, 185, 0.75)',
          backgroundImage: `url(${IMG})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '70%'
        }}/>
      </div>
    )
  }
}
export default NetworkSpinner

import React, { Component } from 'react'
import { connect } from 'react-redux'

class EmptyTable extends Component {
  render () {
    return <div className="table-com__empty-rows-view">No data</div>
  }
}
export default connect()(EmptyTable)

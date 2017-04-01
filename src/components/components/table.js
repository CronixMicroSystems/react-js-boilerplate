import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fnChangeHeaderTitle} from '../../actions'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import SearchIcon from 'material-ui/svg-icons/action/search'
import Close from 'material-ui/svg-icons/navigation/close'
import AddCircle from 'material-ui/svg-icons/content/add-circle'
import ArrowLeftIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import ArrowRightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever'
import Refresh from 'material-ui/svg-icons/av/loop'
import LinearProgress from 'material-ui/LinearProgress'
import {blue500, red500, grey700} from 'material-ui/styles/colors'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import ReactDataGrid from 'react-data-grid'
import {Row, Col} from 'react-bootstrap'
import EmptyTable from './emptyTable'
import {I18n} from 'react-redux-i18n'

const STYLES = {
  floatingLabelFocusStyle: {
    color: blue500
  },
  underlineFocusStyle: {
    borderColor: blue500
  }
}

class TableComponent extends Component {

  constructor (props) {
    super(props)

    console.log('this.props.data', this.props.data)

    const emptyFn = () => {}

    this.timeout = null
    // initial local state
    this.state = {
      ajax: this.props.ajax || false,

      // columns and data
      uid: this.props.uid,
      columns: this.props.columns() || [],
      tableData: this.props.data.tableData || [],
      selectedIndexes: [],

      // params get data
      limit: this.props.limit || 10,
      offset: this.props.offset || 0,
      search: this.props.search || '',
      searchBy: this.props.searchBy || '',
      // DESC or ASC
      order: this.props.order || 'DESC',
      orderBy: this.props.orderBy || '',

      // params table
      iTotalDisplayRecords: this.props.data.iTotalDisplayRecords || null,
      iTotalRecords: this.props.data.iTotalRecords || null,
      // callbacks
      fnGetData: this.props.fnGetData || emptyFn,
      fnRemoveItem: this.props.fnRemoveItem || emptyFn,
      fnErrorCallback: this.props.fnErrorCallback || emptyFn,
      fnLoadingCallback: this.props.fnLoadingCallback || emptyFn,
      fnLoadedCallback: this.props.fnLoadedCallback || emptyFn,
      fnAddItems: this.props.fnAddItems || emptyFn,
      fnUpdateItems: this.props.fnUpdateItems || emptyFn,
      // params table component
      limitList: this.props.limitList || [5, 15, 30, 50, 100],
      showSearch: false,
      title: this.props.title || '',
      errorMessage: this.props.errorMessage || 'I cannot get the data, you should check your network connection and try again',
      searchButton: this.props.searchButton,
      removeItemOption: this.props.removeItemOption || false,

      enableCellSelect: this.props.enableCellSelect || false,

      minHeight: this.props.minHeight || 500,
      rowHeight: this.props.rowHeight || 50,
      addButton: this.props.addButton || false,
      selectOption: this.props.selectOption || false,
      openConfirmDialog: false,
      loader: '',
      layer: '',
      error: '',
      updateMethods: this.getData,
      updateStatus: false,
      height: window.innerHeight - 320,
      defaultTableData: this.props.data.tableData || [],
      searchByList: this.props.searchByList || []
    }
    this.updateGrid = null
  }

  // ********* API *********

  componentDidMount () {
    window.addEventListener('resize', () => ::this.handleResize())
    this.state.iTotalRecords === null ? this.fnLoadingTable() : this.fnLoadedTable()
    this.refs.MyTable.updateMetrics()
    this.updateGrid = setInterval(() => this.refs.MyTable.updateMetrics(), 1000)
  }

  componentWillReceiveProps (nextProps) {
    let data = nextProps.data.tableData

    let searchFilter = []
    let limitFilter = []
    data.map(obj => {
      for (let value in obj) {
        if (this.state.searchBy === value && String(obj[value]).toLocaleLowerCase().indexOf(String(this.state.search).toLocaleLowerCase()) !== -1 || this.state.searchBy === 'Any' && String(obj[value]).toLocaleLowerCase().indexOf(String(this.state.search).toLocaleLowerCase()) !== -1 || String(this.state.search) === '') {
          searchFilter.push(obj)
          break
        }
      }
    })
    let myLimit = searchFilter.length > this.state.limit + this.state.offset ? searchFilter.length > this.state.limit + this.state.offset ? this.state.limit + this.state.offset : searchFilter.length : searchFilter.length
    for (let i = this.state.offset; i < myLimit; i++) {
      limitFilter.push(searchFilter[i])
    }

    let iTotalRecords = this.state.ajax ? nextProps.data.iTotalRecords : searchFilter.length

    this.setState({tableData: limitFilter, iTotalRecords: iTotalRecords, defaultTableData: data}, () => {
      iTotalRecords === null ? this.fnLoadingTable() : this.fnLoadedTable()
    })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', () => ::this.handleResize())
    window.clearInterval(this.updateGrid)
  }

  onOpenConfirmDialog () {
    this.setState({openConfirmDialog: true})
  }

  onCloseConfirmDialog () {
    this.setState({openConfirmDialog: false})
  }

  handleResize () {
    this.refs.MyTable.updateMetrics()
    this.setState({height: window.innerHeight - 320})
  }

  getData () {
    this.fnLoadingTable()
    this.state.fnGetData(this.state.uid, this.state.limit, this.state.offset, this.state.order, this.state.orderBy, this.state.search, this.state.searchBy)
    this.fnLoadedTable()
  }

  fnLoadingTable (err) {
    this.state.fnLoadingCallback()
    if (err) {
      this.setState({
        loader: <LinearProgress className="table-com__loader" color={red500} mode="indeterminate"/>,
        layer: <div className="table-com__layer"/>,
        error: <div className="table-com__error-wrap">
          <Paper children={<div className="table-com__error-content">
            <div className="error-panel">
              <p className="error-panel__header">
                Ooops
                <IconButton tooltip="Try again" className="error-panel__btn"
                  onClick={::this.fnRefreshTable}>
                  <Refresh color={grey700}/>
                </IconButton>
              </p>
              <div className="error-panel__content">
                <div className="p-r-md">
                  {this.state.errorMessage}
                </div>
              </div>
            </div>
          </div>} className="table-com__error-box" zDepth={2}/></div>
      })
    } else {
      this.setState({
        loader: <LinearProgress className="table-com__loader" color={blue500}
          mode="indeterminate"/>,
        layer: <div className="table-com__layer"/>,
        error: ''
      })
    }
  }

  fnRefreshTable () {
    this.setState({
      loader: '',
      layer: '',
      error: ''
    })
    this.getData()
  }

  fnLoadedTable () {
    this.state.fnLoadedCallback()
    this.setState({
      loader: '',
      layer: '',
      error: ''
    })
  }

  onSearchListener (event) {
    window.clearTimeout(this.timeout)
    let value = event.target.value
    this.setState({search: value})
    this.timeout = window.setTimeout(() => {
      this.getData()
    }, 1000)
  }

  onChangeRowsPerPage (event) {
    let value = event.target.textContent
    if (this.state.limit !== value) {
      this.setState({limit: parseInt(value), offset: 0}, () => {
        this.getData()
      })
    }
  }

  onClickNextPage () {
    if (this.state.offset + this.state.limit < this.state.iTotalRecords) {
      this.setState({offset: parseInt(this.state.offset) + parseInt(this.state.limit)}, () => {
        this.getData()
      })
    }
  }

  onClickPreviousPage () {
    if (this.state.offset > this.state.limit) {
      this.setState({offset: parseInt(this.state.offset) - parseInt(this.state.limit)}, () => {
        this.getData()
      })
    } else {
      this.setState({offset: 0}, () => {
        this.getData()
      })
    }
  }

  onSelectPage (event) {
    this.setState({offset: (parseInt(event.target.textContent) - 1) * this.state.limit}, () => {
      this.getData()
    })
  }

  fnRemoveItems () {
    this.state.fnRemoveItem(this.state.selectedIndexes, this.state.tableData)
    this.setState({selectedIndexes: []})
    this.onCloseConfirmDialog()
  }

  onSelectSearchBy (event, index, value) {
    this.setState({searchBy: value}, () => {
      this.getData()
    })
  }

  // ********* VIEW *********

  fnShowSearch () {
    this.setState({showSearch: true})
  }

  fnShowHeader () {
    this.setState({showSearch: false, search: '', searchBy: 'Any'}, () => {
      this.getData()
    })
  }

  fnFooterContent () {
    let listPages = []
    let pagesSize = Math.ceil(this.state.iTotalRecords / this.state.limit) + 1
    for (let i = 1; i < pagesSize; i++) {
      listPages.push(<MenuItem className="table-com__select-item" key={i} value={i} primaryText={i}/>)
    }

    const ACTIONS = [
      <FlatButton
        label={I18n.t('Buttons.Cancel')}
        key={1}
        primary
        keyboardFocused
        onTouchTap={this.onCloseConfirmDialog}
      />,
      <FlatButton
        label={I18n.t('Buttons.OK')}
        key={2}
        primary
        onTouchTap={::this.fnRemoveItems}
      />
    ]
    let remove = ''
    if (this.state.removeItemOption) {
      remove = (<IconButton className="table-com__footer-remove-btn"
        disabled={this.state.selectedIndexes.length === 0}
        label="Remove selected items"
        onTouchTap={::this.onOpenConfirmDialog}
        children={<DeleteIcon className="table-com__search-icon"/>}/>)
    }
    let count = this.state.selectedIndexes.length > 0 ? <span>Count selected: {this.state.selectedIndexes.length}</span> : ''
    let limitList = this.state.limitList
    return (
      <div className="table-com__footer">
        <div className="table-com__footer-remove">
          {remove}
          {count}
          <Dialog
            title="Are you sure?"
            actions={ACTIONS}
            modal
            open={this.state.openConfirmDialog}
            onRequestClose={this.onCloseConfirmDialog}
        >
          self may lead to data loss.
        </Dialog>
        </div>
        <div className="table-com__footer-tools">
          <span className="m-r-sm m-l-sm">Page: </span>
          <SelectField
            className="table-com__select"
            value={parseInt(this.state.offset / this.state.limit) + 1}
            onChange={(event) => { ::this.onSelectPage(event) }}
            maxHeight={300}
        >
            {listPages}
          </SelectField>
          <span className="m-r-sm m-l-sm">Rows per page:</span>
          <SelectField
            className="table-com__select"
            value={this.state.limit}
            onChange={::this.onChangeRowsPerPage}
        >
            {limitList.map((obj, index) => {
              return (
                <MenuItem key={index} className="table-com__select-item" value={obj} primaryText={obj}/>
              )
            })}
          </SelectField>
          <span className="m-l-sm">{this.state.tableData.length ? this.state.offset + 1 : 0} - {this.state.offset + this.state.tableData.length}
            <span className="m-l-xs m-r-xs">of</span> {this.state.iTotalRecords}</span>
          <IconButton onClick={::this.onClickPreviousPage}
            disabled={this.state.offset === 0 || this.state.limit > this.state.iTotalRecords}
            children={<ArrowLeftIcon className="table-com__search-icon"/>}/>
          <IconButton
            onClick={::this.onClickNextPage}
            disabled={this.state.limit + this.state.offset >= this.state.iTotalRecords}
            children={<ArrowRightIcon className="table-com__search-icon"/>}/>
        </div>
      </div>
    )
  }

  rowGetter (i) {
    return this.state.tableData[i]
  }

  handleRowUpdated (e) {
    let rows = this.state.tableData
    Object.assign(rows[e.rowIdx], e.updated)
    this.setState({tableData: rows})
    this.state.fnUpdateItems(rows[e.rowIdx].Uid, e.cellKey, e.updated[e.cellKey])
  }

  handleGridSort (orderBy, order) {
    function ascSort (a, b) {
      const A = a[orderBy]
      const B = b[orderBy]
      return A < B ? -1 : A > B ? 1 : 0
    }
    function descSort (a, b) {
      const A = a[orderBy]
      const B = b[orderBy]
      return A > B ? -1 : A < B ? 1 : 0
    }

    let data = this.state.tableData

    order === 'ASC' ? data.sort(ascSort) : ''
    order === 'DESC' ? data.sort(descSort) : ''

    data = order === 'NONE' ? this.state.defaultTableData : data

    this.setState({order: order, orderBy: orderBy, tableData: data})
  }

  onRowsSelected (rows) {
    this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))})
  }

  onRowsDeselected (rows) {
    let rowIndexes = rows.map(r => r.rowIdx)

    this.setState({selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1)})
  }

  render () {
    return (
      <Paper zDepth={1} children={
        <div className="table-com">
          {this.state.layer}
          <div className="table-com__header">
            <div className={!this.state.showSearch ? 'table-com__search-wrap' : 'd-none table-com__search-wrap'}>
              <h4 className="table-com__title">{this.state.title}</h4>
              <div className="table-com__tools">
                <IconButton
                  className={this.state.searchButton ? '' : 'd-none'}
                  onClick={::this.fnShowSearch}
                  children={<SearchIcon className="table-com__search-icon"/>}/>
                <IconButton
                  className={this.state.addButton ? '' : 'd-none'}
                  onClick={this.state.fnAddItems}
                  children={<AddCircle className="table-com__search-icon"/>}/>
              </div>
            </div>
            <div className={this.state.showSearch ? 'table-com__search' : 'd-none table-com__search'}>
              <Row>
                <Col md={8} className="table-com__search-input-col">
                  <SearchIcon className="table-com__search-icon table-com__search-icon-search"/>
                  <TextField
                    className="table-com__search-input"
                    hintText="Search"
                    floatingLabelFocusStyle={STYLES.floatingLabelFocusStyle}
                    underlineFocusStyle={STYLES.underlineFocusStyle}
                    value={this.state.search}
                    onChange={::this.onSearchListener}
                    fullWidth
                  />
                </Col>
                <Col md={4}>
                  <div className="table-com__searchBy-input-col">
                    <SelectField
                      className="table-com__searchBy-input"
                      floatingLabelText="Select column"
                      value={this.state.searchBy}
                      fullWidth
                      onChange={::this.onSelectSearchBy}
                    >
                      {this.state.searchByList.map((obj, index) => {
                        return <MenuItem key={index} value={obj.key} primaryText={obj.name} />
                      })}
                    </SelectField>
                  </div>
                </Col>
              </Row>
              <IconButton onClick={::this.fnShowHeader} className="table-com__search-btn-close"
                children={<Close className="table-com__search-icon"/>}/>
            </div>
          </div>
          {this.state.loader}
          <div className="table-com__body">
            {this.state.error}
            <ReactDataGrid
              ref="MyTable"
              rowSelection={{
                showCheckbox: this.state.selectOption,
                enableShiftSelect: this.state.selectOption,
                onRowsSelected: ::this.onRowsSelected,
                onRowsDeselected: ::this.onRowsDeselected,
                selectBy: {
                  indexes: this.state.selectedIndexes
                }
              }}
              emptyRowsView={EmptyTable}
              onGridSort={::this.handleGridSort}
              columns={this.state.columns}
              rowGetter={::this.rowGetter}
              rowsCount={this.state.tableData.length}
              onRowUpdated={::this.handleRowUpdated}
              rowHeight={this.state.rowHeight}
              minHeight={this.state.height}
            />
          </div>
          <div className="table-com__footer">
            <div>
              <div>
                {::this.fnFooterContent()}
              </div>
            </div>
          </div>
        </div>
      }/>
    )
  }
}

function mapStateToProps ({table, app}) { return {app, table} }
export default connect(mapStateToProps, {fnChangeHeaderTitle}, null, {withRef: true})(TableComponent)

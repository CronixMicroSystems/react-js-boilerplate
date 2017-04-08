import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Form, Row, Col, Image, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { I18n, Translate } from 'react-redux-i18n'
import { Validate, ValidateGroup } from 'react-validate'
import { blue500 } from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import validator from 'validator'

import { fnLoginUser } from '../../actions'

const LOGO = require('../../img/header_logo.jpg')

const STYLES = {
  floatingLabelFocusStyle: {
    color: blue500
  },
  underlineFocusStyle: {
    borderColor: blue500
  }
}

class Login extends Component {

  constructor (props) {
    super(props)
    this.fnLoginUser = this.props.fnLoginUser

    this.state = {
      Email: '',
      EmailError: '',
      Password: '',
      PasswordError: '',
      Errors: []
    }
  }

  onSubmitButtonClick () {
    let err = this.state.Errors
    if (this.state.Email === '') {
      err.indexOf('EmailError') === -1 ? err.push('EmailError') : ''
      this.setState({EmailError: 'The Email is required and cannot be empty', Errors: err})
    }
    if (this.state.Password === '') {
      err.indexOf('PasswordError') === -1 ? err.push('PasswordError') : ''
      this.setState({PasswordError: 'The Password is required and cannot be empty', Errors: err})
    }
    this.state.Errors.length === 0 ? this.fnLoginUser(this.state.Email, this.state.Password) : ''
  }

  fnEmail (event) {
    this.setState({
      Email: event.target.value
    })
  }

  fnPassword (event) {
    this.setState({
      Password: event.target.value
    })
  }

  // Validation rules
  validateEmail (value) {
    let err = this.state.Errors
    if (!validator.isEmail(value) && !validator.isEmpty(value)) {
      err.indexOf('EmailError') === -1 ? err.push('EmailError') : ''
      this.setState({EmailError: 'Invalid email', Errors: err})
    } else {
      err.indexOf('EmailError') !== -1 ? err.splice(err.indexOf('EmailError'), 1) : ''
      this.setState({EmailError: '', Errors: err})
    }
  }

  validatePassword (value) {
    let err = this.state.Errors
    if (!validator.isLength(value, { min: 6, max: 64 }) && !validator.isEmpty(value)) {
      err.indexOf('PasswordError') === -1 ? err.push('PasswordError') : ''
      this.setState({PasswordError: 'The Password must be more than 6 and less than 64 characters long', Errors: err})
    } else {
      err.indexOf('PasswordError') !== -1 ? err.splice(err.indexOf('PasswordError'), 1) : ''
      this.setState({PasswordError: '', Errors: err})
    }
  }

  render () {
    const LOGIN_ERROR_MES_OVERALL = this.props.auth.loginErrorMesOverall
    const ERROR_CONTENT = LOGIN_ERROR_MES_OVERALL ? <div className="auth__error-messages">{LOGIN_ERROR_MES_OVERALL}</div> : ''
    const LOGIN = (
      <div>
        <Image src={LOGO}
          className="auth__brand"
          responsive/>
        <Form name="login-form">
          <ValidateGroup>
            <Validate validators={[::this.validateEmail]}>
              <TextField
                name="email"
                floatingLabelFocusStyle={STYLES.floatingLabelFocusStyle}
                underlineFocusStyle={STYLES.underlineFocusStyle}
                hintText={I18n.t('Login.emailLabel')}
                errorText={this.state.EmailError}
                value={this.state.Email}
                onChange={::this.fnEmail}
                floatingLabelText={I18n.t('Login.email')}
            />
            </Validate>
            <br />
            <Validate validators={[::this.validatePassword]}>
              <TextField
                name="password"
                floatingLabelFocusStyle={STYLES.floatingLabelFocusStyle}
                underlineFocusStyle={STYLES.underlineFocusStyle}
                hintText={I18n.t('Login.passwordLabel')}
                errorText={this.state.PasswordError}
                value={this.state.Password}
                onChange={::this.fnPassword}
                floatingLabelText={I18n.t('Login.password')}
                type="password"
            />
            </Validate>
            <br />
          </ValidateGroup>
          { ERROR_CONTENT }
          <RaisedButton
            disabled={this.state.Errors.length !== 0}
            className="auth__btn"
            onClick={::this.onSubmitButtonClick}
            label={I18n.t('Login.loginButton')}/>
          <div className="auth__box-nav">
            <LinkContainer
              className="p-none"
              to={'/restore_password'}>
              <Button bsStyle="link" className="blue500-color-font">
                <Translate value="Login.forgotPass"/>
              </Button>
            </LinkContainer>
          </div>
        </Form>
      </div>
    )

    return (
      <Grid fluid className="auth">
        <Row className="auth__row">
          <Col xs={8}
            xsOffset={2}
            md={6}
            mdOffset={3}
            lg={4}
            lgOffset={4}>
            <Paper className="auth__paper"
              zDepth={1}
              children={LOGIN}/>
          </Col>
        </Row>
      </Grid>
    )
  }
}
function mapStateToProps ({auth}) { return {auth} }
export default connect(mapStateToProps, {fnLoginUser})(Login)

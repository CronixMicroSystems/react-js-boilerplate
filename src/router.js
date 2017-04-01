import React from 'react'
import { Route, IndexRoute, Router } from 'react-router'
import { Provider } from 'react-redux'
import store, {history} from './store'
import App from './containers/app'
import Auth from './containers/auth'
import SignInAuth from './components/auth/login'
import RestorePassAuth from './components/auth/restore_pass'
import NewPassAuth from './components/auth/new_pass'
import LogoutAuth from './components/auth/logout'
import UsersPage from './components/pages/users'
import ProfilePage from './components/pages/profile'
import SettingsPage from './components/pages/settings/general'
import NotFoundPage from './components/pages/not_found'
import ContactsPage from './components/pages/contacts'
import FAQPage from './components/pages/faq'
import EmailPage from './components/pages/email'

function routingCallback () {
  if (store.getState().auth.isAuthenticated) {
    const EXCEPTIONS = [
      '/login',
      '/restore_password',
      '/recover_password',
      '/logout'
    ]
    if (EXCEPTIONS.indexOf(history.getCurrentLocation().pathname) === -1) {
      history.push('/login')
    }
  }
  window.scrollTo(0, 0)
}

export default (
  <Provider store={store}>
    <Router history={history}>
      <Route onUpdate={routingCallback()} path="/" component={App}>
        <IndexRoute component={UsersPage}/>
        <Route path="/users" component={UsersPage}/>
        <Route path="/profile" component={ProfilePage}/>
        <Route path="/settings" component={SettingsPage}/>
        <Route path="/contacts" component={ContactsPage}/>
        <Route path="/faq" component={FAQPage}/>
        <Route path="/email" component={EmailPage}/>
      </Route>
      <Route onUpdate={routingCallback()} path="/auth" component={Auth}>
        <Route path="/login" component={SignInAuth}/>
        <Route path="/restore_password" component={RestorePassAuth}/>
        <Route path="/recover_password" component={NewPassAuth}/>
        <Route path="/logout" component={LogoutAuth}/>
      </Route>
      <Route path="*" component={NotFoundPage}/>
    </Router>
  </Provider>
)

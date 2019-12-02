import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import { adminRouter } from './routes';
import { Frame } from './components';

const menu = adminRouter.filter(route => route.isNav === true);

const mapState = state => ({
  isLogin: state.user.isLogin,
  role: state.user.role
})
@connect(mapState)
class App extends React.Component {
  render () {
    return (
      this.props.isLogin
      ?
      <Frame menu = {menu}>
        <Switch>
          {
            adminRouter.map(route => {
              return (
                <Route
                  key = {route.pathname}
                  path = {route.pathname}
                  exact = {route.exact}
                  render = {(routeProps) => {
                    const hasPermission = route.roles.includes(this.props.role)
                    return hasPermission ? <route.component {...routeProps} /> : <Redirect to="/admin/noauth" />
                  }}
              />
              )
            })
          }
          <Redirect to = {adminRouter[0].pathname} from = "/admin" exact />
          <Redirect to = "/404" />
        </Switch>
      </Frame>
      :
      <Redirect to="/login" />
    )
  }
}

export default App;

// export default testHOC(App);
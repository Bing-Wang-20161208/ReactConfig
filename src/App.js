import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { adminRouter } from './routes';
import { Frame } from './components';

const menu = adminRouter.filter(route => route.isNav === true);

class App extends React.Component {
  render () {
    return (
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
                    return <route.component {...routeProps} />
                  }}
              />
              )
            })
          }
          <Redirect to = {adminRouter[0].pathname} from = "/admin" exact />
          <Redirect to = "/404" />
        </Switch>
      </Frame>
    )
  }
}

export default App;

// export default testHOC(App);
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { adminRouter } from './routes';

// const testHOC = (WrappedComponent) => {
//   return class HOCComponent extends React.Component {
//     render () {
//       return (
//         <>
//           <WrappedComponent />
//           <div>这是高阶组件里的信息</div>
//         </>
//       )
//     }
//   }
// }
// @testHOC
class App extends React.Component {
  render () {
    return (
      <div>
        {/* <Button type = 'primary'>test</Button> */}
        <Switch>
          {
            adminRouter.map(route => {
              return (
                <Route
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
      </div>
    )
  }
}

export default App;

// export default testHOC(App);
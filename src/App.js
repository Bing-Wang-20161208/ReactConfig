import React from 'react';
import { Button } from 'antd';

const testHOC = (WrappedComponent) => {
  return class HOCComponent extends React.Component {
    render () {
      return (
        <>
          <WrappedComponent />
          <div>这是高阶组件里的信息</div>
        </>
      )
    }
  }
}
@testHOC
class App extends React.Component {
  render () {
    return (
      <div>
        <Button type = 'primary'>test</Button>
      </div>
    )
  }
}

export default App;

// export default testHOC(App);
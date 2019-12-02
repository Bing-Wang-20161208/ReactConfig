import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux'
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import App from './App';
import { mainRouter } from './routes';
import store from './store'

import './index.less';

ReactDOM.render(
    <Provider store={store}>
        <ConfigProvider locale={zhCN}>
            <Router>
                <Switch>
                    <Route path = "/admin" component = {App} />
                    {
                        mainRouter.map(route => {
                            return <Route key = {route.pathname} path = {route.pathname} component = {route.component} />
                        })
                    }
                    <Redirect to = "/admin" from = "/" exact />
                    <Redirect to = "/404" />
                </Switch>
            </Router>
        </ConfigProvider>
    </Provider>,
    document.getElementById('root')
);


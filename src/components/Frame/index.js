import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import './Frame.less';
import logo from './logo.png';

const { Header, Content, Sider } = Layout;
@withRouter
class Frame extends Component {
    handleMenuClick = ({key}) => {
        this.props.history.push(key);
    }
    render() {
        return (
            <Layout>
                <Header className="header Re-header" style={{ backgroundColor: '#fff' }}>
                    <div className="logo Re-logo">
                        <img src={logo} alt="React初体验"/>
                    </div>
                </Header>
                <Layout>
                    <Sider width={200} style={{ background: '#fff' }}>
                        <Menu
                        mode="inline"
                        selectedKeys={[this.props.location.pathname]}
                        onClick = {this.handleMenuClick}
                        style={{ height: '100%', borderRight: 0 }}
                        >
                            {
                                this.props.menu.map(item => {
                                    return (
                                        <Menu.Item key={item.pathname}>
                                            <Icon type={item.icon} />
                                            {item.title}
                                        </Menu.Item>
                                    )
                                })
                            }
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '24px' }}>
                        <Content
                        style={{
                            background: '#fff',
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                        >
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}
export default Frame;
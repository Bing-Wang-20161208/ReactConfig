import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { Layout, Menu, Icon, Dropdown, Avatar, Badge } from 'antd';
import { markAllNotificationsList } from '../../actions/notifications'
import { logout } from '../../actions/user'
import './Frame.less';
import logo from './logo.png';

const { Header, Content, Sider } = Layout;

const mapState = state => {
    return {
        notificationsCount : state.notifications.list.filter(item => item.hasRead === false).length,
        avatar: state.user.avatar,
        displayName: state.user.displayName
    }
}
@connect(mapState, { markAllNotificationsList, logout })
@withRouter
class Frame extends Component {
    componentDidMount () {
        this.props.markAllNotificationsList()
    }
    handleMenuClick = ({key}) => {
        this.props.history.push(key);   //这里需要用到装饰器模式@withRouter，才可以使用react-route的history属性
    }
    handleDropdownMenuClick = ({key}) => {
        if ( key === "/logout" ) {
            this.props.logout()
        } else {
            this.props.history.push(key);
        }
    }
    render() {
        const menu = (
            <Menu onClick = {this.handleDropdownMenuClick}>
              <Menu.Item
                key = "/admin/notifications"
              >
                <Badge dot={Boolean(this.props.notificationsCount)}>
                    通知中心
                </Badge>
              </Menu.Item>
              <Menu.Item
                key = "/admin/profile"
              >
                个人设置
              </Menu.Item>
              <Menu.Item
                key = "/logout"
              >
                退出登录
              </Menu.Item>
            </Menu>
          )
        const selectArr = this.props.location.pathname.split('/');
        selectArr.length = 3;
        return (
            <Layout>
                <Header className="header Re-header" style={{ backgroundColor: '#fff' }}>
                    <div className="logo Re-logo">
                        <img src={logo} alt="React初体验"/>
                    </div>
                    <Dropdown overlay={menu}>
                        <div>
                            欢迎您! {this.props.displayName}
                            <Avatar src={this.props.avatar} />
                            <Badge count = {this.props.notificationsCount} offset = {[-10, -10]}>
                                <Icon type="down" />
                            </Badge>
                        </div>
                    </Dropdown>
                </Header>
                <Layout>
                    <Sider width={200} style={{ background: '#fff' }}>
                        <Menu
                        mode="inline"
                        selectedKeys={selectArr.join('/')}
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
                            margin: 0
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
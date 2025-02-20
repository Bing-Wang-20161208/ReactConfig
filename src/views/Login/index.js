import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, Card } from 'antd';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { login } from '../../actions/user'
import './login.less'
const mapState = state => ({
  isLogin: state.user.isLogin,
  isLoading: state.user.isLoading
})
@connect(mapState, { login })
@Form.create()
class Login extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values)
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      this.props.isLogin
      ?
      <Redirect to="/admin" />
      :
      <Card
          title="WB ADMIN 登录"
          className="wb-login-wrapper"
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
          {getFieldDecorator('username', {
              rules: [{ required: true, message: '*请输入您的用户名！' }],
          })(
              <Input
              disabled={this.props.isLoading}
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
              />,
          )}
          </Form.Item>
          <Form.Item>
          {getFieldDecorator('password', {
              rules: [{ required: true, message: '*请输入您的密码！' }],
          })(
              <Input
              disabled={this.props.isLoading}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
              />,
          )}
          </Form.Item>
          <Form.Item>
          {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
          })(<Checkbox disabled={this.props.isLoading}>记住账号</Checkbox>)}
          <Button type="primary" htmlType="submit" className="login-form-button" loading={this.props.isLoading}>
              登录
          </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default Login
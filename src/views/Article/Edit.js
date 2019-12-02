import React, { Component, createRef } from 'react';
import { Card, Button, Form, Input, DatePicker, Spin, message } from 'antd';
import moment from 'moment';
import E from 'wangeditor';
import { getArticle, saveArticle } from '../../requests';
import "./Edit.less";

@Form.create()
class ArticleEdit extends Component {
  constructor () {
    super ();
    this.editorRef = createRef();
    this.state = {
      isLoading : false
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const data = Object.assign({}, values, {
          createAt : values.createAt.valueOf()
        });
        this.setState({
          isLoading : true
        })
        //这里可以处理更多的逻辑
        saveArticle(this.props.match.params.id, data)
          .then(resp => {
            message.success(resp.msg);
            //根据需求确定是否跳转
            this.props.history.push('/admin/article');
          })
          .finally(() => {
            this.setState({
              isLoading : false
            })
          })
      }
    });
  }
  initEditor = () => {
    this.editor = new E(this.editorRef.current);
    this.editor.customConfig.onchange = html => (
      // html 即变化之后的内容
      this.props.form.setFieldsValue({
        content : html
      })
    )
    this.editor.create();
  }
  componentDidMount () {
    this.initEditor();
    this.setState({
      isLoading : true
    })
    getArticle(this.props.match.params.id)
      .then(resp => {
        const { id, ...data } = resp;
        data.createAt = moment(data.createAt);
        this.props.form.setFieldsValue(data);
        this.editor.txt.html(data.content);
      })
      .finally(() => {
        this.setState({
          isLoading : false
        })
      })
  }
    render() {
      const { getFieldDecorator } = this.props.form;
        return (
            <Card
              title="文章编辑"
              bordered={false}
              extra={<Button onClick={this.props.history.goBack}>取消</Button>}
            >
              <Spin spinning = {this.state.isLoading}>
                <Form
                  onSubmit={this.handleSubmit}
                  labelCol={{
                    span : 4
                  }}
                  wrapperCol={{
                    span : 16
                  }}
                >
                  <Form.Item
                    label = "标题"
                  >
                    {getFieldDecorator('title', {
                      rules: [
                        {
                          required: true,
                          message: '标题是必须的！'
                        }
                      ],
                    })(
                      <Input
                        placeholder="title"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item
                    label = "作者"
                  >
                    {getFieldDecorator('author', {
                      rules: [
                        {
                          required: true,
                          message: '作者是必须的！'
                        }
                      ],
                    })(
                      <Input
                        placeholder="admin"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item
                    label = "阅读量"
                  >
                    {getFieldDecorator('amount', {
                      rules: [
                        {
                          required: true,
                          message: '阅读量是必须的！'
                        }
                      ],
                    })(
                      <Input
                        placeholder="0"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item
                    label = "创建时间"
                  >
                    {getFieldDecorator('createAt', {
                      rules: [
                        {
                          required: true,
                          message: '时间是必须的！'
                        }
                      ],
                    })(
                      <DatePicker showTime placeholder="选择当前时间" />
                    )}
                  </Form.Item>
                  <Form.Item
                    label = "内容"
                  >
                    {getFieldDecorator('content', {
                      rules: [
                        {
                          required: true,
                          message: '内容是必须的！'
                        }
                      ],
                    })(
                    <div className="qf-editor" ref={this.editorRef} />
                    )}
                  </Form.Item>
                  <Form.Item wrapperCol={{ offset : 4 }}>
                    <Button type="primary" htmlType="submit">
                      保存修改
                    </Button>
                  </Form.Item>
                </Form>
              </Spin>
            </Card>
        )
    }
}

export default ArticleEdit;
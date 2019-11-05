import React, { Component } from 'react';
import moment from 'moment';
import { Card, Button, Table, Tag } from 'antd';

import { getArticles } from '../../requests';

const ButtonGroup = Button.Group;

const titleDisplayMap = {
  id : 'id',
  title : '标题',
  author : '作者',
  createAt : '创建时间',
  amount : '阅读量'
}

export default class ArticleList extends Component {
  constructor () {
    super ();
    this.state = {
      dataSource : [
        // {
        //   key: '1',
        //   name: '胡彦斌',
        //   age: 32,
        //   address: '西湖区湖底公园1号',
        // },
        // {
        //   key: '2',
        //   name: '胡彦祖',
        //   age: 42,
        //   address: '西湖区湖底公园1号',
        // },
      ],
      columns : [
        // {
        //   title: '姓名',
        //   dataIndex: 'name',
        //   key: 'name',
        // },
        // {
        //   title: '年龄',
        //   dataIndex: 'age',
        //   key: 'age',
        // },
        // {
        //   title: '住址',
        //   dataIndex: 'address',
        //   key: 'address',
        // },
        // {
        //   title: '操作',
        //   dataIndex: 'actions',
        //   key: 'actions',
        //   render: (text, record, index) => {
        //     console.log({text, record, index});
        //     return <Button>编辑</Button>
        //   }
        // }
      ],
      total : 0,
      isLoading : false
    }
  }
  createColumns = (columnKeys) => {
    const columns = columnKeys.map(item => {
      if ( item === 'amount' ) {
        return {
          title : titleDisplayMap[item],
          key : item,
          render : (text, record) => {
            const { amount } = record;
            /*这里是根据一个数字大小做的条件渲染
             *同理，可以做职业为级别不同的颜色
             *总经理：‘001’，经理：‘002’，主管：‘003’
             *const titleMap = {
             *  '001' : 'red',
             *  '002' : 'blue',
             *  '003' : 'black'
             *}
             return <Tag color={titleMap[item]}>{record.titleKey}</Tag>
            */
            return <Tag color={amount < 10000 ? "red" : "green"}>{record.amount}</Tag>
          }
        }
      }
      if ( item === 'createAt' ) {
        return {
          title : titleDisplayMap[item],
          key : item,
          render : (text, record) => {
            const { createAt } = record;
            return moment(createAt).format('YYYY年MM月DD日 HH:mm:ss');
          }
        }
      }
      return {
        title : titleDisplayMap[item],
        dataIndex : item,
        key : item,
      }
    })
    columns.push({
      title : '操作',
      key : 'action',
      render : () => {
        return (
          <ButtonGroup>
            <Button size="small" type="primary">编辑</Button>
            <Button size="small" type="danger">删除</Button>
          </ButtonGroup>
        )
      }
    })
    return columns;
  }
  getData = () => {
    this.setState({
      isLoading : true
    })
    getArticles()
      .then(resp => {
        const columnKeys = Object.keys(resp.list[0]);
        const columns = this.createColumns(columnKeys);
        this.setState({
          total : resp.total,
          dataSource : resp.list,
          columns
        })
      })
      .catch(err => {
        //处理错误，虽然有全局处理
      })
      .finally(() => {
        this.setState({
          isLoading : false
        })
      })
  }
  componentDidMount () {
    this.getData()
  }
  render() {
      return (
          <Card
              title="文章列表"
              bordered={false}
              extra={<Button>导出excel</Button>}
          >
              <Table
                rowKey={record => record.id}
                dataSource={this.state.dataSource}
                columns={this.state.columns}
                loading={this.state.isLoading}
                pagination={{
                  total : this.state.total,
                  hideOnSinglePage : true
                }}
              />
          </Card>
      )
  }
}

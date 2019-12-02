import React, { Component } from 'react';
import moment from 'moment';
import { Card, Button, Table, Tag, Modal, message, Tooltip } from 'antd';
import XLSX from 'xlsx';

import { getArticles,deleteArticle } from '../../requests';

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
      isLoading : false,
      offset : 0,
      limited : 10,
      deleteArticleTitle : '',
      isShowArticleModal : false,
      deleteArticleComfirmLoading : false,
      deleteArticleID : null
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
            return <Tooltip title={amount < 10000 ? "低于10000" : "高于10000"}>
                    <Tag color={amount < 10000 ? "red" : "green"}>{record.amount}</Tag>
                  </Tooltip>
            
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
      render : (text, record) => {
        return (
          <ButtonGroup>
            <Button size="small" type="primary" onClick={this.toEdit.bind(this, record.id)}>编辑</Button>
            <Button size="small" type="danger" onClick={this.showDeleteArticleModal.bind(this, record)}>删除</Button>
          </ButtonGroup>
        )
      }
    })
    return columns;
  }
  toEdit = (id) => {
    this.props.history.push(`/admin/article/edit/${id}`);
  }
  showDeleteArticleModal = (record) => {
    //使用函数的方式，定制化不够好
    // Modal.confirm({
    //   title : `是否确认删除${record.title}?`,
    //   content : '该操作将不能恢复，请谨慎！！！',
    //   onOk() {
    //     deleteArticle(record.id)
    //       .then(resp => {

    //       })
    //   }
    // })
    this.setState({
      deleteArticleTitle : record.title,
      isShowArticleModal : true,
      deleteArticleID : record.id,
      deleteArticleComfirmLoading : false
    })
  }
  hideDeleteModal = () => {
    this.setState({
      deleteArticleTitle : '',
      isShowArticleModal : false,
      deleteArticleComfirmLoading : false
    })
  }
  deleteArticle = () => {
    this.setState({
      deleteArticleComfirmLoading : true
    })
    deleteArticle(this.state.deleteArticleID)
      .then(resp => {
        message.success(resp.msg);
        //这里需要沟通产品确定删除后留在当前页还是跳转到首页
        //假设到第一页
        this.setState({
          offset : 0
        }, () => {
          this.getData();
        })
      })
      .finally(() => {
        this.setState({
          deleteArticleComfirmLoading : false,
          isShowArticleModal : false
        })  
      })
    
  }
  getData = () => {
    this.setState({
      isLoading : true
    })
    getArticles(this.state.offset, this.state.limited)
      .then(resp => {
        const columnKeys = Object.keys(resp.list[0]);
        const columns = this.createColumns(columnKeys);
        //如果在请求完成之后组件已经销毁，就不需要setState了
        if ( !this.updater.isMounted(this) ) return
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
        if ( !this.updater.isMounted(this) ) return
        this.setState({
          isLoading : false
        })
      })
  }
  componentDidMount () {
    this.getData()
  }
  onPageChange = (page, pageSize) => {
    this.setState({
      offset : pageSize * (page - 1),
      limited : pageSize
    }, () => {
      this.getData()
    })
  }
  onShowSizeChange = (current, size) => {
    //这里和产品需要确定清楚，选择之后到底是跳转到首页还是留在当前页
    this.setState({
      offset : 0,
      limited : size
    }, () => {
      this.getData()
    })
  }
  onExcel = () => {
    //这里导出表格正常是前端发送一个ajax请求到后端，然后后端返回一个文件下载地址
    //组合数据
    const data = [Object.keys(this.state.dataSource[0])];//[['id', 'title', 'author', 'amount', createAt']]
    for (let i = 0; i < this.state.dataSource.length; i++) {
      // data.push( Object.values(this.state.dataSource[i]) );
      data.push([
        this.state.dataSource[i].id,
        this.state.dataSource[i].title,
        this.state.dataSource[i].author,
        this.state.dataSource[i].amount,
        moment(this.state.dataSource[i].createAt).format('YYYY年MM月DD日 HH:mm:ss')
      ])
    }
    const ws = XLSX.utils.aoa_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
		/* generate XLSX file and send to client */
		XLSX.writeFile(wb, `article-${this.state.offset / this.state.limited + 1}-${moment().format('YYYYMMDDHHmmss')}.xlsx`);
  }
  render() {
      return (
          <Card
              title="文章列表"
              bordered={false}
              extra={<Button onClick = {this.onExcel}>导出excel</Button>}
          >
              <Table
                rowKey={record => record.id}
                dataSource={this.state.dataSource}
                columns={this.state.columns}
                loading={this.state.isLoading}
                pagination={{
                  current : this.state.offset / this.state.limited + 1,
                  total : this.state.total,
                  hideOnSinglePage : true,
                  showQuickJumper : true,
                  showSizeChanger : true,
                  onChange : this.onPageChange,
                  onShowSizeChange : this.onShowSizeChange,
                  pageSizeOptions : ['10', '15', '20', '25']
                }}
              />
              <Modal 
                title = "此操作不可逆"
                visible = {this.state.isShowArticleModal}
                onCancel = {this.hideDeleteModal}
                confirmLoading={this.state.deleteArticleComfirmLoading}
                onOk={this.deleteArticle}
              >
                {`是否确认删除${this.state.deleteArticleTitle}?`}
              </Modal>
          </Card>
      )
  }
}

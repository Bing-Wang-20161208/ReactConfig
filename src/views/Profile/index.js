import React, { Component } from 'react'
import { Card, Upload, Spin } from 'antd'
import axios from 'axios'
import { connect } from 'react-redux'

import { changeAvatar } from '../../actions/user'

const mapState = (state) => ({
    avatarUrl: state.user.avatar
})
@connect(mapState, { changeAvatar })
class Profile extends Component {
    constructor () {
        super ();
        this.state = {
            isUpLoading: false
        }
    }
    handleUploadAvatar = ({ file }) => {
        const data = new FormData()
        data.append('Token', '688aae725e31c2ef84f0bd2a85177f52c1bb4c28:N3E_Y2s6XiKAKGNcPqZ3iDsBDeY=:eyJkZWFkbGluZSI6MTU3NTIxNzcwOCwiYWN0aW9uIjoiZ2V0IiwidWlkIjoiNzA0OTgxIiwiYWlkIjoiMTY0OTU0OSIsImZyb20iOiJmaWxlIn0=')
        data.append('file', file)
        this.setState({
            isUpLoading: true
        })
        axios.post('http://up.imgapi.com/', data)
            .then(resp => {
                if ( resp.status === 200 ) {
                    this.setState({
                        avatarUrl: resp.data.linkurl,
                        isUpLoading: false
                    })
                    this.props.changeAvatar(resp.data.linkurl)
                } else {
                    //自行处理错误
                    return <span>上传错误</span>
                }
            })
            .catch(error => {
                //自行处理错误
                return <span>上传错误</span>
            })
    }
    render() {
        return (
            <Card
                title="个人设置"
            >
                <Upload
                    customRequest={this.handleUploadAvatar}
                    showUploadList={false}
                >
                    <Spin
                        spinning={this.state.isUpLoading}
                    >
                        {
                            this.props.avatarUrl ? <img style={{width: 80, height: 80}} src={this.props.avatarUrl} alt="头像" /> : <span>点击上传</span>
                        }
                    </Spin>
                </Upload>
            </Card>
        )
    }
}
export default Profile
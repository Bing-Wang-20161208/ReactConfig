import actionTypes from './actionTypes'
import { loginRequest } from '../requests'

const startLogin = () => {
    return {
        type: actionTypes.START_LOGIN
    }
}

const loginSuccess = (userInfo) => {
    return {
        type: actionTypes.LOGIN_SUCCESS,
        payload: {
            userInfo
        }
    }
}

export const changeAvatar = (avatarUrl) => {
    return {
        type: actionTypes.CHANGE_AVATAR,
        payload: {
            avatarUrl
        }
    }
}

const loginFailed = () => {
    window.localStorage.removeItem('authToken')
    window.localStorage.removeItem('userInfo1')
    window.sessionStorage.removeItem('authToken')
    window.sessionStorage.removeItem('userInfo1')
    return {
        type: actionTypes.LOGIN_FAILED
    }
}

export const logout = () => {
    return dispatch => {
        // 实际项目中，这里需要告诉服务端用户已退出
        dispatch(loginFailed())
    }
}

export const login = (userInfo) => {
    return dispatch => {
        dispatch(startLogin())
        loginRequest(userInfo)
            .then(resp => {
                const {
                    authToken,
                    ...userInfo1
                } = resp.data.data
                if ( resp.data.code === 200 ) {
                    // 本地化存储
                    if ( userInfo.remember === true) {
                        window.localStorage.setItem('authToken', authToken)
                        window.localStorage.setItem('userInfo1', JSON.stringify(userInfo1))
                    } else {
                        window.sessionStorage.setItem('authToken', resp.data.data.authToken)
                        window.sessionStorage.setItem('userInfo1', JSON.stringify(userInfo1))
                    }
                    dispatch(loginSuccess(resp.data.data))
                } else {
                    dispatch(loginFailed())
                }
            })
    }
}
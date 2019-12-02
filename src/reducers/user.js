import actionTypes from '../actions/actionTypes'

const isLogin = Boolean(window.localStorage.getItem('authToken')) || Boolean(window.sessionStorage.getItem('authToken'))
const userInfo1 = JSON.parse(window.localStorage.getItem('userInfo1')) || JSON.parse(window.sessionStorage.getItem('userInfo1'))
const initState = {
    ...userInfo1,
    isLogin,
    isLoading: false
}

export default ( state = initState, action ) => {
    switch (action.type) {
        case actionTypes.START_LOGIN:
            return {
                ...state,
                isLoading: true
            }
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                ...action.payload.userInfo,
                isLoading: false,
                isLogin: true
            }
        case actionTypes.LOGIN_FAILED:
            return {
                id: '',
                displayName: '',
                avatar: '',
                role: '',
                isLogin: false,
                isLoading: false,
                role: ''
            }
        case actionTypes.CHANGE_AVATAR:
            return {
                ...state,
                avatar: action.payload.avatarUrl
            }
        default:
            return state
    }
}
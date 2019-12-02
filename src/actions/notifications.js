import actionTypes from './actionTypes'
import { getNotification } from '../requests'

const startMarkAsRead = () => {
    return {
        type: actionTypes.START_MARK_AS_READ
    }
}

const finishMarkAsRead = () => {
    return {
        type: actionTypes.FINISH_MARK_AS_READ
    }
}
export const markNotificationAsReadById = id => {
    return dispatch => {
        dispatch(startMarkAsRead())
        //这里是模拟一个服务端请求
        setTimeout(() => {
            dispatch({
                type : actionTypes.MARK_NOTIFICATION_AS_READ_BY_ID,
                payload : {
                    id
                }
            })
            dispatch(finishMarkAsRead())
        }, 2000)
    }
}
export const markAllNotificationsAsRead = () => {
    return dispatch => {
        dispatch(startMarkAsRead())
        //这里是模拟一个服务端请求
        setTimeout(() => {
            dispatch({
                type : actionTypes.MARK_ALL_NOTIFICATIONS_AS_READ
            })
            dispatch(finishMarkAsRead())
        }, 2000)
    }
}

export const markAllNotificationsList = () => {
    return dispatch => {
        dispatch(startMarkAsRead())
        getNotification()
            .then(resp => {
                dispatch({
                    type: actionTypes.RECEIVED_NOTIFICATIONS,
                    payload: {
                        list: resp.list
                    }
                })
                dispatch(finishMarkAsRead())
            })
    }
}
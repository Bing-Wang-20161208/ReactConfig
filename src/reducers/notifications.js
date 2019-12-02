import actionTypes from '../actions/actionTypes'

const initState = {
    isLoading : false,
    list : [
        {
            id : 1,
            title : 'fhuwi hsu shj',
            desc : 'dewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsj',
            hasRead : false
        }, {
            id : 2,
            title : 'csfhuwi hsu shj',
            desc : 'dewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsjdewfdwcdnjdjdksbnvjdsj',
            hasRead : false
        }
    ]
}

export default ( state = initState, action ) => {
    switch(action.type) {
        case actionTypes.RECEIVED_NOTIFICATIONS:
            return {
                ...state,
                list: action.payload.list
            }
        case actionTypes.START_MARK_AS_READ:
            return {
                ...state,
                isLoading: true
            }
        case actionTypes.FINISH_MARK_AS_READ:
            return {
                ...state,
                isLoading: false
            }
        case actionTypes.MARK_NOTIFICATION_AS_READ_BY_ID:
            const newList = state.list.map(item => {
                if ( item.id === action.payload.id ) {
                    item.hasRead = true
                }
                return item
            })
            return {
                ...state,
                list: newList
            }
        case actionTypes.MARK_ALL_NOTIFICATIONS_AS_READ:
            return {
                ...state,
                list: state.list.map(item => {
                    item.hasRead = true
                    return item
                })
            }
        default :
            return state
    }
}
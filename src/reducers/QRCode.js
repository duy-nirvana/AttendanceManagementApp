import {Types} from '../actions/actionTypes';

const initialState = {
    qrcode: null
}

const qrcodeReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.UPDATE_QRCODE: 
            return {
                ...state,
                qrcode: action.payload
            }
        case Types.DELETE_QRCODE:
            return {
                ...state,
                qrcode: null
            }
        default: {
            return state;
        }
    }
}

export default qrcodeReducer;
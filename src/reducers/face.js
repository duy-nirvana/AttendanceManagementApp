const initialState = {
    base64Avatar: ''
}

const faceReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_BASE64_AVATAR':
            return {
                ...state,
                base64Avatar: action.payload
            }
        default: {
            return state;
        }
    }
}

export default faceReducer;
const initialState = {
    base64FaceImage: null
}

const faceReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_FACE_IMAGE:
            return {
                ...state,
                base64FaceImage: action.payload
            };
        default:
            return state;
    }
}

export default faceReducer;
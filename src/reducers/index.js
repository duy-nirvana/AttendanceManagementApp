import authReducer from "./auth";
import faceReducer from "./face";
import qrcodeReducer from './QRCode';

const { combineReducers } = require("redux");
const { default: profileReducer } = require("./profile");

const rootReducer = combineReducers({
    profile: profileReducer,
    auth: authReducer,
    qrcode: qrcodeReducer,
    face: faceReducer
})

export default rootReducer;
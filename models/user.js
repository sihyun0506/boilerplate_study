const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //공백없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    // 토큰을 이용해서 유효성 관리
    token: {
        type: String
    },
    // 토큰의 유효기간
    tokenExp: {
        type: Number
    }
});

// 설정한 스키마(제약조건)을 모델로 감싸줌
// ('모델이름', 위에서 선언한 스키마)
const User = mongoose.model('User', UserSchema)

// 다른 곳에서도 사용할 수 있게 export 해줌
module.exports = { User }

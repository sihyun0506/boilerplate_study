const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; //salt가 몇글자인지

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

//next메소드란?
//https://kamang-it.tistory.com/entry/NodeJSExpress%EB%8F%84%EB%8C%80%EC%B2%B4-next%EB%A9%94%EC%86%8C%EB%93%9C%EC%9D%98-%EC%A0%95%EC%B2%B4%EB%8A%94-%EB%AD%98%EA%B9%8C
UserSchema.pre('save',function( next ){
    var user = this;
    // User에서 비밀번호가 바뀌었을때만 암호화
    // 만약 if(user.isModified('password')){없으면 무조건 email 바꿀떄도 암호화 시켜버림
    if(user.isModified('password')) {
        // 비밀번호를 암호화
        bcrypt.genSalt(saltRounds,function(err, salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt , function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    };
});

// 설정한 스키마(제약조건)을 모델로 감싸줌
// ('모델이름', 위에서 선언한 스키마)
const User = mongoose.model('User', UserSchema)

// 다른 곳에서도 사용할 수 있게 export 해줌
module.exports = { User }

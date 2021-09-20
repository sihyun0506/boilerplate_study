const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 여기서 인증처리등을 함
    // 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth; // 쿠키파서이용
    // 토큰을 복호화하여 유저를 찾는다
    User.findByToken(token, (err, user)=>{
        //cb함수에서 err가 왔으면
        if(err) throw err;
        //user가 없으면 인증실패와 error를 보내줌
        if(!user) return res.json({
            isAuth : false,
            error : true
        })
        //user 있는 경우(token과 user를 req에 저장해줌)
        req.token = token;
        req.user = user;
        next(); //next하는 이유는 middleware이기 때문, next가 없으면 middleware에 갇혀버림
    })
    // 유저가 있으면 인증
    // 유저가 있으면 인증x

};

module.exports = { auth };
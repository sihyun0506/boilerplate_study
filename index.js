const express = require('express'); //express 모듈을 가져옴
const app = express(); //가져온 express 모듈을 이용해서 새로운 express 앱을 만들고
const port = 5000;

//--------------------mongoDb 연결 시작--------------------//
// #3
// 1. 몽고디비 사이트 접속, Db 세팅 
// 2. url 가져와서 복붙 
// 3. mongoose 다운(npm install mongoose --save)
// 4. 연결(아래 코드)
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sihyen:1@boilerplate.u9dw3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'/*,{
    //mongoose 버전이 6.0 이상이면 이하 항목이 default로 설정되어있기 때문에 에러발생
    //따라서 이 부분 지우고 실행하면 해결!
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}*/)
.then(()=>console.log('MongoDB Connected...'))
.catch(err => console.log(err));
//--------------------mongoDb 연결 종료--------------------//


app.get('/', (req, res) => res.send('Hello world! 안녕!!')); //루트 디렉토리에 오면 helloworld 출력

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
//   })


//--------------------유저 모델 설정 시작--------------------//
// #4
// 회원가입(유저이름, 아이디, 비밀번호 등을 보관하기 위해 유저 모델과 스키마만듬)
// 모델은 회원에 대한 정보를 담고 있는 틀, 스키마를 감싸줌(VO라고 생각)
// 스키마는 제약조건을 지정해주는 역할(CREATE 문이라고 생각)
// 1. models 폴더 생성
// 2. user.js 생성
// 3. user.js 에 모델 스키마 구성
//--------------------유저 모델 설정 종료--------------------//

//--------------------깃 시작--------------------//
// 깃 : 분산 버전 관리 시스템
// 여러명이 한 사이트를 위한 코드를 작성
// -> 코드를 관리하기 위함
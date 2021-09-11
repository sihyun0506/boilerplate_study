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
// # 5, 6
// 깃 : 분산 버전 관리 시스템(툴)
// 여러명이 한 사이트를 위한 코드를 작성
// -> 코드를 관리하기 위함
// 깃헙 : 깃을 위한 클라우드 서비스
// 로컬과 리모트가 안전하게 통신하기 위해 SSH(secure shell)가 필요
// but 깃헙에서는 https를 권장하기에 https로 함
//
// 루트 디렉토리에서 깃 저장소 생성( git init )
// (git status 입력시 Untracked files를 보여줌)
// <working dir> (처음 상태)
//  -> git add .
//     (working dir 의 파일들을 staging area로 이동시킴,
//      but 여기서 node_modules은 저장소에 올리지 않음 
//      왜냐하면 node_modules는 라이브러리인데 
//      이건 package.json에 들어있어서 npm intall로 다운로드가 가능하기 때문
//      그래서 git add 를 하기전에 gitignore을 만들고 node_modules을 제외하고 git add를 함
//      이미 올린거는 git rm --cached node_modules -r을 이용해서 제거)
// <staging area> (git rep에 넣기 전에 잠시 저장해놓는 곳)
//  -> git commit -m "커밋메시지" 
//     (커밋이 올라갔기 때문에 staging area 는 비워짐)
// <git rep(local)> (로컬)
//  (-> git remote add origin 레포지토리주소 <= 원격과 로컬연결)
//  -> git push origin master
// <git rep(remote)> (깃허브)
//
//--------------------깃 종료--------------------//

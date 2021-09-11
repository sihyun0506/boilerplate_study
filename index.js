const express = require('express'); //express 모듈을 가져옴
const app = express(); //가져온 express 모듈을 이용해서 새로운 express 앱을 만들고
const port = 5000;

//const bodyParser = require('body-parser'); //body-parser 가져옴
const { User } = require('./models/User'); //User.js로부터 가져옴

//express 4.16버전 이상에서는 내부에 bodyParser가 포함되므로 
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
// bodyParser 선언없이 아래처럼 사용해야함
app.use(express.urlencoded({extended: true})); //url로 된 데이터를 가져올 수 있게
app.use(express.json()); //json 타입 데이터를 가져올 수 있게

//--------------------mongoDb 연결 시작--------------------//
// #3
// 1. 몽고디비 사이트 접속, Db 세팅 
// 2. url 가져와서 복붙 
// 3. mongoose 다운($ npm install mongoose --save)
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
// 루트 디렉토리에서 깃 저장소 생성( $ git init )
// ($ git status 입력시 Untracked files를 보여줌)
// <working dir> (처음 상태)
//  $ git add .
//     (working dir 의 파일들을 staging area로 이동시킴,
//      but 여기서 node_modules은 저장소에 올리지 않음 
//      왜냐하면 node_modules는 라이브러리인데 
//      이건 package.json에 들어있어서 npm intall로 다운로드가 가능하기 때문
//      그래서 git add 를 하기전에 gitignore을 만들고 node_modules을 제외하고 git add를 함
//      이미 올린거는 git rm --cached node_modules -r을 이용해서 제거)
// <staging area> (git rep에 넣기 전에 잠시 저장해놓는 곳)
//  $ git commit -m "커밋메시지" 
//     (커밋이 올라갔기 때문에 staging area 는 비워짐)
// <git rep(local)> (로컬)
// ($ git remote add origin 레포지토리주소 <= 원격과 로컬연결)
//  $ git push origin master
// <git rep(remote)> (깃허브)
//
//--------------------깃 종료--------------------//

//--------------------회원가입 시작--------------------//
// #7
// 서버
// 클라이언트를 통해 받은 정보를 서버로 전달해줌
// 1. body-parser라는 디펜던시를 이용
// $ npm install body-parser --save
// 2. 아직은 서버사이드이므로 클라를 이용할 수 없어서 postman을 설치
// https://www.postman.com/ 사이트에서 직접 다운
// 3. 회원가입을 위한 register route를 만듬
// post방식으로 User 가져와서 user 에 클라이언트로 부터 json형식으로 받음
//--------------------회원가입 종료--------------------//

// get 방식 (홈 화면 접속시 route)
app.get('/', (req, res) => res.send('Hello world! 이건 노드몬이야 그리고 이것도 노드몬이야')); //루트 디렉토리에 오면 helloworld 출력

// post 방식 (회원가입을 위한 route)
app.post('/register', (req, res) => {
    // 회원가입할때 필요한 정보들을 client에서 가져오면
    // 그것들을 DB에 넣어준다. -> User.js에서 모델을 가져와야함
    // 위에 const { User } = require("./models/User"); 선언

    const user = new User(req.body);
    //bodyParser가 있기 때문에(지금은 express 가 그 역할도 해줌)
    //req.body 안에는 json형식으로 회원정보가 들어있음

    user.save((err, userInfo) => {
        if (err) 
            return res.json({success: false, err});
        return res.status(200).json({   //status(200)은 성공했다는 거
            success: true
        })
    })
    //save()는 mongoDb에서 오는 메서드
    //req.body를 통해 온 정보들이 user모델에 저장이 됨
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

//--------------------nodemon 시작--------------------//
// #8 
// nodemon을 이용하면 굳이 서버를 내리고 올리지 않아도 바로바로 반영
// 1. nodemon 설치
// $ npm install nodemon --save-dev 
//    (dev는 development모드 - local에서 할때만 사용하겠다.
//     굳이 붙여주지 않아도 상관없지만 붙여주는게 맞음
//     package.json보면 dependencies가 아니라 devDepen~에 있는데 -dev붙여줘서 그럼)
// 2. nodemon 사용을 위해 package.json에 script 작성
//  지금까지는 $ npm run start로 시작했지만
//  "원하는 명령어" : "nodemon index.js" 를 추가함
//  (원래는 node 로 index.js를 시작했지만, nodemon으로 index.js를 시작할거임)
// 3. nodemon 으로 실행
// $ npm run 원하는명령어
//--------------------nodemon 종료--------------------//

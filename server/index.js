const express = require('express'); //express 모듈을 가져옴
const app = express(); //가져온 express 모듈을 이용해서 새로운 express 객체를 만들고
const port = 5000;
const config = require('./config/key');
const cookieParser = require('cookie-parser');
//const bodyParser = require('body-parser'); //body-parser 가져옴
const { User } = require('./models/User'); //User.js로부터 가져옴
const { auth } = require('./middleware/auth');

app.use(cookieParser());
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
// #9 db의 id & pw깃헙에 올리지 않기
mongoose.connect(config.mongoURI/*,{
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

app.get('/api/hello', (req,res)=>{
    res.send("hello axios");
});

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
            return res.json({success : false, err});
        return res.status(200).json({   //status(200)은 성공했다는 거
            success: true
        });
    });
    //save()는 mongoDb에서 오는 메서드
    //req.body를 통해 온 정보들이 user모델에 저장이 됨
});

app.post('/login', (req, res) => {
    // 1. 요청된 이메일이 DB에 있는지 확인함.
    // 2. 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인
    // 3. 비밀번호 일치시 토큰 생성
    // 4. 토큰 생성 후 어딘가에 저장(쿠키, 로컬 등)
               
    //몽고db의 findOne메소드 사용
    User.findOne({ email : req.body.email }, (err, user) => {
        //DB에 없을 때
        if(!user){
            return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 없습니다."
            });
        };
        //DB에 있을 떄, 비밀번호 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            //비밀번호 불일치시
            if(!isMatch)
                return res.json({ loginSuccess : false, message: "비밀번호가 틀렸습니다."})
            //비밀번호 일치시, 토큰 생성 : jwt라이브러리이용
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err); //400 = 에러
                //토큰 생성 후 어딘가에 저장(쿠키, 로컬 등) 여기선 쿠키에 저장
                return res.cookie("x_auth", user.token).status(200).json({
                    loginSuccess : true, 
                    userId : user._id
                    //,token : user.token 토큰확인하려고 그냥 해봄^^
                });
            });
        });
    });
});

app.get('/auth', auth, (req, res) => {
    //여기까지 middleware(auth.js)를 통과해왔으면 인증 성공했다는 뜻
    //성공했다고 알리고, user정보를 제공
    res.status(200).json({
        _id : req.user._id,
        //role이 0이면 일반, 0이 아니면 관리자
        isAdmin : req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname : req.user.lastname,
        role : req.user.role,
        image : req.user.image
    });
});

//로그인되어있는 상태이므로 auth 필요
app.get('/logout', auth, (req, res) => {
    //middleware에서 id로 검색해서 토큰을 지워줌
    User.findOneAndUpdate({_id : req.user._id}, {token : ""}, (err, user) => {
        if(err) return res.json({success : false, err});
        return res.status(200).send({success : true});
    });
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

//--------------------Bcrypt로 비밀번호 암호화 시작--------------------//
// #10
// 1. Register Route로 가기 (app.post('/register', (req, res) => { 이부분)
// 2. save 전에 암호화를 시켜야함
// 3. User.js 안에서 userSchema.pre('save', function(){}) <= 몽구스에서 가져온 메소드
// pre('save',function(){}) : user정보를 저장하기 전에! function을 실행
// 4. bcrypt를 가져와서 function안에서 bcrypt를 실행
// 5. salt를 이용해서 비밀번호를 암호화(saltRounds = 10이면 10자리 salt를 이용해 비밀번호를 암호화)
// 해시를 이용한 비밀번호 암호화 https://st-lab.tistory.com/100 참고
// 암호화 이유 요약: 1234를 입력해도 a34h33m0jw 같은 값으로 DB에 저장되기 때문에 원래 비밀번호를 유추하기 힘듬
// but a34h33m0jw 이런 값은 이미 1234라는걸 역으로 유추 가능하므로 salt를 사용
// 
// 요약: DB에 PW를 평문으로 저장하면 2019년 페북처럼 ㅈ되니까 salt 이용한 hash로 암호화 하여 저장함.
//--------------------Bcrypt로 비밀번호 암호화 종료--------------------//

//--------------------로그인 시작--------------------//
// #11 #12
// 1. app.post('/login', (req, res)=>{}) Route를 생성
//     1. 요청된 이메일이 DB에 있는지 확인함 : 몽고DB의 findOne메소드 이용
//     2. 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인 : User에 comparePassword메소드 생성하여 확인
//     3. 비밀번호 일치시 토큰 생성 : jwt 라이브러리이용 ($ npm install jsonwebtoken --save)
//        var jwt = require('jsonwebtoken');    웹토큰을 임포트
//        var token = jwt.sign({ foo: 'bar'}, 'shhhh');  sign메소드로 합치기
//     4. 토큰 생성 후 어딘가에 저장(쿠키, 로컬 등) 여기선 쿠키에 저장
//        $ npm install cookie-parser --save
//        const cookieParser = require('cookie-parser');
//        app.use(cookieParser());
//
//샘플에서는 쿠키파서가 아니라 다른 라이브러리 사용한듯??             
//--------------------로그인 종료--------------------//

//--------------------권한 체크(auth:인증) 종료--------------------//
// #13
// jwt를 이용한 Auth : https://sanghaklee.tistory.com/47 참고
// 
// 1. app.get('/auth', auth, (req, res) => {} ) Route를 생성
//--------------------권한 체크(auth:인증) 종료--------------------//

//--------------------로그아웃 시작--------------------//
// #14
// 1. app.get('/logout', auth, (req,res)=>{}) Route를 생성
// 2. 로그아웃하려는 유저를 DB에서 찾아서
// 3. 토큰을 지워줌
//--------------------로그아웃 종료--------------------//


//*** [var 과 let const의 차이] ***
//var은 function-scoped
//let과 const는 block_scoped
//var이 제일 아무렇게나 써도 됨
//let과 const는 변수 재선언이 불가능함 <= var의 문제점이 해결됨
//let과 const의 차이는 let은 재할당 가능, const는 재할당 불가
//요약: var: 병신, let: 우리가 보통 하는 변수선언과 동일, const: 우리가 보통 하는 상수선언과 동일
//https://gist.github.com/LeoHeo/7c2a2a6dbcf80becaaa1e61e90091e5d
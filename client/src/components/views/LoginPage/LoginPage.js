// import Axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';

function LoginPage() {
    const dispatch = useDispatch();

    //state를 만들어줌
    //useState처음 생성시 있는 initialState는 초기값 설정임 따라서 초기값 ""으로 해줬음
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onSubmitHandler = (event) => {
        event.preventDefault(); //버튼클릭직후 화면 리프레쉬를 막기 위함
        // console.log('Email',Email);
        // console.log('Password',Password);

        let body = {
            email: Email,
            password: Password
        };

        //원래는 여기서 
        //Axios.post('/login', body).then(response=>{   }); 해서 처리하는데 우리는 리덕스 쓸거임
        dispatch(loginUser(body))
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}    
            >
                <label>Email</label>
                {/* state이 바뀌어야 value가 바뀌는 구조 */}
                <input type='email' value={Email} onChange={onEmailHandler} /> 
                <label>Password</label>
                <input type='password' value={Password} onChange={onPasswordHandler} />
                <br/>
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage

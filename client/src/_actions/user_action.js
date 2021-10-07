import Axios from 'axios';
import {
    LOGIN_USER
} from './types';

export function loginUser(dataToSubmit) {

        const request = Axios.post('/login', dataToSubmit)
            .then(response => response.data);
        //리턴을 시켜서 리듀서로 보냄
        //리듀서는 (previousState, action) => nextState
        //이전스테이트와 액션을 조합해서 다음스테이트를 만들어줌
        return {
            type: LOGIN_USER,
            payload: request
        }
}
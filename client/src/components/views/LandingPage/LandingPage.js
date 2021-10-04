import React,{useEffect} from 'react';
import axios from 'axios';
// import { response } from 'express';

function LandingPage() {

    useEffect(()=>{
        axios.get('/api/hello').then(response => console.log(response.data))
    },[])

    return (
        <div>
            LandingPage
        </div>
    )
}

export default LandingPage

import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/AuthProvider";
import './index.css';
import axios from './api/axios';


const LOGIN_URL = 'https://login.salesforce.com/services/oauth2/success'

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [username, setUserName] = useState('');
    const [password, setPassWord] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ username, password, roles, accessToken });
            setUserName('');
            setPassWord('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
        <div> <img class='logo' src="./logo.png" alt="" /></div>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="#">Go to Home</a>
                    </p>
                </section>
            ) : (
                
                <section>
                    
                     
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 id='heading'>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username"></label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            placeholder='Username'
                            autoComplete="off"
                            onChange={(e) => setUserName(e.target.value)}
                            value={username}
                            required
                        />

                        <label htmlFor="password"></label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassWord(e.target.value)}
                            placeholder='Password'
                            value={password}
                            required
                        />
                        <button>Login</button>
                   </form>
                       
                
                    {/* <p>
                        Need an Account?<br />
                        <span className="line">
                            put router link here
                            <a href="#">Sign Up</a>
                        </span>
                    </p> */}
                     
                </section>
                
            )
                     

            }
              
             
        </>
        
        
    )
}

export default Login
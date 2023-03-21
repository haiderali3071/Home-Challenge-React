import React, { useState } from "react";
import "./Login.scoped.css";
import { Link } from "react-router-dom";
import { storeToken } from "../../utilities/config";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async () => {
        if (!username || !password) {
            alert("Please fill all fields");
            return;
        }
        
        setLoading(true);
        
        const data = {
            username,
            password,
        }
        const options = {
            method: "POST",
            url: process.env.REACT_APP_URL + "/api/login",
            headers: {
                "Content-Type": "application/json",
            },
            data
        };
        try {
            const response = await axios.request(options);
            if (response.data.data.token) { 
                storeToken(response.data.data.token);
                navigate("/home");
            }
        }
        catch (err) {
            alert(err.response.data.message || "Error occured")
            console.log(err)
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="main" style={{ height: window.innerHeight + "px" }}>
            <div className="card align-items-center justify-content-center card-size px-5 py-5"  >
                <h2>Sign in</h2>
                <div className="usernameDiv mt-4">
                    <label>Username</label>
                    <input type={"text"} onChange={(e) => setUsername(e.target.value)}
                        placeholder={"Enter username"} />
                </div>
                <div className="usernameDiv mt-3">
                    <label>Password</label>
                    <input type={"password"} onChange={(e) => setPassword(e.target.value)}
                        placeholder={"Enter password"} />
                </div>
                <button type="button" class="btn btn-primary mt-4 w-75" onClick={login}>
                    <Spinner
                        className={loading ? "" : "visually-hidden"}
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        style={{ marginLeft: -30, marginRight: 15 }}
                    />
                    Sign in
                </button>
                <Link to="/register" className="btn btn-link">Create an account</Link>
            </div>
        </div>
    )
}

export default Login;
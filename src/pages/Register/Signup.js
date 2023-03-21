import React, { useState } from "react";
import "./Signup.scoped.css";
import { Link } from "react-router-dom";
import { storeToken } from "../../utilities/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const signup = async () => {

        if (!username || !password || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Confirm password doesn\'t match");
            return;
        }

        setLoading(true);

        const data = {
            username,
            password,
            confirm_password: confirmPassword
        }

        const options = {
            method: "POST",
            url: process.env.REACT_APP_URL + "/api/register",
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
                <h2>Sign up</h2>
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
                <div className="usernameDiv mt-3">
                    <label>Confirm password</label>
                    <input type={"password"} onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={"Confirm password"} />
                </div>
                <button type="button" class="btn btn-primary mt-4 w-75" onClick={signup}>
                    <Spinner
                        className={loading ? "" : "visually-hidden"}
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        style={{ marginLeft: -30, marginRight: 15 }}
                    />
                    Sign up
                </button>
                <Link to="/" className="btn btn-link">Have an account? Sign in</Link>
            </div>
        </div>
    )
}

export default Signup;
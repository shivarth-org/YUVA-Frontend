import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// My components
import { LoginForm } from "../../components/common/LoginForm";

// My css
import loginCss from "../../css/common/login-page.module.css";

import logo from "../../assets/images/yuva_logo.png";
import { SERVER_ORIGIN } from "../../utilities/constants";

// todo: cred validation on frontend

///////////////////////////////////////////////////////////////////////////////////////////////
const LoginPage = () => {
    const [creds, setCreds] = useState({ adminId: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            navigate("/admin/services")
        }
    }, [])
    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
const basicAuth = btoa(`${adminId}:${adminPassword}`);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                       Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(creds),
                }
            );

            const result = await response.json();
            // (response);

            setIsLoading(false);

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    if (
                        !("areCredsInvalid" in result) ||
                        result.areCredsInvalid === true
                    ) {
                        toast.error(result.statusText);
                    }
                } else {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                if ("token" in result) {
                    const token = result.token;
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("userType", "admin")
                    navigate("/admin/services");
                }
            } else {
                // for future
            }
        } catch (error) {
        }
    };

    const updateCreds = (e) => {
        setCreds((prevCreds) => {
            const newCreds = { ...prevCreds, [e.target.name]: e.target.value };
            // (newCreds);

            return newCreds;
        });
    };

    return (
        <div className={loginCss.outerDiv}>
            <img
                src={logo}
                alt="yuva-big-logo"
                className={loginCss.yuvaImg}
            ></img>

            <LoginForm
                role="admin"
                adminId={creds.adminId}
                password={creds.password}
                onChange={updateCreds}
                onClick={handleSubmit}
                isBtnDisabled={isLoading}
            />
        </div>
    );
};

export default LoginPage;

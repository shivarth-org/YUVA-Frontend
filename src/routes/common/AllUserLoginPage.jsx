import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUserType } from './UserTypeContext';



// My components
import { LoginForm } from "../../components/common/LoginForm";

// My css
import loginCss from "../../css/common/login-page.module.css";

import logo from "../../assets/images/yuva_logo.png";
import { SERVER_ORIGIN } from "../../utilities/constants";

// todo: cred validation on frontend

///////////////////////////////////////////////////////////////////////////////////////////////
const LoginPage = () => {
    const { userType, setUserTypeToAdmin, setUserTypeToUser, setUserTypeToInstitute, setUserTypeToChapterEM } = useUserType();
    const [isUserTypeAvailable, setIsUserTypeAvailable] = useState(false)
    // const [creds, setCreds] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [creds, setCreds] = useState({});

    useEffect(() => {
        if (!userType) {
            setIsUserTypeAvailable(false)
        }
        if (!isUserTypeAvailable) {
            const urlParams = new URLSearchParams(window.location.search);
            let typeParam = urlParams.get('userType');

            if (typeParam === 'admin') {
                setUserTypeToAdmin()
                if (sessionStorage.getItem("token")) {
                    navigate("/admin/services")
                }
            }
            if (typeParam === 'student') {
                setUserTypeToUser()
                if (sessionStorage.getItem("token")) {
                    navigate("/")
                }
            }
            if (typeParam === 'institute') {
                setUserTypeToInstitute()
                if (sessionStorage.getItem("token")) {
                    navigate("/institute/services")
                }
            }
            if (typeParam === 'em') {
                setUserTypeToChapterEM()
                if (sessionStorage.getItem("token")) {
                    navigate("/em/services")
                }
            }
        }
        if (userType === "student") {
            setCreds({ userId: "", password: "" });
        } else if (userType === "institute") {
            setCreds({ instituteEmail: "", password: "" });
        } else if (userType === "em") {
            setCreds({ email: "", password: "" });
        }
        if (sessionStorage.getItem("token")) {
            
        }
        // }, [])

    }, [userType]);

    const handleSubmit = async () => {
        setIsLoading(true);
        let URLname;
        if (userType === "student") { setCreds({ "userId": "", password: "" }); URLname = "student"; }
        else if (userType === "institute") { setCreds({ "officerEmail": "", password: "" }); URLname = "institute"; }
        else if (userType === "em") { setCreds({ "email": "", password: "" }); URLname = "em"; }
        // console.log(bodyParam, userType)
        try {
            const instituteId = process.env.REACT_APP_INSTITUTE_ID;
            const institutePassword = process.env.REACT_APP_INSTITUTE_PASSWORD;
            const basicAuth = btoa(`${instituteId}:${institutePassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/${URLname}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                       Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(creds),
                }
            );

            setIsLoading(false);
            const result = await response.json();
            // (response);


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
                    const mongo_id = result._id._id
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem('_id', mongo_id);
                    navigate(`/${userType}/services`);
                }
            } else {
                // for future
            }
        } catch (error) {
        }
        // }

    };

    // useEffect(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const typeParam = urlParams.get('userType');

    //     if (typeParam) {
    //         // setUserType(typeParam);
    //     }
    // }, []);

    const updateCreds = (e) => {
        setCreds((prevCreds) => {
            const newCreds = { ...prevCreds, [e.target.name]: e.target.value };
            // (newCreds);

            return newCreds;
        });
    };

    return (
        <>


            {!sessionStorage.getItem("token") && <>
                <div className={loginCss.outerDiv}>
                    <img
                        src={logo}
                        alt="yuva-big-logo"
                        className={loginCss.yuvaImg}
                    ></img>
                    <LoginForm
                        role={userType === "student" ? "user" : userType}
                        adminId={creds[userType] === "student" ? "user" : creds[userType]}
                        password={creds.password}
                        onChange={updateCreds}
                        onClick={handleSubmit}
                        isBtnDisabled={isLoading}
                    />

                </div>
            </>
            }
        </>

    );
};

export default LoginPage;

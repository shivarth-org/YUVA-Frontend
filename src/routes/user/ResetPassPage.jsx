import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import logo from "../../assets/images/yuva_logo.png";
import { SERVER_ORIGIN } from "../../utilities/constants";

const UserResetPass = () => {
    const [creds, setCreds] = useState({
        currPassword: "",
        newPassword: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const canVisitPage = async () => {
            try {
                const userId = process.env.REACT_APP_USER_ID;
                const userPassword = process.env.REACT_APP_USER_PASSWORD;
                 const basicAuth = btoa(`${userId}:${userPassword}`);
                setIsLoading(true);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/student/auth/verify-token`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                           Authorization: `Basic ${basicAuth}`,
                        },
                    }
                );

                const result = await response.json();
                // (response);


                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        if (
                            !("isLoggedIn" in result) ||
                            result.isLoggedIn === false
                        ) {
                            // redirect to login page, navigate("/login?userType=student");
                        }
                    } else {
                        alert("Internal server error"); // todo: toast notify
                    }
                } else if (response.ok && response.status === 200) {
                    if (result.userDoc.isPassReset) {
                        if (result.userDoc.isRegistered) {
                        } else {
                        }
                    }
                } else {
                    // for future
                }

                setIsLoading(false);
            } catch (error) {
            }
        };

        canVisitPage();
    }, []);

    const handleSubmit = async (e) => {
       // e.preventDefault();

        try {
            setIsLoading(true);
            const userId = "utkarsh@troology.in";
            const userPassword = "Redhood@23"
             const basicAuth = btoa(`${userId}:${userPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/student/auth/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": sessionStorage.getItem("token"),
                       Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(creds),
                }
            );

            const result = await response.json();
            // (response);


            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    if (
                        !("isLoggedIn" in result) ||
                        result.isLoggedIn === false
                    ) {
                    } else if (
                        !("isCurrPasswordIncorrect" in result) ||
                        result.isCurrPasswordIncorrect === true
                    ) {
                        // redirect to login page
                    }
                } else if (response.status === 403) {
                    if (
                        !("isPassReset" in result) ||
                        result.isPassReset === true
                    ) {
                    }
                } else {
                    alert("Internal server error"); // todo: toast notify
                }
            } else if (response.ok && response.status === 200) {
            } else {
                // for future
            }

            setIsLoading(false);
        } catch (error) {
        }
    };

    const onChange = (e) => {
        setCreds((prevCreds) => {
            return { ...prevCreds, [e.target.name]: e.target.value };
        });

        // (creds);
    };

    return (
        <div>
            <section>
                {/* <div className="container-fluid h-custom my-5"> */}
                <div
                    className=" pv "
                    style={{ display: "flex", marginTop: "100px" }}
                >
                    <div className="col-md-9 col-lg-6 col-xl-5 left">
                        <img
                            src={logo}
                            style={{ borderRadius: "45px" }}
                            className="img-fluid"
                            alt="Sample"
                        />
                    </div>

                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 logindiv right">
                        <form
                            className="my-4"
                            style={{ padding: "20px", paddingTop: "70px" }}
                        >
                            <h3
                                style={{
                                    marginBottom: "27px",
                                    fontSize: "1.5em",
                                }}
                            >
                                Reset Password
                            </h3>

                            <div className="form-outline mb-4">
                                <input
                                    style={{
                                        borderRadius: "0px",
                                        fontSize: "25px",
                                    }}
                                    className="form-control form-control-lg"
                                    id="floatingInput"
                                    name="currPassword"
                                    placeholder="Current Password"
                                    value={creds.currPassword}
                                    onChange={onChange}
                                />
                                {/* <label className="form-label" htmlFor="floatingInput">Email</label> */}
                            </div>

                            <div className="form-outline mb-3">
                                <input
                                    type="password"
                                    style={{
                                        borderRadius: "0px",
                                        fontSize: "25px",
                                    }}
                                    className="form-control form-control-lg"
                                    id="floatingPassword"
                                    name="newPassword"
                                    placeholder="new Password"
                                    value={creds.newPassword}
                                    onChange={onChange}
                                />
                                {/* <label className="form-label" htmlFor="floatingPassword">Password</label> */}
                            </div>

                            {/* <div className="d-flex justify-content-between align-items-center">
        
        <Link  className="text-body" to="/signup">Forgot password?</Link>
      </div> */}

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button
                                    style={{
                                        borderRadius: "0px",
                                        width: "150px",
                                        fontSize: "25px",
                                        backgroundColor: isLoading
                                            ? "red"
                                            : "purple",
                                    }}
                                    type="button"
                                    className="btn btn-success btn-lg"
                                    onClick={handleSubmit}
                                    //   disabled={isLoading === true}
                                >
                                    Reset
                                </button>

                                {/* <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <Link to="/signup"
            className="link-danger">Register</Link></p> */}
                            </div>
                        </form>
                    </div>
                </div>
                {/* </div> */}
            </section>
            <ToastContainer />
        </div>
    );
};

export default UserResetPass;

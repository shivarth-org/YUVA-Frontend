import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// My components
// import { LoginForm } from "../../components/common/LoginForm";

// My css
import css from "../../css/common/login-form.module.css";
import regisCss from "../../css/user/regis-page.module.css";

// import logo from "../../assets/images/yuva_logo.png";
import { SERVER_ORIGIN } from "../../utilities/constants";
import SecCard from "../../components/common/SecCard";

// todo: validation of creds on frontend side

///////////////////////////////////////////////////////////////////////////////////////////////////////////
const SetPasswordPage = () => {
    // const [modal, setModalOpen] = useState(false);
    // const [form, setForm] = useState({
    //     // userId: "",
    //     password: "",
    //     userId: "",

    // });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true); // State to track password match
    const [isLoading, setIsLoading] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);
    const navigate = useNavigate();
    const [creds, setCreds] = useState({ userId: "", password: "" });
    const updateCreds = (e) => {
        setCreds((prevCreds) => {
            const newCreds = { ...prevCreds, [e.target.name]: e.target.value };
            // (newCreds);

            return newCreds;
        });
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordsMatch(event.target.value === confPassword); // Check if passwords match
    };

    const handleConfPasswordChange = (event) => {
        setConfPassword(event.target.value);
        setPasswordsMatch(event.target.value === password); // Check if passwords match
    };
    function handleModalClose() {
        navigate('/')
        // setModalOpen(false);
        setEmailSuccess(false);
    }

    async function handleSubmitClick() {
        // const { isValid, desc } = isRegisFormValid(regisForm);
        if (!passwordsMatch) {
            toast.error("Password Does Not Match");
            return;
        }

        try {
            // setIsRegistering(true);
            // setIsBtnDisabled(true);
            const userId = "utkarsh@troology.in";
            const userPassword = "Redhood@23"
             const basicAuth = btoa(`${userId}:${userPassword}`);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/student/auth/set-pwd`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                       Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify({ 'userId': email, 'password': confPassword }),
                }
            );

            const result = await response.json();

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 500) {
                    toast.error(result.statusText);
                } else if (response.status === 403) {
                    // response.errors.map(elem => {
                    return toast.error(result.statusText);
                    // })
                }
            } else if (response.ok && response.status === 200) {
                toast.success("Set password successfully, you can login now"); // registered therefore regis btn remains disabled
                navigate("/");
            } else {
                // for future
            }
        } catch (err) {
            console.log(err.message);
            // setIsBtnDisabled(false); // can reclick on register btn
        }
    }

    useEffect(() => {
        // Parse the URL to extract the email address
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');

        // Set the email state
        if (emailParam) {
            setEmail(emailParam);
        }
    }, []);

    return (
        <div className={`${regisCss.verifyouterDiv} ${regisCss.outerDiv}`}>
            <SecCard>
                <div >
                    <p className={css.passHeading}>Set Password</p>
                    <div>
                        <div>
                            <div className="d-grid" style={{ marginBottom: "0.8rem" }}>
                                <label className={regisCss.regisLabel} htmlFor="email">
                                    Email <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="Email"
                                    placeholder="E-mail"
                                    className={css.forgotPassInput}
                                    value={email}
                                    readOnly // Make the input field read-only to prevent manual editing
                                />
                            </div>
                            <div className="d-grid" style={{ marginBottom: "0.8rem" }}>
                                <label className={regisCss.regisLabel} htmlFor="password">
                                    Password <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Enter Password"
                                    className={css.forgotPassInput}
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div className="d-grid" style={{ marginBottom: "0.8rem" }}>
                                <label className={regisCss.regisLabel} htmlFor="confpassword">
                                    Confirm Password <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    name="Confirm Password"
                                    id="confpassword"
                                    placeholder="Enter Confirm Password"
                                    className={css.forgotPassInput}
                                    value={confPassword}
                                    onChange={handleConfPasswordChange}
                                />
                                {!passwordsMatch && <p style={{ color: "red", marginTop: "0.2rem" }}>Passwords do not match</p>}
                            </div>
                        </div>
                        <div className={css.forgotPassBtnWrapper}>
                            <button
                                className={css.forgotPassCancelBtn}
                                onClick={handleModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                className={css.forgotPassBtn}
                                onClick={handleSubmitClick}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </SecCard>
        </div>
    );
};

export default SetPasswordPage;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Spinloader from "./Spinloader";
import { useUserType } from '../../routes/common/UserTypeContext';
import { SERVER_ORIGIN } from "../../utilities/constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'
// My css
import css from "../../css/common/login-form.module.css";
// ! Disable login button when loading by creating isLoading state, so user cannot press it again and again

import { validation } from "../../utilities/constants";
import { capitalizeFirstLetter } from "../../utilities/helper_functions";

export const LoginForm = (props) => {
    const [modal, setModalOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState(""); // New state for recovery email
    const { userType } = useUserType();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const handleChange = (e) => {
        props.onChange(e); // Need to pass the whole event, passing updatedField just gives the last entered character of the input
    };

    const handleLogInClick = () => {
        props.onClick();
    };

    function handleForgotPassClick() {
        setTimeout(() => {
            setModalOpen(true);
        }, 1000);
        setLoader(true);
        setTimeout(() => {
            setLoader(false);
        }, 1000);
    }
    const handleToggle = () => {
        if (type === 'password') {
            setIcon(eye);
            setType('text')
        } else {
            setIcon(eyeOff)
            setType('password')
        }
    }
    function handleModalClose() {
        setModalOpen(false);
        setEmailSuccess(false);
        setRecoveryEmail(""); // Reset recovery email when modal is closed
    }

    async function handleSubmitClick() {
        setIsLoading(true);

        try {
            const response = await fetch(
                `${SERVER_ORIGIN}/api/${userType}/auth/recover-pwd`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: recoveryEmail }), // Use the recoveryEmail state
                }
            );

            setIsLoading(false);
            const result = await response.json();

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    toast.error(result.statusText);
                } else {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                setEmailSuccess(true);
            } else {
                // for future
            }
        } catch (error) {
            setIsLoading(false);
            toast.error("An error occurred. Please try again.");
        }
    }

    return (
        <div className="loginWrapper">
            <div className={css.outerDiv}>
                {modal ? (
                    <div className={css.loginModal}>
                        <p className={css.passHeading}>Recover Password</p>
                        <input
                            type="email"
                            id="newPassEmail"
                            placeholder="Recovery E-mail"
                            autoComplete="on"
                            className={css.forgotPassInput}
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)} // Update recovery email state
                        />
                        {emailSuccess && (
                            <p className={css.EmailSuccessText}>
                                A mail has been sent to your e-mail address.
                            </p>
                        )}
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
                                disabled={isLoading} // Disable the button when loading
                            >
                                {isLoading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className={css.heading}>
                            {capitalizeFirstLetter(props.role)}{" "}Login
                        </p>
                        {props.role === 'admin' || props.role === 'user' ? (
                            <input
                                className={css.input}
                                type="text"
                                placeholder={
                                    props.role === "user"
                                        ? "Enter Student Username or Email"
                                        : "Enter Admin ID"
                                }
                                name={props.role === "user" ? "userId" : "adminId"}
                                value={
                                    props.role === "user"
                                        ? props.userId
                                        : props.adminId
                                }
                                onChange={handleChange}
                                maxLength={validation.authForm.userId.maxLen}
                                autoComplete="on"
                            />
                        ) : (
                            <input
                                className={css.input}
                                type="text"
                                placeholder={
                                    props.role === "institute"
                                        ? "Enter Institute Email"
                                        : "Enter Chapter EM Email"
                                }
                                name={props.role === "institute" ? "instituteEmail" : "email"}
                                value={
                                    props.role === "institute"
                                        ? props.instituteEmail
                                        : props.email
                                }
                                onChange={handleChange}
                                maxLength={validation.authForm.userId.maxLen}
                                autoComplete="on"
                            />
                        )}
                        <div>
                            <div>
                                <div class="mb-4 flex" style={{ position: 'relative' }}>
                                    <input
                                        className={css.input}
                                        type={type}
                                        name="password"
                                        placeholder="Password"
                                        value={props.password}
                                        onChange={handleChange}
                                        maxLength={validation.authForm.password.maxLen}
                                        autoComplete="on"
                                    />
                                    <span class="flex justify-around items-center" onClick={handleToggle} style={{ position:'absolute', right:'10px', top:'7.2px' }}>
                                        <Icon class="absolute mr-10" icon={icon} size={25} />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Link
                            onClick={handleForgotPassClick}
                            className={css.forgotPassText}
                        >
                            Forgot Password
                        </Link>
                        {loader && (
                            <div className={css.forgotPassLoaderWrapper}>
                                <div className={css.forgotPassLoader}>
                                    <Spinloader />
                                </div>
                            </div>
                        )}
                        <button
                            className={css.btn}
                            onClick={handleLogInClick}
                            disabled={props.isBtnDisabled}
                        >
                            {props.isBtnDisabled ? "Logging in..." : "Login"}
                        </button>
                        {props.role === "user" && (
                            <>
                                <p className={css.forgotPassText}>
                                    Don't have an account ?
                                </p>
                                <Link
                                    className={css.registerText}
                                    to="/user/register"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

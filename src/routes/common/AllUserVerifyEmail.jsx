import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OtpInput from 'react-otp-input';
import { useUserType } from './UserTypeContext';

// My css
import css from "../../css/common/login-form.module.css";
import regisCss from "../../css/user/regis-page.module.css";
import SecCard from "../../components/common/SecCard";

import { SERVER_ORIGIN } from "../../utilities/constants";
// import { faL } from "@fortawesome/free-solid-svg-icons";
// import { decryptData } from "../../utilities/helper_functions";

const SetPasswordPage = () => {
    const [email, setEmail] = useState('');
    // const [userType, setUserType] = useState('');
    const [otp, setOtp] = useState('');
    const [respOTP, setRespOTP] = useState('');
    const [errorMessage, setErrorMessage] = useState(false);
    const [isAPIHitted, setIsAPIHitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // Initial time left in seconds
    const [isOTPAPIHitted, setOTPIsAPIHitted] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const [isUserTypeAvailable, setIsUserTypeAvailable] = useState(false)
    const { userType, setUserTypeToAdmin, setUserTypeToUser, setUserTypeToInstitute, setUserTypeToChapterEM } = useUserType();

    useEffect(() => {
        if (!userType) {
            setIsUserTypeAvailable(false)
        }
        if (!isUserTypeAvailable) {
            const urlParams = new URLSearchParams(window.location.search);
            let typeParam = urlParams.get('userType');

            if (typeParam === 'admin') {
                setUserTypeToAdmin()
                // userType = typeParam;
                // console.log(typeParam, userType);
            }
            if (typeParam === 'student') {
                setUserTypeToUser()
                // userType = typeParam;
                // console.log(typeParam, userType);
            }
            if (typeParam === 'institute') {
                setUserTypeToInstitute()
                // userType = typeParam;
                // console.log(typeParam, userType);
            }
            if (typeParam === 'em') {
                setUserTypeToChapterEM()
                // userType = typeParam;
                // console.log(typeParam, userType);
            }
        }
        // if (userType === "student") {
        //     setCreds({ userId: "", password: "" });
        // } else if (userType === "institute") {
        //     setCreds({ instituteEmail: "", password: "" });
        // } else if (userType === "em") {
        //     setCreds({ email: "", password: "" });
        // }

    }, [userType]);
    const navigate = useNavigate();

    async function handleVerifyEmail() {
        setTimeLeft(60)
        TIMER_FUNC()
        try {
            let bodyParam;
            if (userType === "student") bodyParam = "userId"
            else if (userType === "institute") bodyParam = "instituteEmail"
            else if (userType === "em") bodyParam = "email"
            const response = await fetch(
                `${SERVER_ORIGIN}/api/${userType}/auth/send-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ [bodyParam]: email }),
                }
            );

            const result = await response.json();
            // const final_OTP = result.otp
            // setRespOTP(final_OTP)
            setIsAPIHitted(true)
            // console.log("asjfklasghasgj", final_OTP)
            if (response.status >= 400 && response.status < 600) {
                toast.error(result.statusText);
            } else if (response.ok && response.status === 200) {
                toast.success(result.statusText);
            } else {
                // Handle other cases if needed
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    function disableBtn() {
        setIsButtonDisabled(true)
    }

    const onVerifyHandler = async () => {
        // setIsAPIHitted(false)
        // setOTPIsAPIHitted(true)
        if (otp === "") {
            toast.error("Please enter OTP");
            setErrorMessage(true)
            return;
        }
        try {
            let bodyParam;
            if (userType === "student") bodyParam = "userId"
            else if (userType === "institute") bodyParam = "instituteEmail"
            else if (userType === "em") bodyParam = "email"
            console.log(bodyParam, userType)
            const response = await fetch(
                `${SERVER_ORIGIN}/api/${userType}/auth/send-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        [bodyParam]: email,
                        otp: otp,
                        source: "verify"
                    }),
                }
            );

            const result = await response.json();
            const final_OTP = result.otp
            setRespOTP(final_OTP)
            setIsAPIHitted(true)
            // console.log("asjfklasghasgj", final_OTP)
            if (response.status >= 400 && response.status < 600) {
                toast.error(result.statusText);
            } else if (response.ok && response.status === 200) {
                toast.success(result.statusText);
                navigate(`/set-password?email=${email}&userType=${userType}`)
            } else {
                toast.error(result.statusText);
            }
        } catch (err) {
            console.log(err.message);
        }

        // if (String(otp) === String(respOTP)) {
        //     // setErrorMessage(true)
        //     // console.log("hajdghajkhgkjahsgkjahsgkjahgskjagshkjasghkjasgh")
        //     navigate(`/user/set-password?email=${email}`);
        // } else {
        //     setErrorMessage(true)
        // }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        const userTypeParam = urlParams.get('userType');

        if (emailParam) {
            // Split the emailParam based on "?" and take the first part
            const email = emailParam.split('?')[0];
            setEmail(email);
        }
        // if (userTypeParam) {
        //     setUserType(userTypeParam);
        // }

        TIMER_FUNC();

        // Cleanup on unmount or when isAPIHitted changes
    }, [isAPIHitted]);

    async function TIMER_FUNC() {
        let intervalId;
        if (isAPIHitted) {
            // console.log(timeLeft, "adjgklajgkajsgkl")
            intervalId = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime === 0) {
                        clearInterval(intervalId);
                        setIsButtonDisabled(false)
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            // setOTPIsAPIHitted(false)
        }
        return () => clearInterval(intervalId);
    }

    // Start the timer when isAPIHitted becomes true
    // useEffect(() => {
    //     let intervalId;

    //     if (isOTPAPIHitted) {
    //         intervalId = setInterval(() => {
    //             setTimeLeft(prevTime => {
    //                 if (prevTime === 0) {
    //                     clearInterval(intervalId);
    //                     return 0;
    //                 }
    //                 return prevTime - 1;
    //             });
    //         }, 1000);
    //     }

    //     return () => clearInterval(intervalId); // Cleanup on unmount or when isAPIHitted changes
    // }, [isOTPAPIHitted]);
    function OnCancelHandler() {
        navigate("/");
    }
    return (
        <div >
            <div className={`${regisCss.verifyouterDiv} ${regisCss.outerDiv}`}>
                <SecCard>
                    <div>
                        <p className={css.passHeading}>Verify Email</p>
                        <div>
                            <div >
                                <div className="d-grid" style={{ marginBottom: "0.8rem" }}>
                                    <label className={`${regisCss.regisLabel}`} htmlFor="email">
                                        Email <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="Email"
                                        placeholder="E-mail"
                                        className={`${css.forgotPassInput} ${regisCss.regisInput} user-profile-user-id`}
                                        // className={css.forgotPassInput}
                                        value={email}
                                        inputMode="numeric"
                                    // readOnly
                                    />
                                </div>
                                <div>
                                    {isAPIHitted === true && <div className="">

                                        <div>
                                            <label className={`${regisCss.regisLabel} col-md-12 col-form-label`}>
                                                Enter OTP <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <OtpInput
                                                className="justify-content-space-between inputStyle"
                                                value={otp}
                                                onChange={setOtp}
                                                numInputs={4}
                                                separator={<span style={{ width: "25px" }}></span>}
                                                isInputNum={true}
                                                shouldAutoFocus={true}
                                                renderSeparator={
                                                    <span style={{ width: '15px' }}> </span>
                                                }
                                                renderInput={(props) => <input {...props}
                                                    type="number" pattern="[0-9]*" inputmode="numeric" required
                                                // style={{ appearance:'none' }}
                                                />}
                                                inputStyle={{
                                                    border: '1px solid #808080',
                                                    borderRadius: '0.4rem',
                                                    width: '80px',
                                                    height: 'auto',
                                                    fontSize: '18px',
                                                    borderColor: `${errorMessage ? 'red' : '#808080'}`,
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'textfield',
                                                    appearance: 'none',
                                                    fontWeight: '400',
                                                    '@media (maxWidth: 768px)': {
                                                        width: '54px',
                                                    },
                                                }}
                                                focusStyle={{
                                                    border: '1px solid #CFD3DB',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-between mt-3 align-items-center">
                                            <div>
                                                <p><b>00:{timeLeft}</b> left</p>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    Didn’t receive an OTP?
                                                    {/* </div>
                                                <div> */}
                                                    <button disabled={isButtonDisabled} className={``} style={{ backgroundColor: 'transparent', fontWeight: "700", marginLeft: '10px', color: '#0d5e9c', border: 'none', borderRadius: '10px' }} onClick={() => {
                                                        handleVerifyEmail();
                                                        disableBtn();
                                                    }}>
                                                        Resend OTP
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                                <div className={`${css.forgotPassBtnWrapper} d-flex justify-content-between`}>
                                    <button
                                        className={css.forgotPassCancelBtn}
                                        onClick={OnCancelHandler}
                                    >
                                        Cancel
                                    </button>
                                    {isAPIHitted === false ? <button
                                        className={css.forgotPassBtn}
                                        onClick={handleVerifyEmail}
                                    >
                                        Send OTP
                                    </button> : <button
                                        className={css.forgotPassBtn}
                                        onClick={onVerifyHandler}
                                    >
                                        Verify OTP
                                    </button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </SecCard>
            </div>
        </div>
    );
};

export default SetPasswordPage;

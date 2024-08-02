import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OtpInput from 'react-otp-input';

// My css
import css from "../../css/common/login-form.module.css";
import regisCss from "../../css/user/regis-page.module.css";
import SecCard from "../../components/common/SecCard";

import { SERVER_ORIGIN } from "../../utilities/constants";
// import { faL } from "@fortawesome/free-solid-svg-icons";
// import { decryptData } from "../../utilities/helper_functions";

const SetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [respOTP, setRespOTP] = useState('');
    const [errorMessage, setErrorMessage] = useState(false);
    const [isAPIHitted, setIsAPIHitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // Initial time left in seconds
    const [isOTPAPIHitted, setOTPIsAPIHitted] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)

    // const validateOtp = () => {
    //     const enteredOtp = otpInputs.join('');
    //     // You can replace this with your API response OTP
    //     const apiResponseOtp = '123456'; // Example OTP received from the API response

    //     if (enteredOtp === apiResponseOtp) {
    //         console.log('OTP is valid');
    //         // Perform further actions for successful OTP verification
    //     } else {
    //         console.log('Invalid OTP');
    //         setOtpError(true); // Set OTP error state
    //     }
    // };
    const navigate = useNavigate();

    async function handleVerifyEmail() {
        setTimeLeft(60)
        TIMER_FUNC()
        try {
            const response = await fetch(
                `${SERVER_ORIGIN}/api/student/auth/send-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 'userId': email }),
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
            const response = await fetch(
                `${SERVER_ORIGIN}/api/student/auth/send-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        'userId': email,
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
                navigate(`/user/set-password?email=${email}`)
            } else {
                // Handle other cases if needed
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

        if (emailParam) {
            setEmail(emailParam);
        }

        TIMER_FUNC()


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
                                        onClick={() => navigate('/')}
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

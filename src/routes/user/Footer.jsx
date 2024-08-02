import React from "react";
import { Link } from "react-router-dom";
// import {
//     BsFacebook,
//     BsInstagram,
//     BsLinkedin,
//     BsTwitter,
//     BsYoutube,
// } from "react-icons/bs";
import logo from "../../assets/images/yuva-logo-transparent.png";
import lnctLogo from "../../assets/images/lnct-logo-transparent.png";
import "../../css/user/footer.css";

const Footer = () => {
    return (
        <>
            <div className="u-footer-div">
                <div className="u-footer">
                    <div className="u-footer-main">
                        {/* Column 1 */}
                        <div className="u-footer-logo">
                            <img src={logo} alt="" className="u-yuva-logo" />
                        </div>
                        {/* Column 2 */}
                        <div className="u-footer-links">
                            <div className="u-footer-col">
                                <Link to={`/${sessionStorage.getItem('userType')}/services`} className="u-footer-link">
                                    Home
                                </Link>
                                <Link to={`/${sessionStorage.getItem('userType')}/about`} className="u-footer-link">
                                    Contact Us
                                </Link>
                            </div>
                            <div className="u-footer-col">
                                <Link to={`${sessionStorage.getItem('userType') === 'admin' ? "/privacyPolicy" : "/privacy-policy"}`} className="u-footer-link">
                                    Privacy Policy
                                </Link>
                                <Link to={`${sessionStorage.getItem('userType') === 'admin' ? "/tnc" : "/termsnconditions"}`} className="u-footer-link">
                                    Terms and Conditions
                                </Link>
                            </div>
                        </div>
                        {/* Column 3 */}
                        <div className="u-footer-lnct">
                            <div className="u-footer-logo">
                                <img
                                    src={lnctLogo}
                                    alt=""
                                    className="u-yuva-logo"
                                />
                            </div>
                            <h1>
                                Developed and Maintained by <br />
                                Yuva LNCT
                            </h1>
                        </div>
                    </div>
                    <div className="u-footer-section">
                        <span>
                            Copyright ©️ 2024 Yuva Portal - All Rights Reserved.
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;

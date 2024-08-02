import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SERVER_ORIGIN } from "../../utilities/constants";
import "../../css/user/user-profile.css";
import { useUserType } from './UserTypeContext';
import css from "../../css/admin/user-single-page.module.css";
import { Row, Col } from "react-bootstrap";

const InstituteForm = () => {
    const { userType, setUserTypeToInstitute } = useUserType();
    // setUserTypeToInstitute()
    // const [userType, setUserType] = useState('')
    const navigate = useNavigate();
    // You can use state to manage user information and form fields
    const [user, setUser] = useState({
    });

    // Load user data when the component mounts
    useEffect(() => {
        // get the user from database.
        const verifyToken = async () => {
            // const userId = process.env.REACT_APP_USER_ID;
            // const userPassword = process.env.REACT_APP_USER_PASSWORD;
            //  const basicAuth = btoa(`${userId}:${userPassword}`);
            let bodyParam;
            let URLParam;
            // console.log(userType, "ashgjashgjahsgkja")
            if (userType === "student") { bodyParam = "userId"; URLParam = "student"; }
            else if (userType === "institute") { bodyParam = "instituteEmail"; URLParam = "institute"; }
            else if (userType === "em") { bodyParam = "email"; URLParam = "em"; }
            const response = await fetch(
                `${SERVER_ORIGIN}/api/institute/auth/verify-token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": sessionStorage.getItem("token"),
                        //Authorization: `Basic ${basicAuth}`,
                    },
                }
            );
            const result = await response.json();
            if (result.userDoc) {
                setUser(result.userDoc);
            } else {
                toast.error("Please login to continue");
                navigate(`/login?userType=${userType}`);
            }
        };

        verifyToken();
    }, [navigate, userType]);
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const typeParam = urlParams.get('userType');

        if (typeParam) {
            // setUserType(typeParam);
        }
    }, []);

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };
    const isPhoneSyntaxValid = (phone) => {
        var phoneNum = phone.replace(/[^\d]/g, "");

        if (
            !/^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(
                phone
            )
        ) {
            return false;
        }

        if (phoneNum.length > 6 && phoneNum.length < 11) {
            return true;
        }

        return false;
    };

    // const mapGenderValue = (value) => {
    //   if (value === "Male") {
    //     return "M";
    //   } else if (value === "Female") {
    //     return "F";
    //   } else if (value === "Prefer not to say") {
    //     return "O";
    //   }
    //   return "";
    // };
    const handleSubmit = async (e) => {
        // e.preventDefault();
        // if (validateFields()) {
        //send request
        const userId = process.env.REACT_APP_USER_ID;
        const userPassword = process.env.REACT_APP_USER_PASSWORD;
         const basicAuth = btoa(`${userId}:${userPassword}`);
        const response = await fetch(
            `${SERVER_ORIGIN}/api/institute/auth/update-user`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": sessionStorage.getItem("token"),
                   Authorization: `Basic ${basicAuth}`,
                },
                body: JSON.stringify(user),
            }
        );
        const result = await response.json();
        if (result.userDoc) {
            toast.success(`Profile updated successfully`);
            return;
        }
        toast.error("Some error occured, please try again later");
        // }
    };
    const [isLoading, setIsLoading] = useState(true);
    let keys = [];

    if (!isLoading && user) {
        keys = Object.keys(user?.activity);
    }

    // const navigate = useNavigate();
    return (
        <Row>
            <Col>
                <div className="outerDiv">
                    <form className="user-profile-form" onSubmit={handleSubmit}>
                        <h1 className="user-profile-title">Institute Profile</h1>
                        <div className="user-profile-grid">
                            {/* Personal Information */}
                            <div className="user-profile-section">
                                <label className="user-profile-label" htmlFor="name">
                                    Name <span style={{ color: "red" }}>*</span>{" "}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="user-profile-input"
                                    name="name"
                                    value={user.name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="user-profile-section">
                                <label className="user-profile-label" htmlFor="officerName">
                                    Nodal Officer Name
                                </label>
                                <input
                                    type="text"
                                    id="officerName"
                                    className="user-profile-input"
                                    name="officerName"
                                    value={user.officerName}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="user-profile-section">
                                <label className="user-profile-label" htmlFor="officerEmail">
                                    Nodal Officer Email <span style={{ color: "red" }}>*</span>{" "}
                                </label>
                                <input
                                    type="email"
                                    id="officerEmail"
                                    className="user-profile-input"
                                    name="officerEmail"
                                    value={user.officerEmail}
                                    onChange={handleInputChange}
                                    readOnly
                                />
                            </div>

                            {/* Add similar input fields for other personal information */}

                            <div className="user-profile-section">
                                <label className="user-profile-label" htmlFor="officerNumber">
                                    Nodal Officer Number
                                    {/* <span style={{ color: "red" }}>*</span> */}
                                </label>
                                <input
                                    type="text"
                                    id="officerNumber"
                                    className="user-profile-input"
                                    name="officerNumber"
                                    value={user.officerNumber}
                                    onChange={handleInputChange}
                                    maxLength={10}
                                    readOnly
                                />
                            </div>
                            <div className="user-profile-section">
                                <label className="user-profile-label" htmlFor="designation">
                                    Designation
                                    {/* <span style={{ color: "red" }}>*</span> */}
                                </label>
                                <input
                                    type="text"
                                    id="designation"
                                    className="user-profile-input"
                                    name="designation"
                                    value={user.designation}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {/* Email (Non-editable) */}


                            {/* User ID (Non-editable) */}



                            {/* Contact Information */}

                            {/* Add similar input fields for address information */}

                            <div className="user-profile-section">
                                <label className="user-profile-label" htmlFor="city">
                                    City <span style={{ color: "red" }}>*</span>{" "}
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    className="user-profile-input"
                                    name="city"
                                    value={user.city}
                                    onChange={handleInputChange}
                                    readOnly
                                />
                            </div>

                            <div className="user-profile-section">
                                <label className="user-profile-label" htmlFor="country">Country <span style={{ color: "red" }}>*</span> </label>
                                <input
                                    type="text"
                                    id="country"
                                    className="user-profile-input"
                                    name="country"
                                    value={user.country}
                                    onChange={handleInputChange}
                                    readOnly
                                />
                            </div>

                        </div>

                        <div style={{ textAlign: "center", margin: "2rem" }}>
                            <button className="user-profile-button" type="submit">
                                Save Changes
                            </button>
                        </div>
                    </form>

                </div>
            </Col>
        </Row>
    )
}

export default InstituteForm
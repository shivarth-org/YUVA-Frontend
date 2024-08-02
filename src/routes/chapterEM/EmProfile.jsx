import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SERVER_ORIGIN } from "../../utilities/constants";
import "../../css/user/user-profile.css";
import css from "../../css/admin/user-single-page.module.css";

const EmProfile = () => {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        regionalManagerName: "",
        email: "",
        designation: "",
        chapterName: "",
        number: "",
        country: "",
        state: "",
        city: "",
    });

    useEffect(() => {
        const verifyToken = async () => {
            const response = await fetch(
                `${SERVER_ORIGIN}/api/em/auth/verify-token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": sessionStorage.getItem("token"),
                    },
                }
            );
            const result = await response.json();
            if (!result) {
                toast.error("Please login to continue");
            } else {

                // navigate("/login?userType=institute");
            }
        };

        verifyToken();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(
            `${SERVER_ORIGIN}/api/em/auth/update-user/${_id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": sessionStorage.getItem("token"),
                },
                body: JSON.stringify(user),
            }
        );
        const result = await response.json();
        if (result.userDoc) {
            toast.success(`Profile updated successfully`);
            navigate("em/all")
        }
        toast.error("Some error occurred, please try again later");
    };

    useEffect(() => {
        async function getAllUsers() {
            try {
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/em/auth/users/${_id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                        },
                    }
                );

                const result = await response.json();
                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        // navigate("/");
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    // console.log(result.user,"result.user");
                    setUser(result.user);
                }
            } catch (err) {
                console.error(err.message);
            }
        }

        getAllUsers();
    }, [_id, navigate]);

    return (
        <div className="outerDiv">
            <h1 className="user-profile-title">EM Profile</h1>
            <form className="user-profile-form" onSubmit={handleSubmit}>
                <div className="user-profile-grid">
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
                        <label className="user-profile-label" htmlFor="regionalManagerName">
                            CII Regional Director
                        </label>
                        <input
                            type="text"
                            id="regionalManagerName"
                            className="user-profile-input"
                            name="regionalManagerName"
                            value={user.regionalManagerName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="user-profile-section">
                        <label className="user-profile-label" htmlFor="email">
                            Email <span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="user-profile-input"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            readOnly
                        />
                    </div>
                    <div className="user-profile-section">
                        <label className="user-profile-label" htmlFor="designation">
                            Designation
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
                    <div className="user-profile-section">
                        <label className="user-profile-label" htmlFor="chapterName">
                            Chapter Name
                        </label>
                        <input
                            id="chapterName"
                            className="user-profile-input"
                            name="chapterName"
                            value={user.chapterName}
                            onChange={handleInputChange}
                            readOnly
                        />
                    </div>
                    <div className="user-profile-section">
                        <label className="user-profile-label" htmlFor="number">
                            Number <span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                            type="text"
                            id="number"
                            className="user-profile-input"
                            name="number"
                            value={user.number}
                            onChange={handleInputChange}
                            maxLength={10}
                            readOnly
                        />
                    </div>
                    <div className="user-profile-section">
                        <label className="user-profile-label" htmlFor="country">
                            Country <span style={{ color: "red" }}>*</span>{" "}
                        </label>
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
                    <div className="user-profile-section">
                        <label className="user-profile-label" htmlFor="state">
                            State <span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                            type="text"
                            id="state"
                            className="user-profile-input"
                            name="state"
                            value={user.state}
                            onChange={handleInputChange}
                            readOnly
                        />
                    </div>
                    <div className="user-profile-section">
                        <label className="user-profile-label" htmlFor="city">
                            city <span style={{ color: "red" }}>*</span>{" "}
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
                </div>
                <div style={{ textAlign: "center", margin: "2rem" }}>
                    <button className="user-profile-button" type="submit">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmProfile;

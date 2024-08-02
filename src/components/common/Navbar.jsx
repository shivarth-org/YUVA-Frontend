import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/images/yi_logo.png";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLoginClick = (e) => {
        navigate("/login");
    };

    const handleLogoutClick = (e) => {
        sessionStorage.removeItem("token");
        navigate("/login?userType=student");
    };

    return (
        <nav
            style={{
                backgroundColor: "white",
                padding: "0.7% 3%",
                boxShadow: "0 0.3rem 0.25rem -0.25rem rgb(0,0,0,0.2)",
            }}
            className="navbar navbar-expand-lg fixed-top"
        >
            <img
                src={img}
                alt=""
                style={{ width: "5.5%", marginRight: "2%" }}
            />
            <button
                type="button"
                className="navbar-toggler"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul
                    className="navbar-nav mr-auto text-ff1"
                    style={{ fontWeight: "100" }}
                >
                    <li className="nav-item active">
                        <Link
                            className="nav-link active"
                            to="/"
                            style={{ fontWeight: "400" }}
                        >
                            Home
                        </Link>
                    </li>
                    <li className="nav-item active">
                        <Link
                            className="nav-link active"
                            to="/user/verticals/all"
                            style={{ fontWeight: "400" }}
                        >
                            Verticals
                        </Link>
                    </li>
                    <li className="nav-item active">
                        <Link
                            className="nav-link active"
                            to="/about"
                            style={{ fontWeight: "400" }}
                        >
                            About
                        </Link>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto">
                    <button
                        className="text-ff1 navbar-right"
                        style={{
                            backgroundColor: "var(--light-grey)",
                            color: "white",
                            borderRadius: "0.3rem",
                            height: "2.2rem",
                            width: "fit-content",
                            padding: "0 1rem 0 1rem",
                            border: "none",
                        }}
                        onClick={
                            !sessionStorage.getItem("token")
                                ? handleLoginClick
                                : handleLogoutClick
                        }
                    >
                        {!sessionStorage.getItem("token") ? "Login" : "Logout"}
                    </button>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

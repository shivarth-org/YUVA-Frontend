import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/images/yi_logo.png";
import { useUserType } from "../../routes/common/UserTypeContext";

// My css
import css from "../../css/admin/navbar.module.css";

const Navbar = () => {
  const { userType, setUserTypeToAdmin,
    setUserTypeToUser,
    setUserTypeToInstitute,
    setUserTypeToChapterEM,
  } = useUserType();
  const navigate = useNavigate();
  const [isUserTypeAvailable, setIsUserTypeAvailable] = useState()
  const [user, setUser]=useState('')
  const handleLoginClick = (e) => {
    navigate("/admin/login");
  };

  const handleLogoutClick = (e) => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userType");
    navigate("/");
  };
  useEffect(() => {
    setUser(sessionStorage.getItem('userType'))
    if (!userType) {
      setIsUserTypeAvailable(false)
    }
    if (!isUserTypeAvailable) {
      // const urlParams = new URLSearchParams(window.location.search);
      let typeParam = sessionStorage.getItem('userType');

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

  }, []);
  function handleImgClick() {
    navigate(`/${user}/services`);
  }
  function handleServiceClick() {
    console.log("service-->>>", `/${user}/services`);
    navigate(`/${user}/services`);
  }
  const listItemStyle = { fontSize: "0.9rem", fontWeight: "400" };

  return (
    <nav className={`${css.outerNav} navbar navbar-expand-lg fixed-top`}>
      <img src={img} alt="yi-logo" className={css.yiImg} onClick={handleImgClick} />
      <button
        type="button"
        className="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarCollapse">
        <ul className="navbar-nav mr-auto text-ff1">
          <li className="nav-item active">
            {sessionStorage.getItem("token") &&
              <div
                className="nav-link active nav-services"
                // to={`/${userType}/services`}
                style={listItemStyle}
                onClick={handleServiceClick}
              >
                Services
              </div>
            }
          </li>
        </ul>

        <ul className="navbar-nav ms-auto">
          {sessionStorage.getItem("token") ? (
            <button
              className={`${css.navBtn} text-ff1 navbar-right`}
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

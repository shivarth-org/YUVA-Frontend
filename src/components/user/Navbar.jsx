import { React, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/images/yi_logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-hot-toast";
import UserTypeModal from "../common/UserTypeModal";
// My css
import css from "../../css/user/navbar.module.css";
import { SERVER_ORIGIN } from "../../utilities/constants";
import {useUserType  } from '../../routes/common/UserTypeContext';


const Navbar = () => {
  const { userType, setUserTypeToAdmin, setUserTypeToUser, setUserTypeToInstitute,
    setUserTypeToChapterEM } = useUserType();
  const navigate = useNavigate();
  const [isUserTypeAvailable, setIsUserTypeAvailable] = useState()
  const [user, setUser] = useState('')
  const [isOpen, setIsOpen] = useState(false);
  // const [email, setEmail] = useState('');
  // const [userType, setuserType] = useState(null)

  // export default Example;
  // const handleLoginClick = (e) => {
  //   // navigate("/login");
  // };
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
  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };
  const handleLogoutClick = (e) => {
    window.location.reload();
    navigate(`/login?userType=${userType}`);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userType");
    toast.success("Logged out successfully");
  };

  const handleProfileClick = () => {
    navigate(`/profile?userType=${user}`);
  }
  const handleServiceClick = () => {
    navigate(`/${user}/services`);
  }

  // useEffect(() => {
  //   if (!userType) {
  //     setUserTypeToInstitute();
  //   }
  // }, [userType, setUserTypeToInstitute]);

  const listItemStyle = { fontSize: "0.9rem", fontWeight: "400" };

  return (
    <nav className={`${css.outerNav} navbar navbar-expand-lg fixed-top`}>
      <div style={{ marginRight: "1rem" }}>
        <img src={img} alt="yi-logo" className={css.yiImg} />
      </div>
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
          {(sessionStorage.getItem("userType") === 'student') && (
            <>
              <li className="nav-item active">
                <Link className="nav-link active" to="/" style={listItemStyle}>
                  Home
                </Link>
              </li>
              <li className="nav-item active">
                <Link
                  className="nav-link active"
                  to="/user/verticals/all"
                  style={listItemStyle}
                >
                  Verticals
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link active" to="/about" style={listItemStyle}>
                  About
                </Link>
              </li>
            </>
          )}
          {(user === 'em' || user === 'admin') && (
            <li className="nav-item active">
              <div
                className="nav-link active nav-services"
                onClick={handleServiceClick}
                style={listItemStyle}
              >
                Services
              </div>
            </li>
          )}
          {(user === 'institute') && (
            <li className="nav-item active">
              <div
                className="nav-link active nav-services"
                onClick={handleServiceClick}
                style={listItemStyle}
              >
                Services
              </div>
            </li>
          )}
        </ul>
        <ul className="navbar-nav ms-auto">
          {sessionStorage.getItem("token") ? (
            <>
              {sessionStorage.getItem("userType") === 'em' || sessionStorage.getItem("userType") === 'admin'  ? <></> :
                <button
                  className={`${css.navBtn} text-ff1 navbar-right`}
                  onClick={handleProfileClick}
                >
                  My Profile <FontAwesomeIcon icon={faUser} style={{ color: "white", marginLeft: "4px" }} />
                </button>
              }

              <button
                className={`${css.navBtn} text-ff1 navbar-right`}
                onClick={handleLogoutClick}
              >
                Logout
              </button>
              {/* <UserTypeModal show={isOpen} onHide={handleButtonClick} text={"Logout"} onClick={handleLogoutClick} /> */}
            </>
          ) : (
            <>
              <UserTypeModal show={isOpen} onHide={handleButtonClick} text={"Login"} onClick={handleButtonClick} />
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

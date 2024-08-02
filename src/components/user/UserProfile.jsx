import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SERVER_ORIGIN } from "../../utilities/constants";
import "../../css/user/user-profile.css";
import css from "../../css/admin/user-single-page.module.css";

const UserProfile = () => {
  const navigate = useNavigate();
  // You can use state to manage user information and form fields
  const [user, setUser] = useState({
    fName: "",
    mName: "",
    lName: "",
    email: "",
    age: "",
    gender: "",
    userId: "",
    branch: "",
    phone: "",
    addLine1: "",
    addLine2: "",
    city: "",
    pincode: "",
    country: "",
  });

  // Load user data when the component mounts
  useEffect(() => {
    // get the user from database.
    const verifyToken = async () => {
      const userId = process.env.REACT_APP_USER_ID;
      const userPassword = process.env.REACT_APP_USER_PASSWORD;
       const basicAuth = btoa(`${userId}:${userPassword}`);
      const response = await fetch(
        `${SERVER_ORIGIN}/api/student/auth/verify-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem("token"),
            Authorization: `Basic ${basicAuth}`,
          },
        }
      );
      const result = await response.json();
      if (result.userDoc) {
        setUser(result.userDoc);
      } else {
        toast.error("Please login to continue");
        navigate("/login?userType=student");
      }
    };

    verifyToken();
  }, [navigate]);

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

  const validateFields = () => {
    if (user.fName.length < 3) {
      toast.error("First Name is invalid");
      return false;
    }
    if (user.lName.length < 3) {
      toast.error("Last Name is invalid");
      return false;
    }
    if (!isPhoneSyntaxValid(user.phone)) {
      toast.error("Phone is invalid");
      return false;
    }
    if (user.collegeName.length < 2) {
      toast.error("College name is invalid");
      return false;
    }
    if (user.branch.length < 2) {
      toast.error("Branch name is invalid");
      return false;
    }
    if (user.addLine1.length < 4) {
      toast.error("Address Line 1 should be of atleast 4 characters");
      return false;
    }
    if (user.city.length < 2) {
      toast.error("City name is invalid");
      return false;
    }
    if (user.pincode.length !== 6) {
      toast.error("Pincode is invalid");
      return false;
    }
    if (user.country.length < 2) {
      toast.error("Country is invalid");
      return false;
    }
    // if (user.age == "") {
    //   toast.error("Age is required");
    //   return false;
    // }
    // if ((user.gender !== "M" && user.gender !== "F" && user.gender !== "O")) {
    //   toast.error("Please select a valid gender");
    //   return false;
    // }
    return true;
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (validateFields()) {
      //send request
      const userId = process.env.REACT_APP_USER_ID;
      const userPassword = process.env.REACT_APP_USER_PASSWORD;
       const basicAuth = btoa(`${userId}:${userPassword}`);
      const response = await fetch(
        `${SERVER_ORIGIN}/api/student/auth/update-user`,
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
    }
  };

  // const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  let keys = [];

  if (!isLoading && user) {
    keys = Object.keys(user?.activity);
  }

  // const navigate = useNavigate();

  useEffect(() => {
    async function getAllUsers() {
      try {
        // const adminId = process.env.REACT_APP_ADMIN_ID;
        // const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
        // const basicAuth = btoa(`${adminId}:${adminPassword}`);
        const response = await fetch(
          `${SERVER_ORIGIN}/api/student/auth/users/${sessionStorage.getItem('_id')}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Basic ${basicAuth}`,
              "auth-token": sessionStorage.getItem("token"),
            },
          }
        );

        const result = await response.json();

        if (response.status >= 400 && response.status < 600) {
          if (response.status === 401) {
            navigate("/");
          } else if (response.status === 500) {
            toast.error(result.statusText);
          }
        } else if (response.ok && response.status === 200) {
          setUser(result.user);
          setIsLoading(false);
        } else {
          // for future
        }
      } catch (err) {
        // (err.message);
        setIsLoading(false);
      }
    }

    getAllUsers();
  }, [navigate]);

  return (
    <div className="outerDiv">
      <h1 className="user-profile-title">User Profile</h1>
      <form className="user-profile-form" onSubmit={handleSubmit}>
        <div className="user-profile-grid">
          {/* Personal Information */}
          <div className="user-profile-section">
            <label className="user-profile-label" htmlFor="fName">
              First Name <span style={{ color: "red" }}>*</span>{" "}
            </label>
            <input
              type="text"
              id="fName"
              className="user-profile-input"
              name="fName"
              value={user.fName}
              onChange={handleInputChange}
            />
          </div>

          <div className="user-profile-section">
            <label className="user-profile-label" htmlFor="mName">
              Middle Name
            </label>
            <input
              type="text"
              id="mName"
              className="user-profile-input"
              name="mName"
              value={user.mName}
              onChange={handleInputChange}
            />
          </div>

          <div className="user-profile-section">
            <label className="user-profile-label" htmlFor="lName">
              Last Name <span style={{ color: "red" }}>*</span>{" "}
            </label>
            <input
              type="text"
              id="lName"
              className="user-profile-input"
              name="lName"
              value={user.lName}
              onChange={handleInputChange}
            />
          </div>

          {/* Add similar input fields for other personal information */}

          <div className="user-profile-section">
            <label className="user-profile-label" htmlFor="age">
              Age
              {/* <span style={{ color: "red" }}>*</span> */}
            </label>
            <input
              type="text"
              id="age"
              className="user-profile-input"
              name="age"
              value={user.age}
              onChange={handleInputChange}
            />
          </div>

          <div className="user-profile-section">
            <label className="user-profile-label" htmlFor="gender">
              Gender
              {/* <span style={{ color: "red" }}>*</span> */}
            </label>
            <select
              id="gender"
              className="user-profile-input"
              name="gender"
              value={user.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Prefer not to say</option>
            </select>
          </div>

          {/* Email (Non-editable) */}
          <div className="user-profile-section user-profile-non-editable">
            <label className="user-profile-label">Email</label>
            <p className="user-profile-email">{user.email}</p>
          </div>

          {/* User ID (Non-editable) */}
          <div className="user-profile-section user-profile-non-editable">
            <label className="user-profile-label">User ID</label>
            <p className="user-profile-user-id">{user.userId}</p>
          </div>


          {/* Contact Information */}
          <div className="user-profile-section">
            <label className="user-profile-label" htmlFor="phone">
              {" "}
              Phone <span style={{ color: "red" }}>*</span>{" "}
            </label>
            <input
              type="text"
              id="phone"
              className="user-profile-input"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
            />
          </div>

          {/* <div className="user-profile-section">
            <label className="user-profile-label" htmlFor="collegeName">
              College Name <span style={{ color: "red" }}>*</span>{" "}
            </label>
            <input
              type="text"
              id="collegeName"
              className="user-profile-input"
              name="collegeName"
              value={user.collegeName}
              onChange={handleInputChange}
              disabled
            />
          </div> */}
          {/* Email (Non-editable) */}
          <div className="user-profile-section user-profile-non-editable">
            <label className="user-profile-label">College Name</label>
            <p className="user-profile-email">{user.collegeName}</p>
          </div>

          <div className="user-profile-section">
            <label className="user-profile-label" htmlFor="branch">Branch <span style={{ color: "red" }}>*</span> </label>
            <input
              type="text"
              id="branch"
              className="user-profile-input"
              name="branch"
              value={user.branch}
              onChange={handleInputChange}
            />
          </div>

          {/* Add similar input fields for contact information */}

          {/* Address Information */}
          <div className="user-profile-section">
            <label className="user-profile-label" htmlFor="addLine1">Address Line 1 <span style={{ color: "red" }}>*</span> </label>
            <input
              type="text"
              id="addLine1"
              className="user-profile-input"
              name="addLine1"
              value={user.addLine1}
              onChange={handleInputChange}
            />
          </div>

          <div className="user-profile-section">
            <label className="user-profile-label" htmlFor="addLine2">Address Line 2</label>
            <input
              type="text"
              id="addLine2"
              className="user-profile-input"
              name="addLine2"
              value={user.addLine2}
              onChange={handleInputChange}
            />
          </div>

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
            />
          </div>

          <div className="user-profile-section">
            <label className="user-profile-label" htmlFor="pincode">Pincode <span style={{ color: "red" }}>*</span> </label>
            <input
              type="text"
              id="pincode"
              className="user-profile-input"
              name="pincode"
              value={user.pincode}
              onChange={handleInputChange}
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
            />
          </div>
        </div>
        <div style={{ textAlign: "center", margin: "2rem" }}>
          <button className="user-profile-button" type="submit">
            Save Changes
          </button>
        </div>
      </form>
      <div className={css.userCertDiv}>
        <div className={css.userCertHeading}>
          <h1>Certifications Unlocked</h1>
        </div>
        <div className={css.userCertCount}>
          {keys.map((k) => (
            <>
              <div className={css.userCertItem}>
                <span
                  className={css.userCertItemHeading}
                >
                  {k}
                </span>
                <span className={css.userCertDesc}>
                  {user?.activity[k]}
                </span>
              </div>
              <div className={css.hr}></div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import axios from "axios";
import { Country, State, City } from 'country-state-city';

// My components
import SecCard from "../../components/common/SecCard";

// My css
import regisCss from "../../css/user/regis-page.module.css";
import "../../css/user/regis-page.module.css";

import { SERVER_ORIGIN, vars, validation } from "../../utilities/constants";
import { isRegisFormValid } from "../../utilities/helper_functions";

const GreenMsg = (props) => {
    return (
        <>
            {" "}
            |{" "}
            <span style={{ color: "green", fontWeight: "600" }}>
                {props.children}
            </span>
        </>
    );
};

const RedMsg = (props) => {
    return (
        <>
            {" "}
            |{" "}
            <span style={{ color: "red", fontWeight: "600" }}>
                {props.children}
            </span>
        </>
    );
};

const YearPicker = ({ selectedYear, handleYearChange }) => {
    const handleChange = (date) => {
        if (date) {
            handleYearChange({ target: { name: "passOutYear", value: date.getFullYear().toString() } });
        }
    };

    return (
        <DatePicker
            selected={selectedYear ? new Date(selectedYear, 0) : null}
            onChange={handleChange}
            showYearPicker
            dateFormat="yyyy"
            className={`${regisCss.regisInput} w-100`}
            placeholderText="Select your passout year"


        />
    );
};

const UserRegis = (props) => {
    const { _id } = useParams()

    const [selectedOption, setSelectedOption] = useState(null);
    const [defaultOptions, setDefaultOptions] = useState([]);

    const loadOptions = async (inputValue, callback) => {
        try {
            const params = {
                search: inputValue,
                page: 1,
                limit: 10,
                sortBy: "name",
                sortType: "asc"
            };

            // Conditionally add the id parameter if _id is not 0
            if (_id !== 'no_id') {
                params.id = _id;
            }
            const response = await axios.get(`${SERVER_ORIGIN}/api/institute/auth/institute/all`, {
                params
            });
            const options = response.data.filteredInstitutes.map(institute => ({
                label: institute.name,
                value: institute._id,
                state: institute.state,
                city: institute.city
            }));
            callback(options);
        } catch (error) {
            console.error("Error fetching institutes", error);
        }
    };

    useEffect(() => {
        const fetchDefaultOptions = async () => {
            try {
                const response = await axios.get(`${SERVER_ORIGIN}/api/institute/auth/institute/all`, {
                    params: {
                        search: '',
                        page: 1,
                        limit: 5,
                        sortBy: "name",
                        sortType: "asc",
                        id: _id
                    }
                });
                const options = response.data.filteredInstitutes.map(institute => ({
                    label: institute.name,
                    value: institute._id,
                    state: institute.state,
                    city: institute.city
                }));
                setDefaultOptions(options);
            } catch (error) {
                console.error("Error fetching default options", error);
            }
        };

        fetchDefaultOptions();
    }, []);

    const [regisForm, setRegisForm] = useState({
        userId: "",
        email: "",
        fName: "",
        mName: "",
        lName: "",
        collegeName: "",
        region: "",
        gender: "",
        branch: "",
        phone: "",
        addLine1: "",
        addLine2: "",
        city: "",
        pincode: "",
        country: "India",
        state: "",
        passOutYear: "",
        createdBy: handelCreatedBy()
    });
    function handelCreatedBy() {
        if (sessionStorage.getItem('token') !== null) {
            return sessionStorage.getItem('_id')
        } else {
            return ""
        }
    }
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    const [isUserIdAvailable, setIsUserIdAvailable] = useState(false);
    const [wasUserIdAvailabilityChecked, setWasUserIdAvailabilityChecked] = useState(false);
    let userIdAvailabilityCheckTimer = null;
    const userIdAvailabilityCheckDelayInMilliSec = 1000;

    const checkUserIdAvailability = async () => {
        if (regisForm.userId === "") {
            return;
        }

        try {
            const userId = "utkarsh@troology.in";
            const userPassword = "Redhood@23"
            const basicAuth = btoa(`${userId}:${userPassword}`);
            const response = await fetch(`${SERVER_ORIGIN}/api/student/auth/check-userid-availability`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${basicAuth}`,
                },
                body: JSON.stringify({ userId: regisForm.userId }),
            });

            const result = await response.json();
            if (response.status >= 400 && response.status < 600) {
                if (response.status === 500) {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                setWasUserIdAvailabilityChecked(true);
                setIsUserIdAvailable(result.isUserIdAvailable);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleRegisterClick = async () => {
        if (isBtnDisabled) return; // Prevent double-clicks
        setIsBtnDisabled(true); // Disable button immediately

        const { isValid, desc } = isRegisFormValid(regisForm);
        if (!isValid) {
            toast.error(desc);
            setIsBtnDisabled(false); // Re-enable button if validation fails
            return;
        }

        try {
            setIsRegistering(true);
            setIsBtnDisabled(true);
            const userId = "utkarsh@troology.in";
            const userPassword = "Redhood@23"
            const basicAuth = btoa(`${userId}:${userPassword}`);

            const response = await fetch(`${SERVER_ORIGIN}/api/student/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${basicAuth}`,
                },
                body: JSON.stringify(regisForm),
            });

            const result = await response.json();

            setIsRegistering(false);
            setIsBtnDisabled(false);

            if (response.ok && response.status === 200) {
                toast.success(result.statusText);
                if (sessionStorage.getItem("userType")) {
                    navigate("/institute/students/all");
                    window.location.reload()
                } else {
                    navigate("/");
                }

            } else {
                toast.error(result.statusText);
            }
        } catch (err) {
            console.error(err.message);
            setIsBtnDisabled(false); // Re-enable button on error
        }
    };

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    useEffect(() => {
        const indianStates = State.getStatesOfCountry('IN');
        setStates(indianStates.map(state => ({ label: state.name, value: state.isoCode })));
    }, []);

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        const stateCities = City.getCitiesOfState('IN', selectedOption.value);
        setCities(stateCities.map(city => ({ label: city.name, value: city.name })));
        setSelectedCity(null);
        setRegisForm(prevForm => ({ ...prevForm, state: selectedOption.label, city: '' }));
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        setRegisForm(prevForm => ({ ...prevForm, city: selectedOption.label }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'email') {
            regisForm.userId = value; // update userId when email changes
        }
        setRegisForm({ ...regisForm, [e.target.name]: e.target.value });

    };

    const handleUserIdChange = (e) => {
        handleInputChange(e);
        setWasUserIdAvailabilityChecked(false);
        clearTimeout(userIdAvailabilityCheckTimer);
        userIdAvailabilityCheckTimer = setTimeout(checkUserIdAvailability, userIdAvailabilityCheckDelayInMilliSec);
    };
    const UserIdAvailabilityMsg = (props) => {
        return wasUserIdAvailabilityChecked ? (
            isUserIdAvailable ? (
                <GreenMsg>Available</GreenMsg>
            ) : (
                <RedMsg>Not available</RedMsg>
            )
        ) : null;
    };
    return (
        <div className={regisCss.outerDiv}>
            <SecCard>
                <h2 className="text-ff1">Registration</h2>

                <div className="text-ff2" autoComplete="on">
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="email">
                            Email <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={regisForm.email}
                            onChange={handleInputChange}
                            autoComplete="on"
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="fName">
                            First name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="fName"
                            name="fName"
                            placeholder="Enter your first name"
                            autoComplete="on"
                            maxLength={validation.authForm.fName.maxLen}
                            value={regisForm.fName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="mName">
                            Middle name
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="mName"
                            name="mName"
                            placeholder="Enter your middle name"
                            autoComplete="on"
                            maxLength={validation.authForm.mName.maxLen}
                            value={regisForm.mName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="lName">
                            Last name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="lName"
                            name="lName"
                            placeholder="Enter your last name"
                            autoComplete="on"
                            maxLength={validation.authForm.lName.maxLen}
                            value={regisForm.lName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={regisCss.regisLabel}
                            htmlFor="collegeName"
                        >
                            Institute Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <AsyncSelect
                            cacheOptions
                            loadOptions={loadOptions}
                            defaultOptions={defaultOptions}
                            onChange={(selectedOption) => {
                                if (selectedOption) {
                                    const stateOption = states.find(state => state.label === selectedOption.state);
                                    setSelectedState(stateOption);

                                    const stateCities = City.getCitiesOfState('IN', stateOption.value);
                                    setCities(stateCities.map(city => ({ label: city.name, value: city.name })));

                                    const cityOption = { label: selectedOption.city, value: selectedOption.city };
                                    setSelectedCity(cityOption);

                                    setRegisForm(prevForm => ({
                                        ...prevForm,
                                        collegeName: selectedOption.label,
                                        state: selectedOption.state,
                                        city: selectedOption.city
                                    }));
                                    setSelectedOption(selectedOption);
                                }
                            }}
                            value={selectedOption}
                            placeholder="Enter your institute name"
                        />

                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="branch">
                            Branch  <span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="branch"
                            name="branch"
                            placeholder="Enter your branch"
                            autoComplete="on"
                            maxLength={validation.authForm.branch.maxLen}
                            value={regisForm.branch}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="passOutYear">
                            Passout Year  <span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <div className="w-100">
                            <YearPicker
                                selectedYear={regisForm.passOutYear}
                                handleYearChange={handleInputChange}
                                className='w-100'
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="phone">
                            Phone <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Enter your phone number"
                            autoComplete="on"
                            maxLength={validation.authForm.phone.maxLen}
                            value={regisForm.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="gender">
                            Gender
                            {/* <span style={{ color: "red" }}>*</span> */}
                        </label>
                        <select
                            id="gender"
                            className={`${regisCss.regisInput} py-0`}
                            name="gender"
                            value={regisForm.gender}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Prefer not to say</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                        <label className={regisCss.regisLabel} htmlFor="country">Country <span style={{ color: 'red' }}>*</span></label>
                        <input
                            id="country"
                            className={regisCss.regisInput}
                            value={"India"}
                            readOnly
                            isDisabled
                        >
                        </input>
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                        <label className={regisCss.regisLabel} htmlFor="state">State <span style={{ color: 'red' }}>*</span></label>
                        <Select
                            id="state"
                            // className={regisCss.regisInput}
                            options={states}
                            value={selectedState}
                            onChange={handleStateChange}
                            isDisabled
                            placeholder="Select institue"
                        />
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                        <label className={regisCss.regisLabel} htmlFor="city">City <span style={{ color: 'red' }}>*</span></label>
                        <Select
                            id="city"
                            // className={regisCss.regisInput}
                            options={cities}
                            value={selectedCity}
                            onChange={handleCityChange}
                            isDisabled
                            placeholder="Select institue"
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={regisCss.regisLabel}
                            htmlFor="pincode"
                        >
                            Pincode
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="pincode"
                            name="pincode"
                            placeholder="Enter your city's pincode"
                            autoComplete="on"
                            maxLength={validation.authForm.pincode.maxLen}
                            value={regisForm.pincode}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={regisCss.regisLabel}
                            htmlFor="addLine1"
                        >
                            Address line 1
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="addLine1"
                            name="addLine1"
                            placeholder="Address line 1"
                            autoComplete="on"
                            maxLength={validation.authForm.addLine1.maxLen}
                            pattern="[0-9]{3} [0-9]{3} [0-9]{4}"
                            value={regisForm.addLine1}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={regisCss.regisLabel}
                            htmlFor="addLine2"
                        >
                            Address line 2
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="addLine2"
                            name="addLine2"
                            placeholder="Address line 2"
                            autoComplete="on"
                            maxLength={validation.authForm.addLine2.maxLen}
                            value={regisForm.addLine2}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                        <button
                            onClick={handleRegisterClick}
                            className={regisCss.regisBtn}
                            disabled={isBtnDisabled}
                        >
                            {isRegistering ? "Registering ..." : "Register"}
                        </button>
                    </div>
                </div>
            </SecCard>
        </div>
    );
};

export default UserRegis;

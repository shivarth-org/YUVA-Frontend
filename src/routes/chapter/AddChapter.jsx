import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loader from "../../components/common/Loader";
// My components
import { State, City } from 'country-state-city';
import Select from 'react-select';
import axios from "axios";
import AsyncSelect from "react-select/async";
import SecCard from "../../components/common/SecCard";

// My css
import EM from "../../css/chapterEM/add-chapterEM.module.css";

import { SERVER_ORIGIN } from "../../utilities/constants";
// import { ischapterFormValid } from "../../utilities/helper_functions";



const UserchapterEM = (props) => {
    const [chapterForm, setchapterForm] = useState({
        country: "India",
        region: "",
        state: "",
        city: "",
        chapter_name: "",
    });
    const [selectedOption, setSelectedOption] = useState(null);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const loadOptions = async (inputValue, callback) => {
        try {
            const response = await axios.get(`${SERVER_ORIGIN}/api/region/auth/get-all`, {
                params: {
                    search: inputValue,
                    page: 1,
                    limit: 10,
                    sortBy: "name",
                    sortType: "asc"
                }
            });
            const options = response.data.filteredRegions.map(elem => ({
                label: elem.name,
                value: elem._id
            }));
            callback(options);
        } catch (error) {
            console.error("Error fetching institutes", error);
        }
    };

    useEffect(() => {
        async function canVisitPage() {
            setIsLoading(true);

            try {
                // const adminId = process.env.REACT_APP_ADMIN_ID;
                // const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                // const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/verify-token`,
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
                // (result);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/login");
                    }
                } else if (response.ok && response.status === 200) {

                } else {
                    // for future
                }
            } catch (err) {
                // (err.message);
            }

            setIsLoading(false);
        }
        canVisitPage()
        const fetchDefaultOptions = async () => {
            try {
                const response = await axios.get(`${SERVER_ORIGIN}/api/region/auth/get-all`, {
                    params: {
                        search: '',
                        page: 1,
                        limit: 5,
                        sortBy: "name",
                        sortType: "asc"
                    }
                });
                const options = response.data.filteredRegions.map(elem => ({
                    label: elem.name,
                    value: elem._id
                }));
                setDefaultOptions(options);
            } catch (error) {
                console.error("Error fetching default options", error);
            }
        };

        fetchDefaultOptions();
    }, []);
    const [errors, setErrors] = useState({});
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
        setchapterForm(prevForm => ({ ...prevForm, state: selectedOption.label, city: '' }));
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        setchapterForm(prevForm => ({ ...prevForm, city: selectedOption.label }));
    };
    const onChange = (e) => {
        const { name, value } = e.target;
        setchapterForm({ ...chapterForm, [name]: value });
    };

    const onSubmit = (e) => {
        // e.preventDefault();

        // Check for empty fields 
        let missingFields = [];
        const emptyFields = {};
        for (const field in chapterForm) {
            if (!chapterForm[field]) {
                missingFields.push(field)
            }
        }
        if (missingFields.length > 0) {
            missingFields = missingFields.join(", ")
            toast.error(`Please fill in all the required fields: ${missingFields}
`)
        }
        if (Object.keys(emptyFields).length > 0) {
            setErrors(emptyFields);
            // console.log(emptyFields);
            return; // Stop form submission if there are empty fields
        }

        // Continue with form submission if all fields are filled
        // Submit logic goes here
    };
    const navigate = useNavigate();

    const [ischapterEMtering, setIschapterEMtering] = useState(false);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    const handlechapterEMterClick = async () => {
        // todo: trim fields, validate


        try {
            setIschapterEMtering(true);
            setIsBtnDisabled(true);
            const userId = "utkarsh@troology.in";
            const userPassword = "Redhood@23"
             const basicAuth = btoa(`${userId}:${userPassword}`);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/chapter/auth/insert`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        //Authorization: `Basic ${basicAuth}`,
                        'auth-token': sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify(chapterForm),
                }
            );

            const result = await response.json();
            // (response);
            // (result);

            setIschapterEMtering(false);
            setIsBtnDisabled(false);

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 500) {
                    // toast.error(result.statusText); // todo: toast notify
                    setIschapterEMtering(false);
                    setIsBtnDisabled(false); // can reclick on chapterEMter btn
                } else if (response.status === 403) {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                toast.success(result.statusText); // chapterEMtered therefore chapterEM btn remains disabled
                navigate("/chapter/all");
            } else {
                // for future
            }
        } catch (err) {
            // (err.message);
            setIsBtnDisabled(false); // can reclick on chapterEMter btn
            setIschapterEMtering(false);
        }
    };

    return isLoading ? (
        <Loader />
    ) : (
        <div className={EM.outerDiv}>
            <SecCard>
                {/* <div style={{ color: "red" }}>
                    {Object.values(errors).map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </div> */}
                <h2 className="text-ff1">Add Chapter</h2>

                <div className="text-ff2" autoComplete="on">
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={EM.chapterEMLabel} htmlFor="chapter_name">
                            Chapter Name <span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                            className={EM.chapterEMInput}
                            type="text"
                            id="chapter_name"
                            name="chapter_name"
                            placeholder="Enter chapter name"
                            autoComplete="on"
                            // maxLength={validation.authForm.mName.maxLen}
                            value={chapterForm.chapter_name}
                            onChange={onChange}
                        />
                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={EM.chapterEMLabel} htmlFor="country">
                            Country <span style={{ color: "red" }}>*</span>{" "}
                            {/* <UserIdAvailabilityMsg /> */}
                        </label>
                        <input
                            className={EM.chapterEMInput}
                            type="text"
                            id="country"
                            name="country"
                            placeholder="Enter country"
                            autoComplete="on"
                            // maxLength={validation.authForm.userId.maxLen}
                            value={"India"}
                            onChange={onChange}
                        />
                    </div>
                    {/* <div style={{ marginBottom: "0.8rem" }}>
                        <label className={EM.chapterEMLabel} htmlFor="region">
                            Rgion <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={EM.chapterEMInput}
                            type="text"
                            id="region"
                            name="region"
                            placeholder="Enter region name"
                            value={chapterForm.region}
                            onChange={onChange}
                            autoComplete="on"
                        />
                    </div> */}
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={EM.chapterEMLabel}
                            htmlFor="region"
                        >
                            Region <span style={{ color: "red" }}>*</span>
                        </label>
                        <AsyncSelect // Use AsyncSelect for region selection
                            cacheOptions
                            loadOptions={loadOptions} // Existing logic for fetching region options
                            defaultOptions={defaultOptions}
                            onChange={(selectedOption) => { // Update region in chapterForm
                                setchapterForm(prevForm => ({ ...prevForm, region: selectedOption.label }));
                                setSelectedOption(selectedOption);
                            }}
                            value={selectedOption}
                            placeholder="Enter your region name"
                        />
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                        <label className={EM.chapterEMLabel} htmlFor="state">State <span style={{ color: 'red' }}>*</span></label>
                        <Select
                            id="state"
                            // className={EM.regisInput}
                            options={states}
                            value={selectedState}
                            onChange={handleStateChange}
                        />
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                        <label className={EM.chapterEMLabel} htmlFor="city">City <span style={{ color: 'red' }}>*</span></label>
                        <Select
                            id="city"
                            // className={regisCss.regisInput}
                            options={cities}
                            value={selectedCity}
                            onChange={handleCityChange}
                        />
                    </div>
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                        <button
                            onClick={async () => {
                                await handlechapterEMterClick();
                                onSubmit();
                            }}
                            className={EM.chapterEMBtn}
                            disabled={isBtnDisabled}
                        >
                            {ischapterEMtering ? "Adding ..." : "Add"}
                        </button>
                    </div>
                </div>
            </SecCard>
        </div>
    );
};

export default UserchapterEM;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Select from 'react-select';
import SecCard from "../../components/common/SecCard";
import AsyncSelect from "react-select/async";
import axios from "axios";
import Loader from "../../components/common/Loader";
import EM from "../../css/chapterEM/add-chapterEM.module.css";
import { Country, State, City } from 'country-state-city';
import { SERVER_ORIGIN, validation } from "../../utilities/constants";
// import TextField from "@material-ui/core/TextField";
// import InputAdornment from "@material-ui/core/InputAdornment";

const UserchapterEM = (props) => {
    const [chapterEMForm, setchapterEMForm] = useState({
        name: "",
        email: "",
        designation: "",
        chapterName: "",
        regionalManagerName: "",
        number: "",
        country: "India",
        state: "",
        city: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const onChange = (e) => {
        const { name, value } = e.target;
        setchapterEMForm({ ...chapterEMForm, [name]: value });
    };

    const onSubmit = (e) => {
        const emptyFields = {};
        let missingFields = [];
        for (const field in chapterEMForm) {
            if (!chapterEMForm[field]) {
                if (field.includes('create')) {
                    continue;
                }
                // emptyFields[field] = toast.error(`${field} is missing`); 
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
    };
    const navigate = useNavigate();

    const [ischapterEMtering, setIschapterEMtering] = useState(false);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    const handlechapterEMterClick = async () => {
        try {
            setIschapterEMtering(true);
            setIsBtnDisabled(true);
            const userId = "utkarsh@troology.in";
            const userPassword = "Redhood@23"
             const basicAuth = btoa(`${userId}:${userPassword}`);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/em/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'auth-token': sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify(chapterEMForm),
                }
            );

            const result = await response.json();

            setIschapterEMtering(false);
            setIsBtnDisabled(false);

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 500) {
                    // toast.error(result.statusText);
                    setIschapterEMtering(false);
                    setIsBtnDisabled(false);
                } else if (response.status === 403) {
                    // toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                toast.success("Chapter EM added successfully");
                navigate("/em/all");
            } else {
                // for future
            }
        } catch (err) {
            setIsBtnDisabled(false);
            setIschapterEMtering(false);
        }
    };

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [defaultOptions, setDefaultOptions] = useState([]);

    const loadOptions = async (inputValue, callback) => {
        try {
            const response = await axios.get(`${SERVER_ORIGIN}/api/chapter/auth/get-all`, {
                params: {
                    search: inputValue,
                    page: 1,
                    limit: 10,
                    sortBy: "name",
                    sortType: "asc"
                }
            });
            const options = response.data.filteredChapters.map(elem => ({
                label: elem.chapter_name,
                value: elem._id,
                state: elem.state,
                city: elem.city
            }));
            callback(options);
        } catch (error) {
            console.error("Error fetching chapters", error);
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
                const response = await axios.get(`${SERVER_ORIGIN}/api/chapter/auth/get-all`, {
                    params: {
                        search: '',
                        page: 1,
                        limit: 5,
                        sortBy: "name",
                        sortType: "asc"
                    }
                });
                const options = response.data.filteredChapters.map(elem => ({
                    label: elem.chapter_name,
                    value: elem._id,
                    state: elem.state,
                    city: elem.city
                }));
                setDefaultOptions(options);
            } catch (error) {
                console.error("Error fetching default options", error);
            }
        };

        fetchDefaultOptions();
    }, []);

    useEffect(() => {
        const indianStates = State.getStatesOfCountry('IN');
        setStates(indianStates.map(state => ({ label: state.name, value: state.isoCode })));
    }, []);

    const handleChapterSelect = (selectedOption) => {
        setchapterEMForm(prevForm => ({
            ...prevForm,
            chapterName: selectedOption.label,
            state: selectedOption.state,
            city: selectedOption.city
        }));

        const selectedState = states.find(state => state.label === selectedOption.state);
        if (selectedState) {
            setSelectedState(selectedState);
            const stateCities = City.getCitiesOfState('IN', selectedState.value);
            setCities(stateCities.map(city => ({ label: city.name, value: city.name })));

            const selectedCity = stateCities.find(city => city.name === selectedOption.city);
            if (selectedCity) {
                setSelectedCity({ label: selectedCity.name, value: selectedCity.name });
            }
        } else {
            setCities([]);
            setSelectedCity(null);
        }

        setSelectedOption(selectedOption);
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        const stateCities = City.getCitiesOfState('IN', selectedOption.value);
        setCities(stateCities.map(city => ({ label: city.name, value: city.name })));
        setSelectedCity(null);
        setchapterEMForm(prevForm => ({ ...prevForm, state: selectedOption.label, city: '' }));
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        setchapterEMForm(prevForm => ({ ...prevForm, city: selectedOption.label }));
    };

    const [mobile, setmobile] = useState("");
    const [isError, setIsError] = useState(false);
    const pattern = new RegExp(/^\d{1,10}$/);
    return isLoading ? (
        <Loader />
    ) : (
        <div className={EM.outerDiv}>
            <SecCard>
                <h2 className="text-ff1">Add Chapter EM</h2>

                <div className="text-ff2" autoComplete="on">
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={EM.chapterEMLabel} htmlFor="name">
                            Chapter EM Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={EM.chapterEMInput}
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter chapter em name"
                            autoComplete="on"
                            value={chapterEMForm.name}
                            onChange={onChange}
                        />
                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={EM.chapterEMLabel} htmlFor="regionalManagerName">
                            CII Regional Director
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={EM.chapterEMInput}
                            type="text"
                            id="regionalManagerName"
                            name="regionalManagerName"
                            placeholder="Enter CII regional director"
                            value={chapterEMForm.regionalManagerName}
                            onChange={onChange}
                            autoComplete="on"
                        />
                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={EM.chapterEMLabel} htmlFor="email">
                            Email <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={EM.chapterEMInput}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email"
                            autoComplete="on"
                            value={chapterEMForm.email}
                            onChange={onChange}
                        />
                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={EM.chapterEMLabel} htmlFor="designation">
                            Designation <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={EM.chapterEMInput}
                            type="text"
                            id="designation"
                            name="designation"
                            placeholder="Enter designation"
                            autoComplete="on"
                            value={chapterEMForm.designation}
                            onChange={onChange}
                        />
                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={EM.chapterEMLabel}
                            htmlFor="chapterName"
                        >
                            Chapter Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <AsyncSelect
                            cacheOptions
                            loadOptions={loadOptions}
                            defaultOptions={defaultOptions}
                            onChange={handleChapterSelect}
                            value={selectedOption}
                            placeholder="Enter chapter name"
                        />
                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={EM.chapterEMLabel} htmlFor="number">
                            Mobile Number <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={EM.chapterEMInput}
                            type="number"
                            id="number"
                            name="number"
                            placeholder="Enter mobile number"
                            // autoComplete="on"  // You can leave this commented out if not needed
                            value={chapterEMForm.number}
                            onChange={onChange}
                            maxLength={validation.authForm.phone.maxLen}  // Limits input to 10 characters
                            minLength={validation.authForm.phone.minLen}
                            pattern="[0-9]{10}"  // Allows exactly 10 digits (0-9)
                            title="Please enter exactly 10 digits"  // Optional: tooltip for validation
                            required  // Makes the field required (since there's a red asterisk)
                        />
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                        <label className={EM.chapterEMLabel} htmlFor="country">Country <span style={{ color: 'red' }}>*</span></label>
                        <input
                            id="country"
                            className={EM.chapterEMInput}
                            value={"India"}
                            readOnly
                        >
                        </input>
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                        <label className={EM.chapterEMLabel} htmlFor="state">State <span style={{ color: 'red' }}>*</span></label>
                        <Select
                            id="state"
                            options={states}
                            value={selectedState}
                            onChange={handleStateChange}
                            readOnly
                            isDisabled
                            placeholder="Select chapter name"
                        />
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                        <label className={EM.chapterEMLabel} htmlFor="city">City <span style={{ color: 'red' }}>*</span></label>
                        <Select
                            id="city"
                            options={cities}
                            value={selectedCity}
                            onChange={handleCityChange}
                            isDisabled
                            placeholder="Select chapter name"
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

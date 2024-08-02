import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Select from 'react-select';
import { State, City } from 'country-state-city';
// My components
import SecCard from "../../components/common/SecCard";
// My css
import instiCss from "../../css/institute/add-insti-page.module.css";
import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import { useUserType } from "../../routes/common/UserTypeContext";
const Userinsti = (props) => {
    const [instiForm, setinstiForm] = useState({
        name: "",
        officerName: "",
        officerEmail: "",
        officerNumber: "",
        country: "India",
        designation: "",
        state: "",
        city: "",
        createdBy: sessionStorage.getItem('_id') ?? ""
        // isActive: "",
    });
    const [errors, setErrors] = useState({});

    const onChange = (e) => {
        const { name, value } = e.target;
        setinstiForm({ ...instiForm, [name]: value });
    };

    const onSubmit = (e) => {
        // e.preventDefault();

        // Check for empty fields
        const emptyFields = {};
        let missingFields = [];
        for (const field in instiForm) {
            if (!instiForm[field]) {
                if (field.includes('create')){
                    continue;
                }
                missingFields.push(field)
                // emptyFields[field] = toast.error(`${field} is missing`);
            }
        }
        if (missingFields.length > 0) {
            missingFields = missingFields.join(", ")
            toast.error(`Please fill in all the required fields: ${missingFields}`)
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

    const [isinstitering, setIsinstitering] = useState(false);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
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
        setinstiForm(prevForm => ({ ...prevForm, state: selectedOption.label, city: '' }));
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        setinstiForm(prevForm => ({ ...prevForm, city: selectedOption.label }));
    };
    const handleinstiterClick = async () => {
        // todo: trim fields, validate
        try {
            setIsinstitering(true);
            setIsBtnDisabled(true);
            const userId = "utkarsh@troology.in";
            const userPassword = "Redhood@23"
             const basicAuth = btoa(`${userId}:${userPassword}`);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/institute/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        //Authorization: `Basic ${basicAuth}`,
                        'auth-token': sessionStorage.getItem('token'),
                        //Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(instiForm),
                }
            );

            const result = await response.json();
            // (response);
            // (result);

            setIsinstitering(false);
            setIsBtnDisabled(false);

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 500) {
                    toast.error(result.statusText); // todo: toast notify
                    setIsBtnDisabled(false); // can reclick on institer btn
                    setIsinstitering(false);
                } else if (response.status === 409) {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                toast.success(result.statusText); // institered therefore insti btn remains disabled
                navigate(`/institutes/all`);
            } else {
                // for future
                setIsBtnDisabled(false);
            }
        } catch (err) {
            // (err.message);
            setIsBtnDisabled(false); // can reclick on institer btn
            setIsinstitering(false);
        }
    };

    return (
        <div className={instiCss.outerDiv}>
            <SecCard>
                {/* <div style={{ color: "red" }}>
                    {Object.values(errors).map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </div> */}
                <h2 className="text-ff1">Add Institute</h2>

                <div className="text-ff2" autoComplete="on">
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={instiCss.instiLabel} htmlFor="name">
                            College / Institute Name <span style={{ color: "red" }}>*</span>{" "}
                            {/* <UserIdAvailabilityMsg /> */}
                        </label>
                        <input
                            className={instiCss.instiInput}
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter College / Institute Name"
                            autoComplete="on"
                            // maxLength={validation.authForm.userId.maxLen}
                            value={instiForm.name}
                            onChange={onChange}
                            maxLength={100}
                        />
                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={instiCss.instiLabel} htmlFor="officerEmail">
                            Nodal Officer Email <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={instiCss.instiInput}
                            type="email"
                            id="officerEmail"
                            name="officerEmail"
                            placeholder="Enter Nodal Officer Email"
                            value={instiForm.officerEmail}
                            onChange={onChange}
                            autoComplete="on"
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={instiCss.instiLabel} htmlFor="officerName">
                            Nodal Officer Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={instiCss.instiInput}
                            type="text"
                            id="officerName"
                            name="officerName"
                            placeholder="Enter Nodal Officer Name"
                            autoComplete="on"
                            // maxLength={validation.authForm.fName.maxLen}
                            value={instiForm.officerName}
                            onChange={onChange}
                        />
                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={instiCss.instiLabel} htmlFor="officerNumber">
                            Nodal Officer Number<span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                            className={instiCss.instiInput}
                            type="number"
                            id="officerNumber"
                            name="officerNumber"
                            placeholder="Enter Nodal Officer Number"
                            autoComplete="on"
                            maxLength={validation.authForm.phone.maxLen}
                            value={instiForm.officerNumber}
                            onChange={onChange}
                        // maxLength={10}
                        />
                    </div>
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={instiCss.instiLabel} htmlFor="designation">
                            Nodal Officer Designation <span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                            className={instiCss.instiInput}
                            type="text"
                            id="designation"
                            name="designation"
                            placeholder="Enter Nodal Officer Designation"
                            autoComplete="on"
                            // maxLength={validation.authForm.mName.maxLen}
                            value={instiForm.designation}
                            onChange={onChange}
                            // maxLength={16}
                            minLength={8}
                        />
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                        <label className={instiCss.instiLabel} htmlFor="country">Country <span style={{ color: 'red' }}>*</span></label>
                        <input
                            id="country"
                            className={instiCss.instiInput}
                            value={"India"}
                            readOnly
                        >
                        </input>
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                        <label className={instiCss.instiLabel} htmlFor="state">State <span style={{ color: 'red' }}>*</span></label>
                        <Select
                            id="state"
                            // className={instiCss.regisInput}
                            options={states}
                            value={selectedState}
                            onChange={handleStateChange}
                        />
                    </div>
                    <div style={{ marginBottom: '0.8rem' }}>
                        <label className={instiCss.instiLabel} htmlFor="city">City <span style={{ color: 'red' }}>*</span></label>
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
                                await handleinstiterClick();
                                onSubmit();
                            }}
                            className={instiCss.instiBtn}
                            disabled={isBtnDisabled}
                        >
                            {isinstitering ? "Adding ..." : "Add"}
                        </button>
                    </div>
                </div>
            </SecCard>
        </div>
    );
};

export default Userinsti;

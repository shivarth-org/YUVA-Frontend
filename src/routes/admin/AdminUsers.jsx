import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import FileUpload from "../../components/common/FileUpload";
import { DataGrid } from '@mui/x-data-grid';
import Loader from "../../components/common/Loader";
import Badge from '@mui/material/Badge';
import SecCard from "../../components/common/SecCard";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { green, yellow, red } from '@mui/material/colors';
import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import HeaderCard from "../../components/common/HeaderCard";
// import { refreshScreen } from "../../utilities/helper_functions";

import css from "../../css/admin/users-page.module.css";
import DownloadExcel from "../../components/common/DownloadExcel";

// localhost:800/users/all?page=1&limit=10&search=abhishek&sortBy=fName&sortType=desc

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}

const AdminUsers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(0);
    const [allUsers, setAllUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [sortType, setSortType] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [colleges, setColleges] = useState([]);
    const [searchCollege, setSearchCollege] = useState("");
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [rerender, setRerender] = useState(true);
    const [rowIndexCounter, setRowIndexCounter] = useState(0)
    const [all_students, SetAll_students] = useState(0)
    const [all_students_onboarding_pending, SetAll_students_onboarding_pending] = useState(0)
    const [all_students_onboarding_invited, SetAll_students_onboarding_invited] = useState(0)
    const [all_students_onboarding_onboarded, SetAll_students_onboarding_onboarded] = useState(0)
    const [all_students_email_sent, SetAll_students_email_sent] = useState(0)
    const [all_students_email_not_sent, SetAll_students_email_not_sent] = useState(0)
    const renderOnboardingStatus = (params) => {
        let statusColor;
        let statusText;
        let textColor;

        switch (params.value) {
            case 'invited':
                statusColor = yellow[500];
                statusText = 'Invited';
                textColor = "black";
                break;
            case 'pending':
                statusColor = red[500];
                statusText = 'Pending';
                textColor = "white";
                break;
            case 'onboarded':
                statusColor = green[500];
                statusText = 'Onboarded';
                textColor = "white";
                break;
            default:
                statusColor = 'transparent';
                statusText = 'Unknown';
                textColor = "white";
        }
        return <Badge>
            <span style={{ backgroundColor: statusColor, padding: '6.4px 16px', borderRadius: '8px', color: textColor }}>
                {statusText}
            </span>
        </Badge>
    }
    const renderEmailStatus = (params) => {
        let statusColor;
        let statusText;
        let textColor;

        switch (params.value) {
            case 'sent':
                statusColor = green[500];
                statusText = 'Sent';
                textColor = "white";
                break;
            case 'not sent':
                statusColor = red[500];
                statusText = 'Not Sent';
                textColor = "white";
                break;
            default:
                statusColor = 'transparent';
                statusText = 'Unknown';
                textColor = "white";
        }
        return <Badge >
            <span style={{ borderRadius: '8px', backgroundColor: statusColor, padding: '6.4px 16px', color: textColor }}>
                {statusText}
            </span>
        </Badge>
    }
    // let rowIndexCounter = 0;
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            align: 'center',
            width: 90,
            // renderCell: (params) => params.id++

        },
        {
            field: 'fName',
            align: 'center',
            headerName: 'Name',
            width: 170,
            // editable: true,
        },
        {
            field: 'email',
            headerName: 'Email',
            align: 'center',
            width: 200,
            // editable: true,
        },
        // {
        //     field: 'phone',
        //     headerName: 'Phone',
        //     width: 150,
        //     editable: true,
        // },
        {
            field: 'collegeName',
            headerName: 'College Name',
            align: 'center',
            width: 170,
            // editable: true,
        },
        {
            field: 'passOutYear',
            headerName: 'Passout Year',
            align: 'center',
            width: 150,
        },
        {
            field: 'chapterName',
            headerName: 'Chapter Name',
            align: 'center',
            width: 150,
        },
        {
            field: 'region',
            headerName: 'Region',
            align: 'center',
            width: 150,
        },
        {
            field: 'emailSentStatus',
            headerName: 'Email Sent Status',
            description: 'This column has a value getter and is not sortable.',
            // sortable: false,
            align: 'center',
            width: 160,
            renderCell: renderEmailStatus
            // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
        {
            field: 'onboardingSatus',
            headerName: 'Onboarding Status',
            description: 'This column has a value getter and is not sortable.',
            width: 160,
            align: 'center',
            renderCell: renderOnboardingStatus,
        },
        {
            field: 'gender',
            headerName: 'Gender',
            align: 'center',
            description: 'This column has a value getter and is not sortable.',
            width: 110,
        },
        {
            field: 'branch',
            headerName: 'Branch',
            align: 'center',
            description: 'This column has a value getter and is not sortable.',
            width: 110,
        },
        {
            headerName: 'Action',
            type: 'button',
            width: 150,
            align: 'center',
            renderCell: (params) => (
                <button
                    className={css.viewBtn}
                    onClick={() =>
                        navigate(
                            `/admin/users/${params.row.userId}`
                        )
                    }
                >
                    View Details
                </button>
            )
        },
    ];
    const rows = allUsers.map((user, idx) => ({ ...user, 'id': idx + 1 }))
    const navigate = useNavigate();

    const increment = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    const decrement = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    function handleUsersClick() {
        navigate(`/user/register/${'no_id'}`);
    }

    useEffect(() => {
        async function getCollegeName() {
            setIsLoading(true);

            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                const basicAuth = btoa(`${adminId}:${adminPassword}`);

                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/users/college-names`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${basicAuth}`, // Include Basic Authentication
                            "auth-token": sessionStorage.getItem("token"),
                        },
                    }
                );

                const result = await response.json();

                setIsLoading(false);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/login");
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {

                } else {
                    // for future
                }
            } catch (err) {
                setIsLoading(false);
            }
        }

        getCollegeName();
    }, [navigate]);

    useEffect(() => {
        async function getAllUsers() {
            setIsLoading(true);

            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                const basicAuth = btoa(`${adminId}:${adminPassword}`);

                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/users/all?page=${page}&limit=${limit}&search=${searchQuery}&sortBy=fName&sortType=${sortType === true ? "asc" : "desc"
                    }&collegeName=${searchCollege}`,
                    {
                        headers: {
                            method: "GET",
                            "Content-Type": "application/json",
                            Authorization: `Basic ${basicAuth}`, // Include Basic Authentication
                            "auth-token": sessionStorage.getItem("token"),
                        },
                    }
                );

                const result = await response.json();

                setIsLoading(false);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/login");
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    setAllUsers(result.filteredUsers);
                    setTotalPages(result.totalPages);
                } else {
                    // for future
                }
            } catch (err) {
                setIsLoading(false);
            }
        }
        async function counting() {
            setIsLoading(true);
            // const _id = sessionStorage.getItem('_id');

            try {
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/student-counting`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                            //Authorization: `Basic ${basicAuth}`,
                        },
                        // body: JSON.stringify({ _id: _id }),
                    }
                );

                const result = await response.json();
                // (result);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/login?userType=institute");
                    }
                } else if (response.ok && response.status === 200) {
                    // console.log((result.data.all_institutes).length, "(result.data.all_institutes).length");
                    SetAll_students(result.data.all_students);
                    SetAll_students_onboarding_pending(result.data.all_students_onboarding_pending);
                    SetAll_students_onboarding_invited(result.data.all_students_onboarding_invited);
                    SetAll_students_onboarding_onboarded(result.data.all_students_onboarding_onboarded);
                    SetAll_students_email_sent(result.data.all_students_email_sent);
                    SetAll_students_email_not_sent(result.data.all_students_email_not_sent)

                } else {
                    navigate("/login?userType=institute");
                }
            } catch (err) {
                // (err.message);
            }

            setIsLoading(false);
        }
        counting()
        getAllUsers();
    }, [page, sortType, searchQuery, rerender, navigate]);
    const pageSizeOptions = [5, 10, 20, 50, 100, 7];
    const [selectedOption, setSelectedOption] = useState(null);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [regisForm, setRegisForm] = useState({
        userId: "",
        email: "",
        fName: "",
        mName: "",
        lName: "",
        collegeName: "",
        region: "",
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
    const loadOptions = async (inputValue, callback) => {
        try {
            const response = await axios.get(`${SERVER_ORIGIN}/api/institute/auth/institute/all`, {
                params: {
                    search: inputValue,
                    page: 1,
                    limit: 10,
                    sortBy: "name",
                    sortType: "asc"
                }
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
                        // limit: 1,
                        sortBy: "name",
                        sortType: "asc"
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
    return (
        <div className={css.outerDiv}>
            <HeaderCard>
                <h1 className="headerTitle">Students</h1>
                <hr />
                <p className="headerSubtitle">
                    You can view the student list here
                </p>
                <p className="headerSubtitle">
                    Note: Creating a student is irreversible. Do it at your own
                    risk.
                </p>
                <br />
                <div className='d-flex justify-content-center'>
                    <div style={{ marginBottom: "0.8rem", width: '300px' }}>
                        <AsyncSelect
                            cacheOptions
                            loadOptions={loadOptions}
                            defaultOptions={defaultOptions}
                            onChange={(selectedOption) => {
                                if (selectedOption) {
                                    setRegisForm(prevForm => ({
                                        ...prevForm,
                                        collegeName: selectedOption.label,
                                    }));
                                    setSelectedOption(selectedOption);
                                    // console.log(setRegisForm.collegeName);
                                    // setColleges(result.collegeNames);
                                }
                            }}
                            value={selectedOption}
                            placeholder="Select / Search Institute"
                        />
                    </div>
                </div>

                <DownloadExcel />
                <div className='d-flex justify-content-evenly align-items-baseline'>


                    <FileUpload collegeName={selectedOption} />
                    <button
                        className={`${css.fileUploadBtn} commonBtn`}
                        onClick={handleUsersClick}
                    >
                        <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff", marginRight: "5px" }} /> Add Student
                    </button>

                </div>
            </HeaderCard>
            <div className="my-4">
                <SecCard >
                    <Row>
                        <div className={`${css.serviceName} my-2`}>
                            Students Data
                        </div>
                        <Col md={6} lg={4} sm={12} xs={12}>
                            {/* <SecCard> */}
                            <div
                                style={{
                                    border: '2px dashed #cccccc',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#f5f5f5'
                                }}>
                                <h3 className="cardTitle" style={{ fontSize: '20px', fontWeight: '600' }}>Students</h3>
                                <div className="d-flex" style={{ justifyContent: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{all_students}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Total</p>
                                    </div>
                                </div>
                            </div>

                            {/* </SecCard> */}
                        </Col>
                        <Col md={6} lg={4} sm={12} xs={12}>
                            <div
                                style={{
                                    border: '2px dashed #cccccc',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#f5f5f5'
                                }}
                            >
                                <h3 className="cardTitle" style={{ fontSize: '20px', fontWeight: '600' }}>Email Status</h3>
                                <div className="d-flex" style={{ justifyContent: 'space-evenly' }}>
                                    <div>
                                        <div style={{ fontSize: '20px', fontWeight: '600' }}>{all_students_email_sent}</div>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Sent</p>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '20px', fontWeight: '600' }}>{all_students_email_not_sent}</div>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Not Sent</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} lg={4} sm={12} xs={12}>
                            <div
                                style={{
                                    border: '2px dashed #cccccc',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#f5f5f5'
                                }}
                            >
                                <h3 className="cardTitle" style={{ fontSize: '20px', fontWeight: '600' }}>Onboarding Status</h3>
                                <div className="d-flex" style={{ justifyContent: 'space-evenly' }}>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{all_students_onboarding_onboarded}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Onboarded</p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{all_students_onboarding_invited}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Invited</p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{all_students_onboarding_pending}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Pending</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </SecCard>
            </div>
            <div className={css.filterBtns}>
                <div className={css.searchInputs}>
                    <div className='d-flex' style={{ position: 'relative', justifyContent: 'end', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search from the list"
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                // setPage(1);
                            }}
                            className={css.searchInput}
                        />
                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "black", position: 'absolute', right: '10px' }} />
                    </div>
                </div>
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 7, page: 0 },
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminUsers;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import FileUpload from "../../components/common/FileUpload";
import { DataGrid } from '@mui/x-data-grid';
import Loader from "../../components/common/Loader";
import Badge from '@mui/material/Badge';
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

const InstutueStudents = () => {
    const [queryId, setQueryId] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(0);
    const [allUsers, setAllUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [sortType, setSortType] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [colleges, setColleges] = useState([]);
    const [searchCollege, setSearchCollege] = useState("");
    // const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [rerender, setRerender] = useState(true);
    // const [rowIndexCounter, setRowIndexCounter] = useState(0)
    // console.log("page is openid");
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
            headerName: 'Full Name',
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
            headerName: 'Institute Name',
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
        }

    ];
    const rows = allUsers.map((user, idx) => ({ ...user, 'id': idx + 1 }))
    const navigate = useNavigate();

    function handleUsersClick() {
        navigate(`/user/register/${queryId}`);
    }

    useEffect(() => {
        async function getAllUsers() {
            console.log("akshgjahskjhgj");
            try {
                setIsLoading(true);
                const _id = sessionStorage.getItem('_id');
                setQueryId(_id)
                // const adminId = process.env.REACT_APP_ADMIN_ID;
                // const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                // const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/institute/auth/users/all?page=${page}&limit=${limit}&search=${searchQuery}&sortBy=fName&sortType=${sortType === true ? "asc" : "desc"
                    }`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                            //Authorization: `Basic ${basicAuth}`,
                        }, body: JSON.stringify({ _id: _id }),
                    }
                );

                const result = await response.json();

                setIsLoading(false);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/");
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
        getAllUsers();
    }, []);
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
                    sortType: "asc",
                    id: sessionStorage.getItem('_id')
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
                        limit: 5,
                        sortBy: "name",
                        sortType: "asc",
                        id: sessionStorage.getItem('_id')
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
                    You can view the students list here
                </p>
                <p className="headerSubtitle">
                    Note: Creating a student is irreversible. Do it at your own
                    risk.
                </p>
                <br />
                <div className='d-flex justify-content-center'>
                    {/* {queryId && <> */}

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
                                    }
                                }}
                                value={selectedOption}
                                placeholder="Select / Search Institute"
                            />
                        </div>
                    {/* </>} */}
                </div>
                <DownloadExcel />
                <div>
                    <div className='d-flex justify-content-evenly align-items-baseline'>
                        {/* <div> */}
                        <FileUpload collegeName={selectedOption} />

                        <button
                            className={`${css.fileUploadBtn} commonBtn`}
                            onClick={handleUsersClick}
                        >
                            <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff", marginRight: "5px" }} /> Add Student
                        </button>
                        {/* </div> */}
                    </div>
                    {/* <div>
                    </div> */}
                </div>
            </HeaderCard>
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
                        pageSize={7} // Set the initial page size to 7
                        pagination
                    />
                </div>
            )}
        </div>
    );
};

export default InstutueStudents;

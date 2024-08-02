import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import FileUpload from "../../components/common/FileUpload";
import { DataGrid, GridColumnMenu, GridToolbar } from '@mui/x-data-grid';
import Loader from "../../components/common/Loader";
import Badge from '@mui/material/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import EmMouView from '../institute/EmMouView'

import { green, yellow, red, deepPurple } from '@mui/material/colors';
import { SERVER_ORIGIN } from "../../utilities/constants";
import HeaderCard from "../../components/common/HeaderCard";
import Dropdown from "../../components/common/EmDropdown";
// import { refreshScreen } from "../../utilities/helper_functions";

import css from "../../css/admin/users-page.module.css";
import DownloadExcel from "../../components/common/DownloadExcel";
import { useUserType } from "../common/UserTypeContext";

// localhost:800/users/all?page=1&limit=10&search=abhishek&sortBy=fName&sortType=desc


const AllChapterEM = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(0);
    const [allInstitutes, setAllInstitutes] = useState([]);
    const [page, setPage] = useState(1);
    const [sortType, setSortType] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [mouStatus, setMouStatus] = useState("");
    const [totalPages, setTotalPages] = useState(0);

    const [all_institutes, setAll_institutes] = useState(0)
    const [all_mou_accepted, setAll_mou_accepted] = useState(0)
    const [all_mou_rejected, setAll_mou_rejected] = useState(0)
    const [all_mou_pending, setAll_mou_pending] = useState(0)
    const [all_institutes_onboarding_pending, setAll_institutes_onboarding_pending] = useState(0)
    const [all_institutes_onboarding_invited, setAll_institutes_onboarding_invited] = useState(0)
    const [all_institutes_email_sent, setAll_institutes_email_sent] = useState(0)
    const [all_institutes_onboarding_onboarded, setAll_institutes_onboarding_onboarded] = useState(0)
    const [all_institutes_email_not_sent, setAll_institutes_email_not_sent] = useState(0)
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    // const [rerender, setRerender] = useState(true);
    const navigate = useNavigate();
    const { userType, setUserTypeToAdmin, setUserTypeToUser, setUserTypeToInstitute, setUserTypeToChapterEM } = useUserType();
    useEffect(() => {
        async function canVisitPage() {
            setIsLoading(true);
            try {
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
                    toast.error(result.statusText)
                    if (response.status === 401) {
                        navigate("/admin/services");
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
        async function getAllEms() {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/em/auth/em/all?page=${page}&limit=${limit}&search=${searchQuery}&sortBy=name&sortType=${sortType === true ? "asc" : "desc"
                    }`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            //Authorization: `Basic ${basicAuth}`, // Include Basic Authentication
                            "auth-token": sessionStorage.getItem("token"),
                        },
                    }
                );

                const result = await response.json();
                // console.log(result)
                setIsLoading(false);
                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/services");
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.status === 200) {
                    setAllInstitutes(result.filteredInstitutes);
                    setTotalPages(result.totalPages);
                    setMouStatus(result.filteredInstitutes.mouStatus)
                    console.log(mouStatus, "setIsLoading")
                } else {
                    // for future
                }
            } catch (err) {
                setIsLoading(false);
            }
        }
        async function countingEM() {
            // const em_id = sessionStorage.getItem('_id')
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/em/auth/counting`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                            //Authorization: `Basic ${basicAuth}`,
                        },
                        // body: JSON.stringify({ _id: em_id }),
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
                    setAll_institutes(result.data.all_institutes)
                    setAll_mou_accepted(result.data.all_mou_accepted)
                    setAll_mou_rejected(result.data.all_mou_rejected)
                    setAll_mou_pending(result.data.all_mou_pending)
                    setAll_institutes_onboarding_pending(result.data.all_institutes_onboarding_pending)
                    setAll_institutes_onboarding_invited(result.data.all_institutes_onboarding_invited)
                    setAll_institutes_email_sent(result.data.all_institutes_email_sent)
                    setAll_institutes_onboarding_onboarded(result.data.all_institutes_onboarding_onboarded)
                    setAll_institutes_email_not_sent(result.data.all_institutes_email_not_sent)
                } else {
                    navigate("/admin/login");
                }
            } catch (err) {
                // (err.message);
            }

            setIsLoading(false);
        }
        countingEM()
        canVisitPage()
        getAllEms();
    }, [page, sortType, searchQuery, navigate]);
    // const [rerender, setRerender] = useState(true);
    const handleButtonClick = (id) => {
        setSelectedId(id);
        setIsOpen(!isOpen);
    };
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
                statusColor = deepPurple[500];
                statusText = 'Pending';
                textColor = "white";
                break;
            case 'onboarded':
                statusColor = green[500];
                statusText = 'Onboarded';
                textColor = "white";
                break;
            case 'approved':
                statusColor = green[500];
                statusText = 'Approved';
                textColor = "white";
                break;
            case 'rejected':
                statusColor = red[500];
                statusText = 'Rejected';
                textColor = "white";
                break;
            case 'submitted':
                statusColor = yellow[500];
                statusText = 'Submitted';
                textColor = "black";
                break;
            default:
                statusColor = 'black';
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
                statusColor = 'black';
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
            width: 90,
            // renderCell: (params) => params.id++

        },
        {
            field: 'name',
            headerName: 'Name',
            width: 170,
            // editable: true,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
            // editable: true,
        },
        {
            field: 'number',
            headerName: 'Mobile Number',
            width: 150,
            // editable: true,
        },
        {
            field: 'chapterName',
            headerName: 'Chapter Name',
            width: 150,
            // editable: true,
        },
        {
            field: 'regionalManagerName',
            headerName: 'CII Regional Director',
            width: 180,
            // editable: true,
        },
        {
            field: 'instituteCount',
            headerName: 'Invited Institutes',
            align: 'center',
            width: 150,
            // editable: true,
        },
        {
            field: 'region',
            headerName: 'Region',
            width: 150,
            // editable: true,
        },
        {
            field: 'state',
            headerName: 'State',
            width: 150,
            // editable: true,
        },
        {
            field: 'city',
            headerName: 'City',
            width: 150,
            // editable: true,
        },
        {
            field: 'mouDuration',
            headerName: 'MOU Duration (Years)',
            width: 150,
            // editable: true,
        },
        {
            field: 'signDate',
            headerName: 'MOU Signed Date',
            width: 150,
            renderCell: (param) => {
                const { row: { signDate } } = param;
                if (!signDate) {
                    return "-"
                } else {

                    return new Date(signDate).toLocaleDateString()
                }
            }
        },
        {
            field: 'designation',
            headerName: 'Designation',
            width: 150,
            // editable: true,
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
            field: 'mouStatus',
            headerName: 'MOU Status',
            description: 'This column has a value getter and is not sortable.',
            width: 160,
            align: 'center',
            renderCell: renderOnboardingStatus,
        },
        {
            headerName: 'Action',
            width: 130,
            // align: 'center',
            renderCell: (params) => {
                const { row: { _id } } = params;
                return (
                    <div className="d-flex justify-content-between">
                        {/* <div>
                            <EmMouView show={isOpen && selectedId === _id} _id={_id} onHide={handleButtonClick} text={"Check MOU"} onClick={handleButtonClick} />
                        </div> */}
                        {/* <div className="mx-3"> */}
                        <Dropdown _id={_id} />
                        {/* </div> */}
                    </div>
                );
            }
        },
    ];

    function handleInstitutesClick() {
        navigate("/ems/insert");
    }

    function CustomColumnMenu(props) {
        return (
            <GridColumnMenu
                {...props}
                slots={{
                    // Add item
                    // columnMenuUserItem: CustomUserItem,
                }}
                slotProps={{
                    columnMenuUserItem: {
                        // set `displayOrder` for new item
                        displayOrder: 15,
                        // pass additional props
                        myCustomValue: 'Do custom action',
                        myCustomHandler: () => alert('Custom handler fired'),
                    },
                }}
            />
        );
    }
    const rows = allInstitutes.map((institute, idx) => ({ ...institute, 'id': idx + 1 }))
    return (
        <div className={css.outerDiv}>
            <HeaderCard>
                <h1 className="headerTitle">Chapter EM</h1>
                <hr />
                <p className="headerSubtitle">
                    You can view Chapter EM list here.
                </p>
                <p className="headerSubtitle">
                    {/* Note: Only institute can itself update their profile. */}
                </p>
                {/* <DownloadExcel /> */}
                <div className='d-flex justify-content-center align-items-baseline'>
                    {/* <FileUpload /> */}
                    <button
                        className={`${css.fileUploadBtn} commonBtn`}
                        onClick={handleInstitutesClick}
                    >
                        <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff", marginRight: "5px" }} /> Add Chapter EM
                    </button>
                </div>
            </HeaderCard>
            <div className={css.filterBtns}>
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
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5, page: 0 },
                            },
                        }}
                        getRowId={
                            (row) => row.id
                        }
                        // getRowId={(row) => row.id}
                        slots={{ toolbar: GridToolbar }}
                    />
                </div>
            )}
        </div>
    );
};

export default AllChapterEM;

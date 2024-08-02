import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import FileUpload from "../../components/common/FileUpload";
import { DataGrid, GridColumnMenu, GridToolbar } from '@mui/x-data-grid';
import Loader from "../../components/common/Loader";
import Badge from '@mui/material/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import SecCard from "../../components/common/SecCard";
import { Row, Col } from 'react-bootstrap'
import { green, yellow, red, deepPurple } from '@mui/material/colors';
import { SERVER_ORIGIN } from "../../utilities/constants";
import HeaderCard from "../../components/common/HeaderCard";
import DropDown from "../../components/common/InstituteDropDown";
// import { refreshScreen } from "../../utilities/helper_functions";
import InstututeMoU from "./InstututeMoU";
import css from "../../css/admin/users-page.module.css";
import DownloadExcel from "../../components/common/DownloadExcel";

const AdminInstitutes = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(0);
    const [allInstitutes, setAllInstitutes] = useState([]);
    const [page, setPage] = useState(1);
    const [sortType, setSortType] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [mouStatus, setMouStatus] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [all_institutes, setAll_institutes] = useState(0)
    const [all_mou_accepted, setAll_mou_accepted] = useState(0)
    const [all_mou_rejected, setAll_mou_rejected] = useState(0)
    const [all_mou_pending, setAll_mou_pending] = useState(0)
    const [all_institutes_onboarding_pending, setAll_institutes_onboarding_pending] = useState(0)
    const [all_institutes_onboarding_invited, setAll_institutes_onboarding_invited] = useState(0)
    const [all_institutes_email_sent, setAll_institutes_email_sent] = useState(0)
    const [all_institutes_onboarding_onboarded, setAll_institutes_onboarding_onboarded] = useState(0)
    const [all_institutes_email_not_sent, setAll_institutes_email_not_sent] = useState(0)
    // const [rerender, setRerender] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        async function getAllInstitutes() {
            setIsLoading(true);

            try {
                // const adminId = process.env.REACT_APP_ADMIN_ID;
                // const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                // const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/institute/auth/institute/all?page=${page}&limit=${limit}&search=${searchQuery}&sortBy=name&sortType=${sortType === true ? "asc" : "desc"
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
                        // navigate("/");
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.status === 200) {
                    setAllInstitutes(result.filteredInstitutes);
                    setTotalPages(result.totalPages);
                    setMouStatus(result.filteredInstitutes.mouStatus)
                    // console.log(mouStatus, "setIsLoading")
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
                    `${SERVER_ORIGIN}/api/admin/auth/insti-counting`,
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
                    navigate("/login?userType=institute");
                }
            } catch (err) {
                // (err.message);
            }

            setIsLoading(false);
        }
        countingEM()
        getAllInstitutes();
    }, [page, sortType, searchQuery, navigate, limit, mouStatus]);
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
        return <Badge>
            <span style={{ borderRadius: '8px', backgroundColor: statusColor, padding: '6.4px 16px', color: textColor }}>
                {statusText}
            </span>
        </Badge>
    }
    const rows = allInstitutes.map((institute, idx) => ({ ...institute, 'id': idx + 1 }))
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90,

        },
        {
            field: 'name',
            headerName: 'Institute Name',
            width: 170,
        },
        {
            field: 'officerName',
            headerName: 'Nodal Officer Name',
            width: 150,
        },
        {
            field: 'officerNumber',
            headerName: 'Nodal Officer Number',
            width: 150,
        },
        {
            field: 'officerEmail',
            headerName: 'Nodal Officer Email',
            width: 200,
        },
        {
            field: 'city',
            headerName: 'City',
            width: 150,
        },
        {
            field: 'state',
            headerName: 'State',
            width: 150,
        },
        {
            field: 'region',
            headerName: 'Region',
            width: 150,
        },
        {
            field: 'chapterName',
            headerName: 'Chapter Name',
            width: 150,
        },
        {
            field: 'country',
            headerName: 'Country',
            width: 150,
        },
        {
            field: 'designation',
            headerName: 'Designation',
            width: 150,
        },
        {
            field: 'mouDuration',
            headerName: 'MOU Duration (Year)',
            width: 150,
            // editable: true,
        },
        {
            field: 'studentCount',
            headerName: 'Student Count',
            width: 150,
        },
        {
            field: 'emailSentStatus',
            headerName: 'Email Sent Status',
            description: 'This column has a value getter and is not sortable.',
            // sortable: false,
            // align: 'center',
            width: 160,
            renderCell: renderEmailStatus
            // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
        {
            field: 'onboardingSatus',
            headerName: 'Onboarding Status',
            description: 'This column has a value getter and is not sortable.',
            width: 160,
            // align: 'center',
            renderCell: renderOnboardingStatus,
        },
        {
            field: 'mouStatus',
            headerName: 'MOU Status',
            description: 'This column has a value getter and is not sortable.',
            width: 160,
            // align: 'center',
            renderCell: renderOnboardingStatus,
        },
        {
            headerName: 'Action',
            type: 'button',
            width: 230,
            // renderCell: (params) => {
            //     const { row: { _id } } = params;
            //     return (

            //         <InstututeMoU show={isOpen} intituteID={_id} onHide={handleButtonClick} text={"Check MOU"} onClick={handleButtonClick} />
            //     )
            // }
            renderCell: (params) => {
                const { row: { _id } } = params;
                return (
                    <div className="d-flex justify-content-between">
                        <div>
                            <InstututeMoU show={isOpen} intituteID={params.row._id} onHide={handleButtonClick} text={"Check MOU"} onClick={handleButtonClick} />
                        </div>
                        <div className="mx-3">
                            <DropDown _id={params.row._id} />
                        </div>
                    </div>
                );
            }
        },


    ];

    function handleInstitutesClick() {
        navigate("/institutes/insert");
    }
    function handleButtonClick() {
        setIsOpen(!isOpen);
    };
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

    return (
        <div className={css.outerDiv}>
            <HeaderCard>
                <h1 className="headerTitle">Institutes</h1>
                <hr />
                <p className="headerSubtitle">
                    You can View/Add/Delete institute from here
                </p>
                <p className="headerSubtitle">
                    Note: Deleting an institute is irreversible. Do it at your own
                    risk.
                </p>
                {/* <DownloadExcel /> */}
                <div className='d-flex justify-content-evenly align-items-baseline mt-3'>
                    {/* <div> */}
                    {/* <FileUpload /> */}
                    {/* </div> */}
                    {/* <div> */}

                    <button
                        className={`${css.fileUploadBtn} commonBtn`}
                        onClick={handleInstitutesClick}
                    >
                        <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff", marginRight: "5px" }} /> Add Institute
                    </button>
                    {/* </div> */}
                </div>
            </HeaderCard>
            <div className="my-4">
                <SecCard >
                    <Row>
                        <div className={`${css.serviceName} my-2`}>
                            Institute Data
                        </div>
                        <Col md={6} lg={3} sm={12} xs={12}>
                            {/* <>
                            </> */}
                            <div className="mb-4"
                                style={{
                                    border: '2px dashed #cccccc',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#f5f5f5'
                                }}>

                                <h3 className="cardTitle" style={{ fontSize: '20px', fontWeight: '600' }}>Institutes</h3>
                                <div className="d-flex" style={{ justifyContent: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_institutes}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Total</p>
                                    </div>
                                </div>
                            </div>

                            {/* </SecCard> */}
                        </Col>
                        <Col md={6} lg={3} sm={12} xs={12}>
                            <div className="mb-4"
                                style={{
                                    border: '2px dashed #cccccc',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#f5f5f5'
                                }}
                            >
                                <h3 className="cardTitle" style={{ borderRadius: '10px', fontSize: '20px', fontWeight: '600' }}>MOU</h3>
                                <div className="d-flex" style={{ justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_mou_accepted}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Approved</p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_mou_rejected}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Rejected</p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_mou_pending}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Pending</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} lg={3} sm={12} xs={12}>
                            <div className="mb-4"
                                style={{
                                    border: '2px dashed #cccccc',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#f5f5f5'
                                }}
                            >
                                <h3 className="cardTitle" style={{ fontSize: '20px', fontWeight: '600' }} >Email Status</h3>
                                <div className="d-flex" style={{ justifyContent: 'space-evenly' }}>
                                    <div>
                                        <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_institutes_email_sent}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Sent</p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_institutes_email_not_sent}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Not Sent</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} lg={3} sm={12} xs={12}>
                            <div className="mb-4"
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
                                        <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_institutes_onboarding_onboarded}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Onboarded</p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_institutes_onboarding_invited}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Invited</p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_institutes_onboarding_pending}</h3>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>Pending</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </SecCard>
            </div>
            <div className={css.filterBtns}>
                {/* <button
                    className={css.sortTypeBtn}
                    onClick={() => setSortType(!sortType)}
                >
                    Sort Type - ({sortType ? "Ascending" : "Descending"})
                </button> */}
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
                                paginationModel: { pageSize: 7, page: 0 },
                            },
                        }}
                        slots={{ columnMenu: CustomColumnMenu, toolbar: GridToolbar }}
                    // checkboxSelection
                    // disableRowSelectionOnClick
                    />
                    {/* <div className={css.paginationBtns}>
                        <button
                            className={css.prevBtn}
                            onClick={() => decrement()}
                        >
                            Prev
                        </button>
                        <span>
                            Page: {page} of {totalPages}
                        </span>
                        <button
                            className={css.nextBtn}
                            onClick={() => increment()}
                        >
                            Next
                        </button>
                    </div> */}
                </div>
            )}
        </div>
    );
};

export default AdminInstitutes;

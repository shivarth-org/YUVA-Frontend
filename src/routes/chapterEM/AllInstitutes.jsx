import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import FileUpload from "../../components/common/FileUpload";
import { DataGrid, GridColumnMenu, GridToolbar } from '@mui/x-data-grid';
import Loader from "../../components/common/Loader";
import Badge from '@mui/material/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
// import Dropdown from 'react-bootstrap/Dropdown';
import InstituteDropDown from "../../components/common/InstituteDropDown";
import { green, yellow, red, deepPurple } from '@mui/material/colors';
import { SERVER_ORIGIN } from "../../utilities/constants";
import HeaderCard from "../../components/common/HeaderCard";
import InstututeMoU from "../institute/InstututeMoU";
import css from "../../css/admin/users-page.module.css";
import DownloadExcel from "../../components/common/DownloadExcel";

const AllInstitute = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(0);
    const [allInstitutes, setAllInstitutes] = useState([]);
    const [page, setPage] = useState(1);
    const [sortType, setSortType] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [mouStatus, setMouStatus] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedInstituteId, setSelectedInstituteId] = useState(null); // New state for selected institute ID

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };

    const navigate = useNavigate();

    useEffect(() => {
        async function getAll() {
            setIsLoading(true);

            try {
                const em_id = sessionStorage.getItem('_id');
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/em/auth/institute/all?page=${page}&limit=${limit}&search=${searchQuery}&sortBy=name&sortType=${sortType === true ? "asc" : "desc"}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                        },
                        body: JSON.stringify({ _id: em_id }),
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
                } else if (response.status === 200) {
                    setAllInstitutes(result.filteredInstitutes);
                    setTotalPages(result.totalPages);
                    setMouStatus(result.filteredInstitutes.mouStatus);
                }
            } catch (err) {
                setIsLoading(false);
            }
        }

        getAll();
        const verifyToken = async () => {
            // const userId = process.env.REACT_APP_USER_ID;
            // const userPassword = process.env.REACT_APP_USER_PASSWORD;
            //  const basicAuth = btoa(`${userId}:${userPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/em/auth/verify-token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": sessionStorage.getItem("token"),
                        // "Authorization": `Basic ${basicAuth}`,
                    },
                }
            );
            const result = await response.json();
            if (result.userDoc) {
                // setIsUserLoggedIn(true);
            }
            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    navigate("/");
                } else if (response.status === 500) {
                    toast.error(result.statusText);
                }
            }
        }
        verifyToken()
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
        return (
            <Badge>
                <span style={{ backgroundColor: statusColor, padding: '6.4px 16px', borderRadius: '8px', color: textColor }}>
                    {statusText}
                </span>
            </Badge>
        );
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
        return (
            <Badge>
                <span style={{ borderRadius: '8px', backgroundColor: statusColor, padding: '6.4px 16px', color: textColor }}>
                    {statusText}
                </span>
            </Badge>
        );
    }

    const rows = allInstitutes.map((institute, idx) => ({ ...institute, 'id': idx + 1 }));

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90,
            // renderCell: (params) => params.id++

        },
        {
            field: 'name',
            headerName: 'Institute Name',
            width: 170,
            // editable: true,
        },
        {
            field: 'officerName',
            headerName: 'Nodal Officer Name',
            width: 150,
            // editable: true,
        },
        {
            field: 'officerNumber',
            headerName: 'Nodal Officer Number',
            width: 150,
            // editable: true,
        },
        {
            field: 'officerEmail',
            headerName: 'Nodal Officer Email',
            width: 200,
            // editable: true,
        },
        {
            field: 'designation',
            headerName: 'Designation',
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
            field: 'state',
            headerName: 'State',
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
            field: 'chapterName',
            headerName: 'Chapter Name',
            width: 150,
            // editable: true,
        },
        {
            field: 'country',
            headerName: 'Country',
            width: 150,
            // editable: true,
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
            headerName: 'View MOU',
            // type: 'button',
            width: 250,
            renderCell: (params) => {
                // const { row: { _id } } = params;
                setSelectedInstituteId(params.row._id);
                return (
                    <div className="d-flex justify-content-between">
                        <div>
                            <InstututeMoU
                                show={isOpen}
                                intituteID={params.row._id}
                                onHide={handleButtonClick}
                                text={"Check MOU"}
                                onClick={handleButtonClick}

                            />
                        </div>
                        <div className="mx-3">
                            <InstituteDropDown _id={params.row._id} />
                        </div>
                    </div>
                );
            }
        },
    ];

    const handleRowClick = (params) => {
        // setSelectedInstituteId(params.row._id);
        // console.log(params.row_id);
        setIsOpen(true);
    };


    function handleInstitutesClick() {
        navigate("/institutes/insert");
    }

    function CustomColumnMenu(props) {
        return (
            <GridColumnMenu
                {...props}
                slots={{}}
                slotProps={{}}
            />
        );
    }

    return (
        <div className={css.outerDiv}>
            <HeaderCard>
                <h1 className="headerTitle">Institutes</h1>
                <hr />
                <p className="headerSubtitle">
                    You can see the institute list here
                </p>
                <p className="headerSubtitle">
                    Note: Once created, only the institute will be able to update the profile.
                </p>
                {/* <DownloadExcel /> */}
                <div className='d-flex justify-content-center align-items-baseline mt-3'>
                    <div>
                        {/* <FileUpload /> */}
                    </div>
                    <div>
                        <button
                            className={`${css.fileUploadBtn} commonBtn`}
                            onClick={handleInstitutesClick}
                        >
                            <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff", marginRight: "5px" }} /> Add Institute
                        </button>
                    </div>
                </div>
            </HeaderCard>
            <div className={css.filterBtns}>
                <div className='d-flex' style={{ position: 'relative', justifyContent: 'end', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        placeholder="Search from the list"
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                        onRowClick={handleRowClick} // Add this line to handle row clicks
                        slots={{ columnMenu: CustomColumnMenu, toolbar: GridToolbar }}
                    />
                </div>
            )}
        </div>
    );
};

export default AllInstitute;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import FileUpload from "../../components/common/FileUpload";
import { DataGrid, GridColumnMenu } from '@mui/x-data-grid';
import Loader from "../../components/common/Loader";
import Badge from '@mui/material/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { green, yellow, red, deepPurple } from '@mui/material/colors';
import { SERVER_ORIGIN } from "../../utilities/constants";
import HeaderCard from "../../components/common/HeaderCard";
// import { refreshScreen } from "../../utilities/helper_functions";

import css from "../../css/admin/users-page.module.css";
import DownloadExcel from "../../components/common/DownloadExcel";

// localhost:800/users/all?page=1&limit=10&search=abhishek&sortBy=fName&sortType=desc


const AdminInstitutes = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(0);
    const [allInstitutes, setAllInstitutes] = useState([]);
    const [page, setPage] = useState(1);
    const [sortType, setSortType] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [mouStatus, setMouStatus] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    // const [rerender, setRerender] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        async function getAllChapters() {
            setIsLoading(true);

            try {
                // const adminId = process.env.REACT_APP_ADMIN_ID;
                // const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                // const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/chapter/auth/get-all?page=${page}&limit=${limit}&search=${searchQuery}&sortBy=name&sortType=${sortType === true ? "asc" : "desc"
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
                        navigate("/admin/login");
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.status === 200) {
                    setAllInstitutes(result.filteredChapters);
                    setTotalPages(result.totalPages);
                    // setMouStatus(result.filteredChapters)
                    // console.log(mouStatus, "setIsLoading")
                } else {
                    // for future
                }
            } catch (err) {
                setIsLoading(false);
            }
        }
        getAllChapters();
    }, [page, sortType, searchQuery, navigate]);
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
                statusText = 'Onboarded';
                textColor = "white";
                break;
            case 'rejected':
                statusColor = red[500];
                statusText = 'Onboarded';
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
    const handelChapterRemove = async (_id) => {
        try {
            const response = await fetch(`${SERVER_ORIGIN}/api/chapter/auth/dlt/${_id}`, {
                method: 'POST',
                headers: {
                    'auth-token': sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.status >= 300) {
                toast.error(result.statusText);
            } else {
                toast.success(result.statusText);
            }
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            toast.error(error.message);
        } finally {

        }
    }

    const rows = allInstitutes.map((institute, idx) => ({ ...institute, 'id': idx + 1 }))
    // let rowIndexCounter = 0;
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90,
            // renderCell: (params) => params.id++

        },
        {
            field: 'chapter_name',
            headerName: 'Chapter Name',
            width: 170,
            // editable: true,
        },
        {
            field: 'region',
            headerName: 'Region Name',
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
            headerName: 'Action',
            type: 'button',
            width: 200,
            renderCell: (params) => {
                const { row: { _id } } = params;
                const handleRemoveClick = () => {
                    setOpenDialog(true);
                    setSelectedId(_id);
                };
                return (
                    <div onClick={handleRemoveClick}>
                        <FontAwesomeIcon icon={faTrash} style={{ color: "red", marginRight: "5px", cursor: "pointer" }} />
                    </div>
                );
            }
        }
    ];
    // console.log(allInstitutes)


    function handleChapterClick() {
        navigate("/admin/chapter/insert");
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
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleDeleteConfirm = async (id) => {
        await handelChapterRemove(id);
        setOpenDialog(false);
    };

    return (
        <div className={css.outerDiv}>
            <HeaderCard>
                <h1 className="headerTitle">Chapters</h1>

                <hr />
                <p className="headerSubtitle">
                    You can view the chapter list.
                </p>
                <p className="headerSubtitle">
                    Note: No change can be done once added.
                </p>

                {/* <DownloadExcel /> */}
                <div className='d-flex justify-content-evenly align-items-baseline mt-3'>
                    {/* <div>

                        <FileUpload />
                    </div> */}
                    <div >
                        <button
                            className={`${css.fileUploadBtn} commonBtn`}
                            onClick={handleChapterClick}
                        >
                            <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff", marginRight: "5px" }} /> Add Chapter
                        </button>
                    </div>
                </div>
            </HeaderCard>
            <div className={css.filterBtns}>
                {/* <button
                    className={css.sortTypeBtn}
                    onClick={() => setSortType(!sortType)}
                >
                    Sort Type - ({sortType ? "Ascending" : "Descending"})
                </button> */}
                <div className={css.searchInputs}>
                    <div className='d-flex' style={{ position: 'relative', justifyContent: 'end', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search from chapter list"
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
                        slots={{ columnMenu: CustomColumnMenu }}
                    // checkboxSelection
                    // disableRowSelectionOnClick
                    />
                    <Dialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Delete</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure, you want to delete this record?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleDeleteConfirm(selectedId)}>Yes</Button>
                            <Button onClick={handleDialogClose}>No</Button>
                        </DialogActions>
                    </Dialog>

                </div>
            )}
        </div>
    );
};

export default AdminInstitutes;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
// import FileUpload from "../../components/common/FileUpload";
import { DataGrid, GridColumnMenu } from '@mui/x-data-grid';
import Loader from "../../components/common/Loader";
// import Badge from '@mui/material/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';

// import { green, yellow, red, deepPurple } from '@mui/material/colors';
import { SERVER_ORIGIN } from "../../utilities/constants";
import HeaderCard from "../../components/common/HeaderCard";
// import { refreshScreen } from "../../utilities/helper_functions";

import css from "../../css/admin/users-page.module.css";
// import DownloadExcel from "../../components/common/DownloadExcel";

// localhost:800/users/all?page=1&limit=10&search=abhishek&sortBy=fName&sortType=desc


const AllRegions = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(0);
    const [allInstitutes, setAllInstitutes] = useState([]);
    const [page, setPage] = useState(1);
    const [sortType, setSortType] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    // const [mouStatus, setMouStatus] = useState("");
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
                    `${SERVER_ORIGIN}/api/region/auth/get-all?page=${page}&limit=${limit}&search=${searchQuery}&sortBy=name&sortType=${sortType === true ? "asc" : "desc"
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
                    setAllInstitutes(result.filteredRegions);
                    setTotalPages(result.totalPages);
                } else {
                    // for future
                }
            } catch (err) {
                setIsLoading(false);
            }
        }

        getAllChapters();
    }, [page, sortType, searchQuery, navigate, limit]);
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
        } catch (error) {
            toast.error(error.message);
        } finally {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
    const rows = allInstitutes.map((institute, idx) => ({ ...institute, 'id': idx + 1 }))
    // let rowIndexCounter = 0;
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 200,
        },
        {
            field: 'name',
            headerName: 'Region Name',
            width: 800,
            editable: true,
        },
        // {
        //     headerName: 'Remove',
        //     align: 'center',
        //     type: 'button',
        //     width: 80,
        //     renderCell: (params) => {
        //         const { row: { _id } } = params;
        //         const handleRemoveClick = () => {
        //             handelChapterRemove(_id);
        //         };
        //         return (
        //             <div onClick={handleRemoveClick}>
        //                 <FontAwesomeIcon icon={faTrash} style={{ color: "red", marginRight: "5px", cursor: "pointer" }} />
        //             </div>
        //         );
        //     }
        // }
    ];

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
                <h1 className="headerTitle">Regions</h1>
                <hr />
                <p className="headerSubtitle">
                    You can view the region list.
                </p>
                <p className="headerSubtitle">
                    Note: No change can be done here.
                </p>
            </HeaderCard>
            <div className={css.filterBtns}>
                <div className={css.searchInputs}>
                    <div className='d-flex' style={{ position: 'relative', justifyContent: 'end', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search from region list"
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
                        slotProps={{
                            loadingOverlay: {
                                variant: 'skeleton',
                                noRowsVariant: 'skeleton',
                            },
                        }}
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
                </div>
            )}
        </div>
    );
};

export default AllRegions;

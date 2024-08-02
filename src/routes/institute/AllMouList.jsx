import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loader from "../../components/common/Loader";
import { SERVER_ORIGIN } from "../../utilities/constants";
import css from "../../css/admin/users-page.module.css";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from "@mui/material";

const AdminInstitutes = () => {
    const { _id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(0);
    const [allInstitutes, setAllInstituteMous] = useState([]);
    const [page, setPage] = useState(1);
    const [sortType, setSortType] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [mouStatus, setMouStatus] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        async function getAllInstitutes() {
            setIsLoading(true);

            try {
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/institute/auth/fetch-mou`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            //Authorization: `Basic ${basicAuth}`, // Include Basic Authentication
                            "auth-token": sessionStorage.getItem("token"),
                        },
                        body: JSON.stringify({ _id: _id }),
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
                    setAllInstituteMous(result.fullData.allMouUrl);
                    // setTotalPages(result.totalPages);
                    // setMouStatus(result.filteredInstitutes.mouStatus)
                    // console.log(mouStatus, "setIsLoading")
                } else {
                    // for future
                }
            } catch (err) {
                setIsLoading(false);
            }
        }
        getAllInstitutes();
    }, []);
    const rows = allInstitutes.map((institute, idx) => ({ ...institute, 'id': idx + 1 }))

    return (
        <div className={css.outerDiv}>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <div className="mb-3">
                        <h2 className={css.heading}>All MOU's</h2>
                    </div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sr. No.</TableCell>
                                    <TableCell align="left">MOU&nbsp;Duration (Years)</TableCell>
                                    <TableCell align="left">Sign&nbsp;Date</TableCell>
                                    <TableCell align="left">View</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="left">{row.mouDuration}</TableCell>
                                        <TableCell align="left">{new Date(row.signDate).toLocaleDateString()}</TableCell>
                                        <TableCell align="left">
                                            <TableCell align="left">
                                                <Link
                                                    href={row.mou_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View
                                                </Link>
                                            </TableCell>

                                        </TableCell>

                                        {/* <TableCell align="right">{row.protein}</TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
        </div>
    );
};

export default AdminInstitutes;

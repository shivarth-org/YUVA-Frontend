import React, { useState, useCallback, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { toast } from 'react-hot-toast';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
// import TopicIcon from '@mui/icons-material/Topic';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { useNavigate } from 'react-router-dom';
import { SERVER_ORIGIN } from '../../utilities/constants';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Modal, Row, Col } from 'react-bootstrap';
import SecCard from '../../components/common/SecCard';
import userTypeModalCss from '../../css/common/user-type-modal.module.css';
import EM from "../../css/chapterEM/add-chapterEM.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import css from '../../css/admin/home-page.module.css';
import { useDropzone } from 'react-dropzone';
import upload_img from '../../assets/images/Download-bro.svg';

const DateSelect = ({ selectedYear, handleYearChange }) => {
    const handleChange = (date) => {
        if (date) {
            handleYearChange({
                target: {
                    name: "signDate", value: `${date.getMonth() + 1}/${date.getDate()
                        }/${date.getFullYear()}`
                }
            });
        }
        console.log(date, "date");
    };

    return (
        <DatePicker
            selected={selectedYear}
            onChange={handleChange}
            // showYearPicker
            // dateFormat="yyyy"
            className={`${EM.chapterEMInput} w-100`}
            placeholderText="Select MOU Sign Date"


        />
    );
};


const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        disableScrollLock={true}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));



export default function CustomizedMenus({ _id }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [userType, setUserType] = React.useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    // const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);

    const [selectedImage1, setSelectedImage1] = useState(null);
    const [imageBlob1, setImageBlob1] = useState(null);
    const [selectedImage2, setSelectedImage2] = useState(null);
    const [imageBlob2, setImageBlob2] = useState(null);
    const [instituteForm, setInstituteForm] = useState({
        instituteName: "",
        nodalName: "",
        officeLocation: "",
        signatoryDesignation: "",
        mouDuration: "",
        signDate: ""

    });
    const [loading, setLoading] = useState(false);
    const [mouURL, setMouUrl] = useState(`http://yuva.evalue8.info/new-mou-sample-pdf.pdf`)

    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        const userType = sessionStorage.getItem('userType');
        setUserType(userType);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDigitalSign = async () => {
        try {
            const response = await fetch(`${SERVER_ORIGIN}/api/em/auth/approve-digital-sign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': sessionStorage.getItem('token'),
                },
                body: JSON.stringify({ _id: _id }),
            });
            const result = await response.json();
            if (!response.status >= 300) {
                throw new Error('Failed, something went wrong');
            } else {
                toast.success(result.statusText)
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
        handleClose()
        handleClose2()
    };

    const handleManageAccounts = () => {
        handleClose();
        if (sessionStorage.getItem('userType') === 'em') {
            navigate(`/institute-profile/${_id}`);
        } else {
            navigate(`/admin/institute-profile/${_id}`)
        }
    };
    useEffect(() => {
        (async function () {
            try {
                const response = await fetch(`${SERVER_ORIGIN}/api/institute/auth/check-mou`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify({ _id: _id }),
                });
                const result = await response.json();
                if (!response.status >= 300) {
                    throw new Error('Failed to upload PDFs');
                } else {
                    if (result.data.docUrl.includes('.pdf')) {
                        setMouUrl(result.data.docUrl)
                    }
                    // console.log(result,"http://localhost:8080/663d2ba6009ef886dd687f5f_mou.pdf");
                    setInstituteForm({
                        instituteName: result.data.name,
                        nodalName: result.data.officerName,
                        officeLocation: result.data.city + ", " + result.data.state,
                        signatoryDesignation: result.data.designation ?? "",
                        mouDuration: result.data.mouDuration,
                        signDate: result.data.signDate
                    });

                    // if (isMouSigned === false) {
                    //     setIsMouSigned(result.data.isMOUsigned)
                    // } else if (result.data.isMOUapproved === true) {
                    //     setIsMouSigned(true)
                    // } else if (result.data.isMOUrejected) {
                    //     setIsMouSigned(false)
                    // }
                }

            } catch (error) {
                toast.error(error.message);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } finally {
                setLoading(false);

            }
        })()
    }, [_id]);

    const handleInvitedStudents = () => {
        handleClose();
        if (sessionStorage.getItem('userType') === 'em') {
            navigate(`/institute-students/${_id}`);
        } else {
            navigate(`/admin/institute-students/${_id}`)
        }
    };
    const handleAllMouUploaded = () => {
        handleClose();
        if (sessionStorage.getItem('userType') === 'em') {
            navigate(`/institute/mou/all/${_id}`);
        } else {
            navigate(`/admin/institute/mou/all/${_id}`)
        }
    };

    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`${SERVER_ORIGIN}/api/institute/auth/dlt/${_id}`, {
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
        handleDialogClose();
        handleClose();
    };
    const onChange = (e) => {
        const { name, value } = e.target;
        setInstituteForm({ ...instituteForm, [name]: value });
    };

    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    const handleClose2 = () => { setShow2(false); };
    const handleShow2 = () => { setShow2(true) };
    // const handelManualUpload = () => setIsMouManual(true)
    const handleClick2 = () => {
        // handleClose();
        handleShow2();
        // handelManualUpload();
        handleClose();
    };

    const handleInputChange = (e) => {
        setInstituteForm({ ...instituteForm, [e.target.name]: e.target.value });
    };

    const logImageBlob = async () => {
        if (!instituteForm.mouDuration) {
            toast.error('Please fill MOU duration')
        } else if (!instituteForm.signDate) {
            toast.error('Please fill sign date')
        } else {
            loadMouData()
        }
        // }
    };

    const loadMouData = async () => {
        setLoading(true);
        try {
            const institute_id = _id
            const formData = new FormData();
            formData.append('instituteName', instituteForm.instituteName);
            formData.append('nodalName', instituteForm.nodalName);
            formData.append('officeLocation', instituteForm.officeLocation);
            formData.append('signatoryDesignation', instituteForm.signatoryDesignation);
            formData.append('mouDuration', instituteForm.mouDuration);
            formData.append('institute_id', institute_id);
            formData.append('signDate', instituteForm.signDate);
            formData.append('document_file', imageBlob1);
            formData.append('document_file', imageBlob2);
            const response = await fetch(`${SERVER_ORIGIN}/api/institute/auth/${!selectedImage2 ? 'modify-pdf' : 'manual-mou'}`, {
                method: 'POST',
                headers: {
                    'auth-token': sessionStorage.getItem('token'),
                },
                body: formData,
            });
            const result = await response.json();
            // console.log(result);
            if (!response.status >= 300) {
                throw new Error('Failed to upload PDFs');
            } else {
                setSelectedImage1(null);
                toast.success('File uploaded successfully');
                setLoading(false);
                // console.log(result)
                // toast.success('MOU Updated Successfully');
            }
            handleClose();
        } catch (error) {
            // toast.error('Failed to Update MOU');
            // console.log(error);
            toast.error(error.message)
        } finally {
            setLoading(false);
            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
        }
    }
    const onDrop2 = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.type === 'application/pdf') {
                setSelectedImage2(URL.createObjectURL(file));
                setImageBlob1(file);
            } else {
                toast.error('Only .pdf files are allowed.');
            }
        }
    }, []);
    const clearImage2 = () => {
        setSelectedImage2(null);
        setImageBlob2(null);
        toast.success('File removed successfully');
    };

    // const { getRootProps: getRootProps1, getInputProps: getInputProps1, isDragActive: isDragActive1 } = useDropzone({ onDrop: onDrop1 });
    const { getRootProps: getRootProps2, getInputProps: getInputProps2, isDragActive: isDragActive2 } = useDropzone({ onDrop: onDrop2 });

    return (
        <div>
            {show2 &&

                <Modal show={show2} onHide={handleClose2} size="xl">
                    <Modal.Header closeButton>MOU</Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6} className={userTypeModalCss.col1}>
                                <SecCard>
                                    <div className="my-3">
                                        <b>Download this MOU for more clarity...</b>
                                    </div>
                                    <embed src={mouURL} type="application/pdf" width="100%" height="695px" />
                                </SecCard>
                            </Col>
                            <Col sm={6} className={userTypeModalCss.col1}>
                                <SecCard className="m-0">
                                    <div style={{ marginBottom: "0.8rem" }}>
                                        <label className={EM.chapterEMLabel} htmlFor="mouDuration">
                                            MOU Duration
                                        </label>
                                        <select
                                            className={EM.chapterEMInput}
                                            id="mouDuration"
                                            name="mouDuration"
                                            value={instituteForm.mouDuration}
                                            onChange={onChange}
                                        >
                                            {/* {
                                                instituteForm.mouDuration === "" ?
                                                    <> */}
                                            <option value="">-- Select Duration --</option>
                                            <option value="1">1 Year</option>
                                            <option value="2">2 Years</option>
                                            <option value="3">3 Years</option>
                                            {/* </>
                                                    :
                                                    <>
                                                        <option value={instituteForm.mouDuration}>{instituteForm.mouDuration}</option>
                                                    </>
                                            } */}
                                        </select>
                                    </div>
                                    <div style={{ marginBottom: "0.8rem" }}>
                                        <label className={EM.chapterEMLabel} htmlFor="signDate">
                                            MOU Sign Date  <span style={{ color: "red" }}>*</span>{" "}
                                        </label>
                                        <div className="w-100">
                                            <DateSelect
                                                selectedYear={instituteForm.signDate}
                                                handleYearChange={handleInputChange}
                                                className='w-100'
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: "0.8rem" }}>
                                        <div
                                            {...getRootProps2()}
                                            style={{
                                                border: '2px dashed #cccccc',
                                                padding: '1rem',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                backgroundColor: `${isDragActive2 ? '#00850026' : '#f5f5f5'}`

                                            }}
                                        >
                                            <p><b>Upload the signed MOU</b></p>
                                            <input {...getInputProps2()} style={{ display: 'none' }} />
                                            {selectedImage2 ? (
                                                <>
                                                    <embed src={selectedImage2} type="application/pdf" width="100%" height="485px" />
                                                    <button
                                                        className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`}
                                                        style={{ marginLeft: '10px' }}
                                                        onClick={clearImage2}
                                                        disabled={loading}
                                                    >
                                                        Dump MOU
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {isDragActive2 ? (
                                                        <p>
                                                            <img src={upload_img} alt="upload" width="100%" height="300px" />
                                                            <b>Drop the files here.</b>
                                                        </p>
                                                    ) : (
                                                        <>
                                                            <img src={upload_img} alt="upload" width="100%" height="300px" />
                                                            <p>
                                                                <b>Drag 'n' drop the file here, or click to select file. (Only .pdf is allowed)</b>
                                                            </p>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <button
                                            className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`}
                                            style={{ marginLeft: '10px' }}
                                            onClick={logImageBlob}
                                            disabled={loading}
                                        >
                                            {loading ? 'Uploading...' : 'Save Files'}
                                        </button>
                                    </div>
                                </SecCard>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            }

            <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
            >
                <SettingsOutlinedIcon />
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}

            >
                {/* <MenuItem onClick={handleInvitedStudents} key="invited-students">
                    <RecentActorsOutlinedIcon />
                    View Current MOU
                </MenuItem> */}
                <MenuItem onClick={handleClick2} key="invited-students">
                    <FileUploadOutlinedIcon />
                    Upload Manual MOU
                </MenuItem>

                <MenuItem onClick={handleDigitalSign} key="invited-students">
                    <DrawOutlinedIcon />
                    Send Digital MOU
                </MenuItem>
                <MenuItem onClick={handleAllMouUploaded} key="invited-students">
                    <FolderOpenOutlinedIcon />
                    All MOU's Uploaded
                </MenuItem>
                <MenuItem onClick={handleInvitedStudents} key="invited-students">
                    <RecentActorsOutlinedIcon />
                    Invited Students
                </MenuItem>
                <MenuItem onClick={handleManageAccounts} disableRipple key="manage-accounts">
                    <ManageAccountsOutlinedIcon />
                    More Details
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} disableRipple key="delete">
                    <DeleteForeverOutlinedIcon />
                    Delete
                </MenuItem>
            </StyledMenu>
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure, you want to delete this record?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
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
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'; 
import { useNavigate } from 'react-router-dom';
import { SERVER_ORIGIN } from '../../utilities/constants';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EmMouView from '../../routes/institute/EmMouView'
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import MenuItem from '@mui/material/MenuItem';
// import { toast } from 'react-hot-toast';
// import { useNavigate, useParams } from 'react-router-dom';
// import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
// import { useDropzone } from 'react-dropzone'; (Optional for future file upload)
// import { useUserType } from '../common/UserTypeContext';
// import { SERVER_ORIGIN } from '../../utilities/constants';
import css from '../../css/admin/home-page.module.css';
import userTypeModalCss from '../../css/common/user-type-modal.module.css';
import SecCard from '../../components/common/SecCard';


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
    const [isOpen, setIsOpen] = useState(false);
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

    const handleManageAccounts = () => {
        navigate(`/em-profile/${_id}`);
        handleClose();
    };

    const handleInvitedStudents = () => {
        handleClose();
        navigate(`/em-institutes/${_id}`);
    };
    const handleButtonClick = (id) => {
        // setSelectedId(id);
        setIsOpen(!isOpen);
    };


    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewMou = () => {
        setIsModalOpen(true);
        handleClose();
    };



    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleClick2 = () => {
        // handleClose();
        handleShow2();
        // handelManualUpload();
        handleClose();
    };
    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`${SERVER_ORIGIN}/api/em/auth/dlt/${_id}`, {
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
                // window.location.reload();
            }, 1000);
        }
        handleDialogClose();
        handleClose();
    };
    // const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [bodyParamApprove, setBodyParamApprove] = useState({ isMOUapproved: true, isMOUrejected: false });
    const [bodyParamReject, setBodyParamReject] = useState({ isMOUapproved: false, isMOUrejected: true });
    const [mouDoc, setMouDoc] = useState("")
    const [loading, setLoading] = useState(false);

    const fetch_mou = async () => {
        try {
            setLoading(true); // Indicate loading state
            // console.log(_id, "akskgaskgajkg");
            // // const _id = _id;
            // console.log(
            //     _id, "this is the id"
            // );
            const response = await fetch(`${SERVER_ORIGIN}/api/em/auth/fetch-em-mou`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': sessionStorage.getItem('token'),
                },
                body: JSON.stringify({ _id: _id }),
            });

            if (!response.ok) {
                throw new Error('Failed to update MOU');
            }
            const result = await response.json();
            setMouDoc(result.data)
            // toast.success('MOU fetched successfully');
            // handleClose(); // Close modal on success
        } catch (error) {
            console.error('Error updating MOU:', error.message);
            toast.error('Failed to update MOU');
        } finally {
            setLoading(false); // Clear loading state
        }
        handleClose()
        // handleClose2()
    }
    // useEffect(() => {
    //     if (!userType) {
    //         // setUserTypeToInstitute();
    //     }
    //     if (show) {
    //         // fetch_mou()
    //     }
    // }, [userType, show]);


    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => { setShow(true); fetch_mou(); setShow2(true) }
    const handleMoUAccept = async () => {

        try {
            setLoading(true); // Indicate loading state
            const response = await fetch(`${SERVER_ORIGIN}/api/em/auth/mou-action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': sessionStorage.getItem('token'),
                },
                body: JSON.stringify({ ...bodyParamApprove, _id: _id }), // Include _id and updated state values
            });

            if (!response.ok) {
                throw new Error('Failed to update MOU');
            }
            // toast.success('MOU accepted successfully');
            handleClose(); // Close modal on success
            window.location.reload();
        } catch (error) {
            console.error('Error updating MOU:', error.message);
            toast.error('Failed to update MOU');
        } finally {
            setLoading(false); // Clear loading state
        }
    };

    const handleMouReject = async () => {
        try {
            setLoading(true); // Indicate loading state

            const response = await fetch(`${SERVER_ORIGIN}/api/em/auth/mou-action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': sessionStorage.getItem('token'),
                },
                body: JSON.stringify({ ...bodyParamReject, _id: _id }), // Include _id and updated state values
            });

            if (!response.ok) {
                throw new Error('Failed to update MOU');
            }

            toast.success('MOU rejected successfully');
            handleClose(); // Close modal on success
            window.location.reload();
        } catch (error) {
            console.error('Error updating MOU:', error.message);
            toast.error('Failed to update MOU');
        } finally {
            setLoading(false); // Clear loading state
        }
    };
    return (
        <div>
            {show2 && 
                <Modal show={show2} onHide={handleClose2} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>Signed MOU</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12} className={userTypeModalCss.col1}>
                                <SecCard>
                                    <div className="my-3">
                                        <b>This MOU has been uploaded by the Chapter EM</b>
                                    </div>
                                    <embed
                                        src={mouDoc}
                                        type='application/pdf'
                                        title="PDF Document"
                                        width="100%"
                                        height="686px"
                                    />
                                    {/* <embed src={mouDoc} type="application/pdf" width="100%" height="686px" /> */}
                                </SecCard>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <div><br /></div>
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
                {/* <MenuItem onClick={handleViewMou} disableRipple key="invited-students" >
                    <PictureAsPdfOutlinedIcon /> View MOU
                </MenuItem> */}


                <MenuItem onClick={handleClick2} disableRipple key="invited-students" >
                    <PictureAsPdfOutlinedIcon /> View MOU
                </MenuItem>
                {/* <Button className={`${css.viewBtn} commonBtn text-ff1 navbar-right`} style={{ background: '#0d5e9c' }} onClick={handleShow}>
                {text ? text : 'Click Me'}
            </Button> */}
               

                <MenuItem
                    onClick={handleInvitedStudents}
                    disableRipple
                    key="invited-students"
                >
                    <RecentActorsOutlinedIcon />
                    Invited Institutes
                </MenuItem>
                <MenuItem
                    onClick={handleManageAccounts}
                    disableRipple
                    key="manage-accounts"
                >
                    <ManageAccountsOutlinedIcon />
                    More Details
                </MenuItem>
                <MenuItem
                    onClick={handleDeleteClick}
                    disableRipple
                    key="delete"
                >
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


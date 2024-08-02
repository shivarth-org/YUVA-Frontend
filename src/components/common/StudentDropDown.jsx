import * as React from 'react';
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
import { useNavigate } from 'react-router-dom';
import { SERVER_ORIGIN } from '../../utilities/constants';

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
        navigate(`/institute-profile/${_id}`);
        handleClose();
    };

    const handleInvitedStudents = () => {
        handleClose();
        navigate(`/institute-students/${_id}`)
    };

    const handleDelete = async () => {
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
        handleClose();
    };

    return (
        <div>
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
                <MenuItem onClick={handleManageAccounts} disableRipple key="manage-accounts">
                    <ManageAccountsOutlinedIcon />
                    More Details
                </MenuItem>
                <MenuItem onClick={handleInvitedStudents} disableRipple key="invited-students">
                    <RecentActorsOutlinedIcon />
                    Invited Students
                </MenuItem>
                <MenuItem onClick={handleDelete} disableRipple key="delete">
                    <DeleteForeverOutlinedIcon />
                    Delete
                </MenuItem>
            </StyledMenu>
        </div>
    );
}

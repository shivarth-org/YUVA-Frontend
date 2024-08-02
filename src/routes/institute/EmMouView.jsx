import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MenuItem from '@mui/material/MenuItem';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'; 
// import { useDropzone } from 'react-dropzone'; (Optional for future file upload)
import { useUserType } from '../common/UserTypeContext';
import { SERVER_ORIGIN } from '../../utilities/constants';
import css from '../../css/admin/home-page.module.css';
import userTypeModalCss from '../../css/common/user-type-modal.module.css';
import SecCard from '../../components/common/SecCard';
// import pdf_doc from '../../assets/images/file-sample_150kB.pdf';

const MouPreviewForEMandInstitute = ({ text, _id }) => {
    // console.log(intituteID, "Jhahsgfhagshfagahgsahf");
    const { userType} = useUserType();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
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
    }
    useEffect(() => {
        if (!userType) {
            // setUserTypeToInstitute();
        }
        if (show) {
            // fetch_mou()
        }
    }, [userType, show]);


    const handleClose = () => setShow(false);
    const handleShow = () => { setShow(true); fetch_mou() }
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

    // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <>
            <MenuItem onClick={handleShow} disableRipple key="invited-students" >
                <PictureAsPdfOutlinedIcon /> View MOU
            </MenuItem>
            {/* <Button className={`${css.viewBtn} commonBtn text-ff1 navbar-right`} style={{ background: '#0d5e9c' }} onClick={handleShow}>
                {text ? text : 'Click Me'}
            </Button> */}
            <Modal show={show} onHide={handleClose} size="xl">
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
        </>
    );
};

export default MouPreviewForEMandInstitute;

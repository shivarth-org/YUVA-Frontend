import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
// import { useDropzone } from 'react-dropzone'; (Optional for future file upload)
import { useUserType } from '../../routes/common/UserTypeContext';
import { SERVER_ORIGIN } from '../../utilities/constants';
import css from '../../css/admin/home-page.module.css';
import userTypeModalCss from '../../css/common/user-type-modal.module.css';
import SecCard from '../../components/common/SecCard';
// import pdf_doc from '../../assets/images/file-sample_150kB.pdf';

const MouPreviewForEMandInstitute = ({ text, intituteID }) => {
    // console.log(intituteID, "Jhahsgfhagshfagahgsahf");
    const { userType, setUserTypeToInstitute } = useUserType();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [bodyParamApprove, setBodyParamApprove] = useState({ isMOUapproved: true, isMOUrejected: false });
    const [bodyParamReject, setBodyParamReject] = useState({ isMOUapproved: false, isMOUrejected: true });
    const [mouDoc, setMouDoc] = useState("")
    const [loading, setLoading] = useState(false);
    const [isMouSigned, setIsMouSigned] = useState(false)

    const fetch_mou = async () => {
        try {
            setLoading(true); // Indicate loading state
            // console.log(intituteID, "akskgaskgajkg");
            const _id = intituteID;
            // console.log(
            //     _id, "this is the id"
            // );
            const response = await fetch(`${SERVER_ORIGIN}/api/institute/auth/fetch-mou`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': sessionStorage.getItem('token'),
                },
                body: JSON.stringify({ _id: intituteID }),
            });

            if (!response.ok) {
                throw new Error('Failed to update MOU');
            }
            const result = await response.json();
            setMouDoc(result.data)
            setIsMouSigned(result.fullData.isMOUsigned)
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
    }, []);


    const handleClose = () => setShow(false);
    const handleShow = () => { setShow(true); fetch_mou() }
    const handleMoUAccept = async () => {

        try {
            setLoading(true); // Indicate loading state
            const response = await fetch(`${SERVER_ORIGIN}/api/em/auth/update-mou`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': sessionStorage.getItem('token'),
                },
                body: JSON.stringify({ ...bodyParamApprove, _id: intituteID }), // Include _id and updated state values
            });

            if (!response.ok) {
                throw new Error('Failed to update MOU');
            }
            // toast.success('MOU accepted successfully');
            handleClose(); // Close modal on success
            window.location.reload();
        } catch (error) {
            // console.error('Error updating MOU:', error.message);
            toast.error('Failed to update MOU');
        } finally {
            setLoading(false); // Clear loading state
        }
    };

    const handleMouReject = async () => {
        try {
            setLoading(true); // Indicate loading state

            const response = await fetch(`${SERVER_ORIGIN}/api/em/auth/update-mou`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': sessionStorage.getItem('token'),
                },
                body: JSON.stringify({ ...bodyParamReject, _id: intituteID }), // Include _id and updated state values
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
            <Button className={`${css.viewBtn} commonBtn text-ff1 navbar-right`} style={{ background: '#0d5e9c' }} onClick={handleShow}>
                {text ? text : 'Click Me'}
            </Button>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Upload Signed MOU</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={isMouSigned ? 6 : 12} className={userTypeModalCss.col1}>
                            <SecCard>
                                <div className="my-3">
                                    <b>This MOU has been uploaded by the Institute/Nodal</b>
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
                        {isMouSigned && <Col sm={6} className={userTypeModalCss.col1}>
                            <SecCard className="m-0">
                                <div className="my-3">
                                    <b>Please check and accept/reject the MOU via clicking on the below buttons.</b>
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <Button
                                        className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`}
                                        onClick={handleMoUAccept}
                                        disabled={loading}
                                        // value={bodyParam.isMOUapproved = true}
                                        onChange={onchange}
                                    >
                                        {loading ? 'Accepting...' : 'Accept MOU'}
                                    </Button>
                                    <Button
                                        className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`}
                                        style={{ marginLeft: '10px' }}
                                        onClick={handleMouReject}
                                        disabled={loading}
                                        // value={bodyParam.isMOUrejected = true}
                                        onChange={onchange}
                                    >
                                        {loading ? 'Rejecting...' : 'Reject MOU'}
                                    </Button>
                                </div>
                            </SecCard>
                        </Col>
                        }

                    </Row>
                </Modal.Body>
                <div><br /></div>
            </Modal>
        </>
    );
};

export default MouPreviewForEMandInstitute;

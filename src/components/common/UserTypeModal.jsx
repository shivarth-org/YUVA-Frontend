import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import user from "../../assets/images/001-user.png";
import institute from "../../assets/images/002-institute.png";
import graduated from "../../assets/images/003-graduated.png";
import css from "../../css/user/navbar.module.css";
import userTypeModalCss from "../../css/common/user-type-modal.module.css";
import { useUserType } from '../../routes/common/UserTypeContext';


function UserTypeModal({ text }) {
    const { userType, setUserTypeToAdmin, setUserTypeToUser, setUserTypeToInstitute, setUserTypeToChapterEM } = useUserType();
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleStudentLoginClick = (e) => {
        navigate("/login?userType=student");
        sessionStorage.setItem('userType', "student");
        handleClose();
    };
    const handleInstituteLoginClick = (e) => {
        navigate("/login?userType=institute");
        sessionStorage.setItem('userType', "institute");
        handleClose();
    };
    const handleChapterLoginClick = (e) => {
        navigate("/login?userType=em");
        sessionStorage.setItem('userType', "em");
        handleClose();
    };

    return (
        <>
            <Button className={`${css.navBtn} text-ff1 navbar-right`} onClick={handleShow}>
                {text ? text : "Click Me"}
            </Button>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton style={{ border: 'none' }}>
                    <Modal.Title className={userTypeModalCss.cardTitle}>Login As</Modal.Title>
                </Modal.Header>
                <Modal.Body  >
                    <Row className='d-flex justify-content-evenly'>
                        <Col>
                            <Card className={`mt-2 ${userTypeModalCss.userTypeCard}`} onClick={() => { setUserTypeToUser(); handleStudentLoginClick(); }}>
                                <Card.Img variant="top" src={graduated} style={{ width: '5rem', margin: '5px auto' }} />
                                <Card.Body className='d-flex justify-content-center' >
                                    <Card.Title className={userTypeModalCss.cardTitle}>Student</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className={`mt-2 ${userTypeModalCss.userTypeCard}`} onClick={() => { setUserTypeToInstitute(); handleInstituteLoginClick(); }}>
                                <Card.Img variant="top" src={institute} style={{ width: '5rem', margin: '5px auto' }} />
                                <Card.Body className='d-flex justify-content-center' >
                                    <Card.Title className={userTypeModalCss.cardTitle}>Institute/Nodal</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className={`mt-2 ${userTypeModalCss.userTypeCard}`} onClick={() => { setUserTypeToChapterEM(); handleChapterLoginClick(); }}>
                                <Card.Img variant="top" src={user} style={{ width: '5rem', margin: '5px auto' }} />
                                <Card.Body className='d-flex justify-content-center' >
                                    <Card.Title className={userTypeModalCss.cardTitle}>Chapter EM</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row >

                </Modal.Body >
                <div><br></br></div>
            </Modal >
        </>
    );
}

export default UserTypeModal;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MouModal from "../../components/common/EmMouModal";
import { Row, Col } from "react-bootstrap";
import { toast } from 'react-hot-toast';
// My components
import HeaderCard from "../../components/common/HeaderCard";
import { CardGrid } from "../../components/common/CardGrid";
import SecCard from "../../components/common/SecCard";


// My css
import css from "../../css/admin/home-page.module.css";

import { SERVER_ORIGIN } from "../../utilities/constants";
import Loader from "../../components/common/Loader";
import { useUserType } from "../common/UserTypeContext";

const EMServicePage = () => {
    const { userType, setUserTypeToChapterEM } = useUserType();
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [all_institutes, setAll_institutes] = useState(0)
    const [all_mou_accepted, setAll_mou_accepted] = useState(0)
    const [all_mou_rejected, setAll_mou_rejected] = useState(0)
    const [all_mou_pending, setAll_mou_pending] = useState(0)
    const [all_institutes_onboarding_pending, setAll_institutes_onboarding_pending] = useState(0)
    const [all_institutes_onboarding_invited, setAll_institutes_onboarding_invited] = useState(0)
    const [all_institutes_email_sent, setAll_institutes_email_sent] = useState(0)
    const [all_institutes_onboarding_onboarded, setAll_institutes_onboarding_onboarded] = useState(0)
    const [all_institutes_email_not_sent, setAll_institutes_email_not_sent] = useState(0)
    const [isMouSigned, setIsMouSigned] = useState(false)
    const navigate = useNavigate();
    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        setUserTypeToChapterEM()
        async function canVisitPage() {
            setIsLoading(true);
            try {
                // const adminId = process.env.REACT_APP_ADMIN_ID;
                // const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                // const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/em/auth/verify-token`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                            //Authorization: `Basic ${basicAuth}`,
                        },

                    }
                );

                const result = await response.json();
                // (result);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/login?userType=em");
                    }
                } else if (response.ok && response.status === 200) {

                } else {
                    // for future
                }
            } catch (err) {
                // (err.message);
            }

            setIsLoading(false);
        }
        async function counting() {
            const em_id = sessionStorage.getItem('_id')
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/em/auth/counting`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                            //Authorization: `Basic ${basicAuth}`,
                        },
                        body: JSON.stringify({ _id: em_id }),
                    }
                );

                const result = await response.json();
                // (result);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/login?userType=institute");
                    }
                } else if (response.ok && response.status === 200) {
                    // console.log((result.data.all_institutes).length, "(result.data.all_institutes).length");
                    setAll_institutes(result.data.all_institutes)
                    setAll_mou_accepted(result.data.all_mou_accepted)
                    setAll_mou_rejected(result.data.all_mou_rejected)
                    setAll_mou_pending(result.data.all_mou_pending)
                    setAll_institutes_onboarding_pending(result.data.all_institutes_onboarding_pending)
                    setAll_institutes_onboarding_invited(result.data.all_institutes_onboarding_invited)
                    setAll_institutes_email_sent(result.data.all_institutes_email_sent)
                    setAll_institutes_onboarding_onboarded(result.data.all_institutes_onboarding_onboarded)
                    setAll_institutes_email_not_sent(result.data.all_institutes_email_not_sent)
                } else {
                    navigate("/login?userType=institute");
                }
            } catch (err) {
                // (err.message);
            }

            setIsLoading(false);
        }
        const checkMou = async () => {
            try {
                const response = await fetch(`${SERVER_ORIGIN}/api/em/auth/check-mou`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify({ _id: sessionStorage.getItem('_id') }),
                });

                const result = await response.json();
                if (!response.status >= 300) {
                    throw new Error('Failed to upload PDFs');
                } else {
                    setIsMouSigned(result.data.isMOUsigned)
                    // sessionStorage.setItem({ '_id': result.data._id })
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                // setLoading(false);
            }
        }
        checkMou()
        counting();
        canVisitPage();
    }, []);

    // function handleContentClick() {
    //     navigate("/admin/verticals/all");
    // }

    function handleManageInstitute() {
        toast.error("MOU not signed yet")
    }
    function handleInstitutesClick() {
        navigate("/em/institute/all");
    }
    function handleEMClick() {
        navigate("/ems/all");
    }

    return isLoading ? (
        <Loader />
    ) : (
        <div className={css.outerDiv}>
            <HeaderCard>
                <h1 className="headerTitle">
                    Welcome to the platform analysis
                </h1>
                <hr />
                <p className="headerSubtitle">
                    You can control the complete data on the portal from this
                    panel. You will also get a view-only list of all the students
                    registered on platform.
                </p>
            </HeaderCard>
            <SecCard >
                <Row>
                    <Col md={6} lg={3} sm={12} xs={12}>
                        {/* <SecCard> */}
                        <div className="mb-4"
                            style={{
                                border: '2px dashed #cccccc',
                                padding: '1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: '#f5f5f5'
                            }}>
                            <h3 className="cardTitle" style={{ fontSize: '20px', fontWeight: '600' }}>Institutes</h3>
                            <div className="d-flex" style={{ justifyContent: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_institutes}</h3>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Total</p>
                                </div>
                            </div>
                        </div>

                        {/* </SecCard> */}
                    </Col>
                    <Col md={6} lg={3} sm={12} xs={12}>
                        <div className="mb-4"
                            style={{
                                border: '2px dashed #cccccc',
                                padding: '1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: '#f5f5f5'
                            }}
                        >
                            <h3 className="cardTitle" style={{ borderRadius: '10px', fontSize: '20px', fontWeight: '600' }}>MOU</h3>
                            <div className="d-flex" style={{ justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_mou_accepted}</h3>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Approved</p>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_mou_rejected}</h3>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Rejected</p>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_mou_pending}</h3>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Pending</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={6} lg={3} sm={12} xs={12}>
                        <div className="mb-4"
                            style={{
                                border: '2px dashed #cccccc',
                                padding: '1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: '#f5f5f5'
                            }}
                        >
                            <h3 className="cardTitle" style={{ fontSize: '20px', fontWeight: '600' }} >Email Status</h3>
                            <div className="d-flex" style={{ justifyContent: 'space-evenly' }}>
                                <div>
                                    <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_institutes_email_sent}</h3>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Sent</p>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_institutes_email_not_sent}</h3>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Not Sent</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={6} lg={3} sm={12} xs={12}>
                        <div className="mb-4"
                            style={{
                                border: '2px dashed #cccccc',
                                padding: '1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: '#f5f5f5'
                            }}
                        >
                            <h3 className="cardTitle" style={{ fontSize: '20px', fontWeight: '600' }}>Onboarding Status</h3>
                            <div className="d-flex" style={{ justifyContent: 'space-evenly' }}>
                                <div>
                                    <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_institutes_onboarding_onboarded}</h3>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Onboarded</p>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_institutes_onboarding_invited}</h3>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Invited</p>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '25px', fontWeight: '500' }}>{all_institutes_onboarding_pending}</h3>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Pending</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </SecCard>
            <div key={1}>
                <div className="d-flex justify-content-between row">
                    <div className="col-lg-6 col-md-6 mt-5">
                        <SecCard>
                            <h1 className={css.serviceName}>MOU</h1>
                            <p className={css.serviceDesc}>
                                You can sign the MOU by clicking on
                                below button
                            </p>
                            {/* <button
                                className={`${css.serviceBtn} commonBtn`}
                                onClick={handleContentClick}
                            >
                                Manage MOU
                            </button> */}
                            <MouModal show={isOpen} onHide={handleButtonClick} text={" Manage MOU"} onClick={handleButtonClick} />
                        </SecCard>
                    </div>
                    <div className="col-lg-6 col-md-6 mt-5">
                        <SecCard>
                            <div>
                                <h1 className={css.serviceName}>Manage Institutes</h1>
                            </div>
                            <div>
                                <p className={css.serviceDesc}>
                                    You can manage the Institutes on the portal by clicking on
                                    below button
                                </p>
                            </div>
                            <div>
                                <button
                                    className={`${css.serviceBtn} commonBtn`}
                                    onClick={isMouSigned ? handleInstitutesClick : handleManageInstitute}
                                    disabled={!isMouSigned}
                                >
                                    Manage Institutes
                                </button>
                            </div>
                        </SecCard>
                    </div>

                </div>

            </div>
            {/* <CardGrid>
               
            </CardGrid> */}
        </div>
    );
};

export default EMServicePage;

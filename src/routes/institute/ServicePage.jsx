import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MouModal from "../../components/common/InstituteMouModal";
import Badge from '@mui/material/Badge';
import { green, yellow, red, deepPurple } from '@mui/material/colors';
// import { eye } from 'react-icons-kit/feather/eye'
// import { Icon } from 'react-icons-kit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from "@mui/material";
// My components
import HeaderCard from "../../components/common/HeaderCard";
import { CardGrid } from "../../components/common/CardGrid";
import SecCard from "../../components/common/SecCard";
import { toast } from 'react-hot-toast';
// My css
import css from "../../css/admin/home-page.module.css";
import { SERVER_ORIGIN } from "../../utilities/constants";
import Loader from "../../components/common/Loader";
import { Col, Row } from "react-bootstrap";
import { useUserType } from "../common/UserTypeContext";

const HomePage = () => {
    const { userType, setUserTypeToInstitute } = useUserType();
    const [all_students, SetAll_students] = useState(0)
    const [all_students_onboarding_pending, SetAll_students_onboarding_pending] = useState(0)
    const [all_students_onboarding_invited, SetAll_students_onboarding_invited] = useState(0)
    const [all_students_onboarding_onboarded, SetAll_students_onboarding_onboarded] = useState(0)
    const [all_students_email_sent, SetAll_students_email_sent] = useState(0)
    const [all_students_email_not_sent, SetAll_students_email_not_sent] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [mouUrl, setMouUrl] = useState("");
    const navigate = useNavigate();
    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };
    const [mouStatus, setMouStatus] = useState("")
    const renderMouStatus = (params) => {
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
                statusText = 'Approved';
                textColor = "white";
                break;
            case 'rejected':
                statusColor = red[500];
                statusText = 'Rejected';
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
            <span style={{ backgroundColor: statusColor, padding: '.5rem', color: textColor }}>
                {statusText}
            </span>
        </Badge>
    }
    const [isMouSigned, setIsMouSigned] = useState(false)
    useEffect(() => {
        setUserTypeToInstitute()
        async function canVisitPage() {
            setIsLoading(true);

            try {
                // const adminId = process.env.REACT_APP_ADMIN_ID;
                // const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                // const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/institute/auth/verify-token`,
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
                        navigate("/login?userType=institute");
                    }
                } else if (response.ok && response.status === 200) {
                } else {
                    navigate("/login?userType=institute");
                }
            } catch (err) {
                // (err.message);
            }

            setIsLoading(false);
        }
        async function counting() {
            setIsLoading(true);
            const _id = sessionStorage.getItem('_id');

            try {
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/institute/auth/student-counting`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                            //Authorization: `Basic ${basicAuth}`,
                        },
                        body: JSON.stringify({ _id: _id }),
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
                    SetAll_students(result.data.all_students);
                    SetAll_students_onboarding_pending(result.data.all_students_onboarding_pending);
                    SetAll_students_onboarding_invited(result.data.all_students_onboarding_invited);
                    SetAll_students_onboarding_onboarded(result.data.all_students_onboarding_onboarded);
                    SetAll_students_email_sent(result.data.all_students_email_sent);
                    SetAll_students_email_not_sent(result.data.all_students_email_not_sent)

                } else {
                    navigate("/login?userType=institute");
                }
            } catch (err) {
                // (err.message);
            }

            setIsLoading(false);
        }
        async function checkMouStatus() {
            setIsLoading(true);

            try {
                // const adminId = process.env.REACT_APP_ADMIN_ID;
                // const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                // const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/institute/auth/check-mou`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                            //Authorization: `Basic ${basicAuth}`,
                        },
                        body: JSON.stringify({ _id: sessionStorage.getItem('_id') }),

                    }
                );

                const result = await response.json();
                // (result);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/login?userType=institute");
                    }
                } else if (response.ok && response.status === 200) {
                    setIsMouSigned(result.data.isMOUapproved)
                    setMouStatus(result.data.mouStatus)
                    setMouUrl(result.data.docUrl)
                    // sessionStorage.setItem({ '_id': result.data._id })
                } else {
                    // for future
                }
            } catch (err) {
                // (err.message);
            }

            setIsLoading(false);
        }
        checkMouStatus();
        counting();
        canVisitPage();
    }, []);

    // function handleContentClick() {
    //     navigate("/admin/verticals/all");
    // }

    function handleUsersClick() {
        navigate("/institute/students/all");
    }
    // function handleInstitutesClick() {
    //     navigate("/institutes/all");
    // }
    // function handleEMClick() {
    //     navigate("/ems/all");
    // }
    function handleStudentBtnClick() {
        toast.error("Let your MOU get approved first!");
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
                    panel. You will also get a view-only list of all the institutes
                    registered on platform.
                </p>
            </HeaderCard>
            <SecCard>
                <Row>
                    <Col md={6} lg={4} sm={12} xs={12}>
                        {/* <SecCard> */}
                        <div
                            style={{
                                border: '2px dashed #cccccc',
                                padding: '1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: '#f5f5f5'
                            }}>
                            <h3 className="cardTitle" style={{ fontSize: '20px', fontWeight: '600' }}>Students</h3>
                            <div className="d-flex" style={{ justifyContent: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{all_students}</h3>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Total</p>
                                </div>
                            </div>
                        </div>

                        {/* </SecCard> */}
                    </Col>
                    <Col md={6} lg={4} sm={12} xs={12}>
                        <div
                            style={{
                                border: '2px dashed #cccccc',
                                padding: '1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: '#f5f5f5'
                            }}
                        >
                            <h3 className="cardTitle" style={{ fontSize: '20px', fontWeight: '600' }}>Email Status</h3>
                            <div className="d-flex" style={{ justifyContent: 'space-evenly' }}>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: '600' }}>{all_students_email_sent}</div>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Sent</p>
                                </div>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: '600' }}>{all_students_email_not_sent}</div>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Not Sent</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={6} lg={4} sm={12} xs={12}>
                        <div
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
                                    <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{all_students_onboarding_onboarded}</h3>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Onboarded</p>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{all_students_onboarding_invited}</h3>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>Invited</p>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{all_students_onboarding_pending}</h3>
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
                            <div className="d-flex justify-content-between">

                                <h1 className={css.serviceName}>MOU</h1>
                                <div className="d-flex justify-content-evenly align-items-center">
                                        <p className="mx-3"> MOU Status: </p>
                                    <Link
                                        href={mouUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Tooltip title="Click to get a priview">
                                            {renderMouStatus({ value: mouStatus })}
                                        </Tooltip>

                                    </Link>
                                </div>
                            </div>
                            <p className={css.serviceDesc}>
                                You can sign the MOU by clicking on
                                below button
                            </p>
                            {/* <div className="d-flex justify-content-between"> */}
                            <MouModal show={isOpen} onHide={handleButtonClick} text={"Manage MOU"} onClick={handleButtonClick} />
                            {/* <Icon class="absolute " icon={eye} size={25} /> */}
                            {/* </div> */}
                        </SecCard>
                    </div>
                    <div className="col-lg-6 col-md-6 mt-5">
                        <SecCard>
                            <div>
                                <h1 className={css.serviceName}>Manage Students</h1>
                            </div>
                            <div>
                                <p className={css.serviceDesc}>
                                    You can manage the students on the app by clicking on
                                    below button
                                </p>
                            </div>
                            <div>
                                <button
                                    className={`${css.serviceBtn} commonBtn`}
                                    onClick={handleUsersClick}
                                    disabled={!isMouSigned}
                                >
                                    Manage Students
                                </button>
                            </div>
                        </SecCard>
                    </div>

                </div>
            </div>
            <CardGrid>
            </CardGrid>
        </div >
    );
};

export default HomePage;

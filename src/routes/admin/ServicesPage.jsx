import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { PieChart } from '@mui/x-charts/PieChart';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import EqualizerIcon from '@mui/icons-material/Equalizer';

// My components
import HeaderCard from "../../components/common/HeaderCard";
import { CardGrid } from "../../components/common/CardGrid";
import SecCard from "../../components/common/SecCard";

// My css
import css from "../../css/admin/home-page.module.css";

import { SERVER_ORIGIN } from "../../utilities/constants";
import Loader from "../../components/common/Loader";
// const bull = (
//     <Box
//         component="span"
//         sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
//     >
//         •
//     </Box>
// );

const HomePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [regionCount, setRegionCount] = useState(null)
    const [chapterCount, setChapterCount] = useState(null)
    const [studentCount, setStudentCount] = useState(null)
    const [instituteCount, setInstituteCount] = useState(null)
    const [emCount, setEmCount] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        async function canVisitPage() {
            setIsLoading(true);

            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
    const basicAuth = btoa(`${adminId}:${adminPassword}`);

                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/verify-token`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                           Authorization: `Basic ${basicAuth}`,
                        },
                    }
                );

                const result = await response.json();
                // (result);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/login");
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
       
        canVisitPage();
    }, [navigate]);

    useEffect(()=>{
        async function counting() {
            setIsLoading(true);

            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
    const basicAuth = btoa(`${adminId}:${adminPassword}`);

                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/count/all`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                           Authorization: `Basic ${basicAuth}`,
                        },
                    }
                );

                const result = await response.json();
                console.log(result);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/login");
                    }
                } else if (response.ok && response.status === 200) {
                    setRegionCount(result.data.regionCount)
                    setChapterCount(result.data.chapterCount)
                    setStudentCount(result.data.studentCount)
                    setInstituteCount(result.data.instituteCount)
                    setEmCount(result.data.emCount)
                } else {
                    // for future
                }
            } catch (err) {
                // (err.message);
            }
            setIsLoading(false);
        }
        counting()
    },[])
    function handleContentClick() {
        navigate("/admin/verticals/all");
    }

    function handleUsersClick() {
        navigate("/admin/users/all");
    }
    function handleInstitutesClick() {
        navigate("/institutes/all");
    }
    function handleEMClick() {
        navigate("/em/all");
    }
    function handleChapterClick() {
        navigate("/chapter/all");
    }
    function handleRegionClick() {
        navigate("/region/all");
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
                    panel. You will also get a view-only list of all the users
                    registered on platform.
                </p>
                <div>
                    <Row>
                        <Col md={4} sm={6} xs={12}>
                            <Card sx={{ minWidth: 105, maxHeight: 151 }} className={css.serviceCountCard} style={{ marginTop: '15px' }}>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <EqualizerIcon color="#053357" />
                                    <Typography variant="h3" color="GrayText" >
                                        {regionCount}
                                    </Typography>
                                    <Typography variant="overline" color='#053357' fontWeight="900">
                                        Chapters
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Col>
                        <Col md={4} sm={6} xs={12}>
                            <Card sx={{ minWidth: 105, maxHeight: 151 }} className={css.serviceCountCard} style={{ marginTop: '15px' }}>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <EqualizerIcon color="#053357" />
                                    <Typography variant="h3" color="GrayText">
                                        {chapterCount}
                                    </Typography>
                                    <Typography variant="overline" color='#053357' fontWeight="900">
                                        Regions
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Col>
                        <Col md={4} sm={6} xs={12}>
                            <Card sx={{ minWidth: 105, maxHeight: 151 }} className={css.serviceCountCard} style={{ marginTop: '15px' }}>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <EqualizerIcon color="#053357" />
                                    <Typography variant="h3" color="GrayText">
                                        {studentCount}
                                    </Typography>
                                    <Typography variant="overline" color='#053357' fontWeight="900">
                                        Students
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Col>
                        <Col md={4} sm={6} xs={12}>
                            <Card sx={{ minWidth: 105, maxHeight: 151 }} className={css.serviceCountCard} style={{ marginTop: '15px' }}>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <EqualizerIcon color="#053357" />
                                    <Typography variant="h3" color="GrayText">
                                        {instituteCount}
                                    </Typography>
                                    <Typography variant="overline" color='#053357' fontWeight="900">
                                        Institutes
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Col>
                        <Col md={4} sm={6} xs={12}>
                            <Card sx={{ minWidth: 105, maxHeight: 151 }} className={css.serviceCountCard} style={{ marginTop: '15px' }}>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <EqualizerIcon color="#053357" />
                                    <Typography variant="h3" color="GrayText">
                                        {emCount}
                                    </Typography>
                                    <Typography variant="overline" color='#053357' fontWeight="900">
                                        EMs
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Col>
                        <Col md={4} sm={6} xs={12}>
                            <Card sx={{ minWidth: 105, maxHeight: 151 }} className={css.serviceCountCard} style={{ marginTop: '15px' }}>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <PieChart
                                        series={[
                                            {
                                                data: [
                                                    { id: 0, value: 10, label: 'Accepted' },
                                                    { id: 1, value: 15, label: 'Submitted' },
                                                    { id: 2, value: 15, label: 'Pending' },
                                                    { id: 3, value: 20, label: 'Rejected' },
                                                ],
                                            },
                                        ]}
                                        width={300}
                                        height={131}
                                        // loading={true}
                                    />
                                </CardContent>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </HeaderCard>
            <div key={1}>
                <div className="d-flex justify-content-between row">
                    <div className="col-lg-6 col-md-6 mt-5">
                        <SecCard>
                            <h1 className={css.serviceName}>Manage Content</h1>
                            <p className={css.serviceDesc}>
                                You can manage the content on the portal by clicking on
                                below button
                            </p>
                            <button
                                className={`${css.serviceBtn} commonBtn`}
                                onClick={handleContentClick}
                            >
                                Manage Content
                            </button>
                        </SecCard>
                    </div>
                    <div className="col-lg-6 col-md-6 mt-5">
                        <SecCard>
                            <div>
                                <h1 className={css.serviceName}>Manage Students</h1>
                            </div>
                            <div>
                                <p className={css.serviceDesc}>
                                    You can manage the students on the portal by clicking on
                                    below button
                                </p>
                            </div>
                            <div>
                                <button
                                    className={`${css.serviceBtn} commonBtn`}
                                    onClick={handleUsersClick}
                                >
                                    Manage Students
                                </button>
                            </div>
                        </SecCard>
                    </div>
                </div>
                <div className="d-flex justify-content-between row">
                    <div className="col-lg-6 col-md-6 mt-5">
                        <SecCard>
                            <h1 className={css.serviceName}>Manage Institutes</h1>
                            <p className={css.serviceDesc}>
                                You can manage the institutes on the portal by clicking on
                                below button
                            </p>
                            <button
                                className={`${css.serviceBtn} commonBtn`}
                                onClick={handleInstitutesClick}
                            >
                                Manage Institute
                            </button>
                        </SecCard>
                    </div>
                    <div className="col-lg-6 col-md-6 mt-5">
                        <SecCard>
                            <h1 className={css.serviceName}>Manage EM's</h1>
                            <p className={css.serviceDesc}>
                                You can manage EM's on the portal by clicking on
                                below button
                            </p>
                            <button
                                className={`${css.serviceBtn} commonBtn`}
                                onClick={handleEMClick}
                            >
                                Manage EM's
                            </button>
                        </SecCard>
                    </div>
                </div>
                <div className="d-flex justify-content-between row">
                    <div className="col-lg-6 col-md-6 mt-5">
                        <SecCard>
                            <h1 className={css.serviceName}>Manage Chapters</h1>
                            <p className={css.serviceDesc}>
                                You can manage the chapters on the portal by clicking on
                                below button
                            </p>
                            <button
                                className={`${css.serviceBtn} commonBtn`}
                                onClick={handleChapterClick}
                            >
                                Manage Chapters
                            </button>
                        </SecCard>
                    </div>
                    <div className="col-lg-6 col-md-6 mt-5">
                        <SecCard>
                            <h1 className={css.serviceName}>Manage Regions</h1>
                            <p className={css.serviceDesc}>
                                You can manage Regions on the portal by clicking on
                                below button
                            </p>
                            <button
                                className={`${css.serviceBtn} commonBtn`}
                                onClick={handleRegionClick}
                            >
                                View Regions
                            </button>
                        </SecCard>
                    </div>
                </div>
            </div>
            <CardGrid>
                {/* <div className="cardOuterDiv col-lg-6 col-md-6 col-sm-12" key={1}>
          <SecCard>
            <h1 className={css.serviceName}>Users List</h1>
            <p className={css.serviceDesc}>
              You can access the list of registered users by clicking on the below button
            </p>
            <button
              className={`${css.serviceBtn} commonBtn`}
              onClick={handleUsersClick}
            >
              View User List
            </button>
          </SecCard>
        </div> */}
            </CardGrid>
        </div>
    );
};

export default HomePage;

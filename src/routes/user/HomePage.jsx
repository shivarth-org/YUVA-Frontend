import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useUserType } from '../common/UserTypeContext';
// My components
import Card from "../../components/user/Card";
import HeaderCard from "../../components/common/HeaderCard";
import Loader from "../../components/common/Loader";
import { CardGrid } from "../../components/common/CardGrid";

// My css
import homeCss from "../../css/user/home-page.module.css";
import vCss from "../../css/user/verticals-page.module.css";

import { SERVER_ORIGIN } from "../../utilities/constants";
import logo from "../../assets/images/yuva-logo-transparent.png";

///////////////////////////////////////////////////////////////////////////////////////////////////

const HomePage = () => {
    const params = useLocation();
    let { userType } = useUserType();
    // const [allVerticals, setAllVerticals] = useState([]);
    const [projectVerticals, setProjectVerticals] = useState([]); // [vertical1, vertical2]
    const [initiativeVerticals, setInitiativeVerticals] = useState([]); // [vertical3, vertical4, vertical5, vertical6]
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        async function getAllVerticals() {
            try {
                const userId = process.env.REACT_APP_USER_ID;
                const userPassword = process.env.REACT_APP_USER_PASSWORD;
                 const basicAuth = btoa(`${userId}:${userPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/student/auth/verticals/all`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                           Authorization: `Basic ${basicAuth}`,
                        },
                    }
                );

                const result = await response.json();
                // (result);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    setProjectVerticals(result.allVerticals?.slice(0, 2));
                    setInitiativeVerticals(result.allVerticals?.slice(2));
                    // setAllVerticals(result.allVerticals);
                } else {
                    // for future
                }
            } catch (err) {
            }

            setIsLoading(false);
        }

        getAllVerticals();
    }, []);

    async function handleViewCourses(e) {
        const verticalId = e.target.id;
        // if (sessionStorage.getItem("token")) {
        // } else
        try {
            const userId = "utkarsh@troology.in";
            const userPassword = "Redhood@23"
             const basicAuth = btoa(`${userId}:${userPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/${userType}/auth/check-authorized`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": sessionStorage.getItem("token"),
                       Authorization: `Basic ${basicAuth}`,
                    },
                }
            );
            // (result);

            if (response.status >= 400 && response.status < 600) {
                navigate("/login?userType=student");
            } else if (response.ok && response.status === 200) {
                navigate(`/user/verticals/${verticalId}/courses/all`);
            } else {
                // for future
            }
        } catch (error) {
        }
    }

    const element = (
        <>
            {/* <HeaderCard>
        <p className={vCss.headerText}>Here's what we have got for you !</p>
      </HeaderCard> */}
            <div className={`${homeCss.outerDiv} row`}>
                <div
                    className={`col-lg-8 col-md-8 col-sm-8 ${homeCss.introDiv}`}
                >
                    <p className={homeCss.introHeading}>
                        Welcome to YUVA Portal
                    </p>
                    <p className={homeCss.introSubheading}>
                        We Are The Voice Of Young Indians Globally
                    </p>
                    <p className={homeCss.introDesc}>
                        YUVA is one of the most active focus areas within Young
                        Indians by which Yi members engage students from across
                        the country in various initiatives that the students
                        conceptualize, plan and execute. The objective is to
                        create a bridge, a platform for the students to work in
                        cross functional teams with a broad objective of
                        enhancing their leadership skills and giving back to the
                        nation.
                    </p>
                    <button
                        className={homeCss.aboutBtn}
                        onClick={() => {
                            navigate("/about");
                        }}
                    >
                        More about Yuva
                    </button>
                    <a href="#verticals" style={{ textDecoration: "none" }}>
                        <button className={homeCss.exploreBtn}>
                            Explore Verticals
                        </button>
                    </a>
                </div>
                <div
                    style={{
                        textAlign: "right",
                        display: "flex",
                        alignItems: "center",
                    }}
                    className="col-lg-4 col-md-4 col-sm-4"
                >
                    <img
                        src={logo}
                        className={homeCss.yuvaImg}
                        alt="yuva-big-img"
                    ></img>
                </div>
            </div>

            <section id="projects" className="d-flex flex-column gap-2">
                <h1 className={homeCss.headerText}>Our Initiatives</h1>
                <div className="horizontal"></div>
                <CardGrid className={homeCss["card-grid-verticals"]}>
                    {projectVerticals.map((vertical) => (
                        <div
                            className="col-lg-6 col-md-6 col-sm-12 cardOuterDiv"
                            key={vertical._id}
                        >
                            <Card
                                data={vertical}
                                type="vertical"
                                onClick={handleViewCourses}
                            />
                        </div>
                    ))}
                </CardGrid>
            </section>

            <section id="initiatives" className="mt-5 d-flex flex-column gap-2">
                <h1 className={homeCss.headerText}>Our Projects</h1>
                <div className="horizontal"></div>
                <CardGrid className={homeCss["card-grid-verticals"]}>
                    {initiativeVerticals.map((vertical) => (
                        <div
                            className="col-lg-6 col-md-6 col-sm-12 cardOuterDiv"
                            key={vertical._id}
                        >
                            <Card
                                data={vertical}
                                type="vertical"
                                onClick={handleViewCourses}
                            />
                        </div>
                    ))}
                </CardGrid>
            </section>

            {/* {allVerticals.length > 0 ? (
        <section id="verticals">
          <CardGrid>
            {allVerticals.map((vertical) => (
              <div
                className="col-lg-4 col-md-6 col-sm-12 cardOuterDiv"
                key={vertical._id}
              >
                <Card
                  data={vertical}
                  type="vertical"
                  onClick={handleViewCourses}
                />
              </div>
            ))}
          </CardGrid>
        </section>
      ) : (
        <h1 className="nothingText">Sorry, we found nothing</h1>
      )} */}
        </>
    );

    return <>{isLoading ? <Loader /> : element}</>;
};

export default HomePage;

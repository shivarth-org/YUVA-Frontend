import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// My components
import Loader from "../../components/common/Loader";
import Card from "../../components/user/Card";
import { CardGrid } from "../../components/common/CardGrid";
import HeaderCard from "../../components/common/HeaderCard";

// My css
import css from "../../css/user/verticals-page.module.css";
import vCss from "../../css/user/verticals-page.module.css";

import { SERVER_ORIGIN } from "../../utilities/constants";

//! If allVerticals is empty, then it will throw an error when using map function on an empty array because the accessed fields like vertical.name/vertical.desc will not be present, so make a check

///////////////////////////////////////////////////////////////////////////////////////////

const VerticalsPage = () => {
    const [allVerticals, setAllVerticals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function getAllVerticals() {
            setIsLoading(true);

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
                    setAllVerticals(result.allVerticals);
                } else {
                    // for future
                }

                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        }

        getAllVerticals();
    }, []);

    function handleViewCourses(e) {
        const verticalId = e.target.id;
        // (verticalId);
        navigate(`/user/verticals/${verticalId}/courses/all`);
    }

    const loader = <Loader />;

    const element = (
        <div className={css.outerDiv}>
            {/* <HeaderCard>
      </HeaderCard> */}
            <p className={vCss.headerText}>Here's what we have got for you!</p>
            <div className="horizontal"></div>

            {allVerticals.length > 0 ? (
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
            ) : (
                <h1 className="nothingText">Sorry, we found nothing</h1>
            )}
        </div>
    );

    return <>{isLoading ? loader : element}</>;
};

export default VerticalsPage;

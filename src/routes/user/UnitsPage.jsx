import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { SERVER_ORIGIN } from "../../utilities/constants";
import { getVideoThumbnail } from "../../utilities/helper_functions";

// My components
import Loader from "../../components/common/Loader";
import Card from "../../components/user/Card";

// My css
import css from "../../css/user/units-page.module.css";
import { CardGrid } from "../../components/common/CardGrid";
import HeaderCard from "../../components/common/HeaderCard";

//! If allVerticals is empty, then it will throw an error when using map function on an empty array because the accessed fields like vertical.name/vertical.desc will not be present, so make a check
//! make handleAddView Courses/Verticals/Units functions non async

const UserUnits = () => {
    const [allUnits, setAllUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [courseInfo, setCourseInfo] = useState({ name: "", desc: "" });
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function getAllUnits() {
            const { verticalId, courseId } = params;

            setIsLoading(true);
            try {
                const userId = process.env.REACT_APP_USER_ID;
                const userPassword = process.env.REACT_APP_USER_PASSWORD;
                 const basicAuth = btoa(`${userId}:${userPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/student/auth/verticals/${verticalId}/courses/${courseId}/units/all`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                           Authorization: `Basic ${basicAuth}`,
                        },
                    }
                );

                // (response);
                const result = await response.json();
                // (result);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/login?userType=student"); // login or role issue
                    } else if (response.status === 404) {
                        navigate("/user/resource-not-found");
                    } else {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    setCourseInfo(result.courseInfo);
                    setAllUnits(result.allUnits);
                } else {
                    // for future
                }
            } catch (err) {}
            setIsLoading(false);
        }

        getAllUnits();
    }, []);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    function handleViewUnit(e) {
        const { verticalId, courseId } = params;
        const unitId = e.target.id;
        // (unitId);

        navigate(
            `/user/verticals/${verticalId}/courses/${courseId}/units/${unitId}`
        );
    }

    const loader = <Loader />;

    const element = (
        <div className={css.outerDiv}>
            <HeaderCard>
                <p className={css.cNameText}>{courseInfo.name}</p>
                <p className={css.cDescText}>{courseInfo.desc}</p>
            </HeaderCard>

            <CardGrid>
                {allUnits.length > 0 ? (
                    allUnits.map((unit) => {
                        const vdoThumbnail = getVideoThumbnail(
                            unit.video.vdoSrc
                        );
                        unit.vdoThumbnail = vdoThumbnail;

                        return (
                            <div
                                className="col-lg-4 col-md-6 col-sm-12 cardOuterDiv"
                                key={unit._id}
                            >
                                <Card
                                    data={unit}
                                    type="unit"
                                    onClick={handleViewUnit}
                                />
                            </div>
                        );
                    })
                ) : (
                    <h1 className="nothingText">Sorry, we found nothing</h1>
                )}
            </CardGrid>
        </div>
    );

    return <>{isLoading ? loader : element}</>;
};

export default UserUnits;

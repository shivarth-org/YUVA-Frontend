import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import SecCard from "../../components/common/SecCard";
import VideoInput from "../../components/admin/VideoInput";
import TextInput from "../../components/admin/TextInput";
import ActivityInput from "../../components/admin/ActivityInput";
import QuizInput from "../../components/admin/QuizInput";
import Loader from "../../components/common/Loader";

// My css
import css from "../../css/admin/add-unit-page.module.css";

import { SERVER_ORIGIN } from "../../utilities/constants";

// TODO: VALIDATION
// ! check response codes

////////////////////////////////////////////////////////////////////////////////////////////////

function AddActivityBtn(props) {
    return (
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <button
                className={css.addBtn}
                type="button"
                onClick={() => props.handleAddActivity()}
            >
                Add activity
            </button>
        </div>
    );
}
//////////////////////////////////////// QUIZ ///////////////////////////////////////////////////

function AddQuizItemBtn(props) {
    return (
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <button
                className={css.addBtn}
                type="button"
                onClick={() => props.handleAddQuizItem()}
            >
                Add question
            </button>
        </div>
    );
}

/////////////////////////////////////////////////////////////////////////////////////////////////

const AdminAddUnit = () => {
    const [video, setVideo] = useState({ title: "", desc: "", vdoSrc: "" });
    const [text, setText] = useState("");
    const [activities, setActivities] = useState([]);
    const [quiz, setQuiz] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddUnitBtnDisabled, setIsAddUnitBtnDisabled] = useState(false);

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function canVisitPage() {
            setIsLoading(true);

            const { verticalId, courseId, unitId } = params;

            try {
                const adminId = "yuva@gmail.com";
                const adminPassword = "admin@yuva123";
                const basicAuth = btoa(`${adminId}:${adminPassword}`);

                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/verify-token`,
                    {
                        method: "POST",
                        headers: {
                            // "Content-Type": "application/json",
                            "auth-token": sessionStorage.getItem("token"),
                            Authorization: `Basic ${basicAuth}`,
                        },
                    }
                );

                const result = await response.json();
                // (result);

                setIsLoading(false);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/login?userType=student"); // login or role issue
                    } else {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                }
            } catch (err) {
                // (err.message);
            }
        }

        canVisitPage();
    }, []);

    //////////////////////////////////////////////////////////////////////////////

    function onVideoChange(e) {
        setVideo((prevVideo) => {
            const newVideo = { ...prevVideo, [e.target.name]: e.target.value };
            // (newVideo);
            return newVideo;
        });
    }

    ///////////////////////////////////////////////////////////////////////////////

    function onTextChange(e) {
        // (e.target.value);

        setText(e.target.value);
    }

    ///////////////////////////////////////////////////////////////////////////////

    function handleActivityChange(i, e) {
        setActivities((prevActivities) => {
            let newActivities = [...prevActivities];
            newActivities[i] = e.target.value;
            // (newActivities);

            return newActivities;
        });
    }

    function handleAddActivity() {
        setActivities((prevActivities) => {
            const newActivities = [...prevActivities, ""];
            // (newActivities);

            return newActivities;
        });
    }

    function handleDeleteActivity(i) {
        setActivities((prevActivities) => {
            let newActivities = [...prevActivities];
            newActivities.splice(i, 1);
            // (newActivities);

            return newActivities;
        });
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    let handleQuizItemChange = (quizItemIdx, optIdx, e) => {
        setQuiz((prevQuiz) => {
            let newQuiz = [...prevQuiz];

            if (e.target.name === "question") {
                newQuiz[quizItemIdx][e.target.name] = e.target.value;
            } else if (e.target.name === "optText") {
                newQuiz[quizItemIdx].options[optIdx].text = e.target.value;
            } else {
                newQuiz[quizItemIdx].options[optIdx].isChecked =
                    e.target.checked;
            }

            // (newQuiz);

            return newQuiz;
        });
    };

    let handleAddQuizItem = () => {
        setQuiz((prevQuiz) => {
            let newQuiz = [
                ...prevQuiz,
                {
                    question: "",
                    options: [
                        { text: "", isChecked: false },
                        { text: "", isChecked: false },
                        { text: "", isChecked: false },
                        { text: "", isChecked: false },
                    ],
                },
            ];
            // (newQuiz);

            return newQuiz;
        });
    };

    let handleDeleteQuizItem = (quizItemIdx) => {
        setQuiz((prevQuiz) => {
            let newQuiz = [...prevQuiz];
            newQuiz.splice(quizItemIdx, 1);

            // (newQuiz);

            return newQuiz;
        });
    };

    ///////////////////////////////////////////////////////////////////////////////////////////

    async function handleAddUnit() {
        setIsAddUnitBtnDisabled(true);
        const { verticalId, courseId } = params;
        // (params);

        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);

            const unit = {
                video: video,
                text: text,
                activities: activities,
                quiz: quiz,
            };

            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/${courseId}/units/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": sessionStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(unit),
                }
            );

            setIsAddUnitBtnDisabled(false);

            const result = await response.json();

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    navigate("/admin/login"); // login or role issue
                } else if (response.status === 404) {
                    toast.error(result.statusText);
                } else if (response.status === 500) {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                toast.success(result.statusText);
                navigate(-1); // go back to all units page
            } else {
                // for future
            }

            // navigate(`/admin/verticals/${verticalId}/courses/${courseId}/units/all`);
        } catch (err) { }
    }

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={css.outerDiv}>
                    <h1 className={css.headingText}>
                        Adding a new unit for course
                    </h1>

                    <div className={css.commonDiv}>
                        <SecCard>
                            <h2 className="text-ff1">Video</h2>
                            <VideoInput
                                name="title"
                                id="title"
                                label="Title"
                                placeholder="Title"
                                value={video.title}
                                onChange={onVideoChange}
                            />
                            <VideoInput
                                name="desc"
                                id="desc"
                                label="Description"
                                placeholder="Description"
                                value={video.desc}
                                onChange={onVideoChange}
                            />
                            <VideoInput
                                name="vdoSrc"
                                id="video-src"
                                label="Source"
                                placeholder="https://youtube.com...."
                                value={video.vdoSrc}
                                onChange={onVideoChange}
                            />
                        </SecCard>
                    </div>

                    <div className={css.commonDiv}>
                        <SecCard>
                            <h2 className="text-ff1">Text</h2>
                            <TextInput value={text} onChange={onTextChange} />
                        </SecCard>
                    </div>

                    <div className={css.commonDiv}>
                        <SecCard>
                            <h2 className="text-ff1">Activities</h2>
                            <AddActivityBtn
                                handleAddActivity={handleAddActivity}
                            />

                            {activities.map((activity, index) => (
                                <ActivityInput
                                    key={index}
                                    index={index}
                                    handleActivityChange={handleActivityChange}
                                    handleDeleteActivity={handleDeleteActivity}
                                    value={activity}
                                />
                            ))}
                        </SecCard>
                    </div>

                    <div className={css.commonDiv}>
                        <SecCard>
                            <h2 className="text-ff1">Quiz</h2>

                            <AddQuizItemBtn
                                handleAddQuizItem={handleAddQuizItem}
                            />

                            {quiz.map((quizItem, quizItemIdx) => (
                                <QuizInput
                                    key={quizItemIdx}
                                    quizItemIdx={quizItemIdx}
                                    handleQuizItemChange={handleQuizItemChange}
                                    handleDeleteQuizItem={handleDeleteQuizItem}
                                    quizItem={quizItem}
                                />
                            ))}
                        </SecCard>
                    </div>

                    <div style={{ margin: "2rem", textAlign: "center" }}>
                        <button
                            disabled={isAddUnitBtnDisabled}
                            className={css.addBtn}
                            onClick={handleAddUnit}
                        >
                            Add Unit
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminAddUnit;

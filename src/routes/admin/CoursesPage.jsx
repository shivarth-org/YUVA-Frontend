import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import Card from "../../components/admin/Card";
import { CardGrid } from "../../components/common/CardGrid";
import Loader from "../../components/common/Loader";

// My css
import css from "../../css/admin/courses-page.module.css";

import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import { refreshScreen } from "../../utilities/helper_functions";

const CoursesPage = () => {
    const [verticalInfo, setverticalInfo] = useState({ name: "", desc: "" });
    const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(false);
    const [allCourses, setAllCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ name: "", desc: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function getAllCourses() {
            setIsLoading(true);
            const { verticalId } = params;

            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
    const basicAuth = btoa(`${adminId}:${adminPassword}`);

                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/all`,
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
                // (result);

                setIsLoading(false);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/login"); // login or role issue
                    } else if (response.status === 404) {
                        toast.error(result.statusText);
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    setverticalInfo(result.verticalInfo);
                    setAllCourses(result.allCourses);
                } else {
                    // for future
                }
            } catch (err) {
                setIsLoading(false);
            }
        }

        getAllCourses();
    }, []);

    // const saveVInfoChanges = async () => {
    //   setIsSaveBtnDisabled(true);

    //   try {
    //     const { verticalId } = params;
    //     const response = await fetch(
    //       `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/edit`,
    //       {
    //         method: "PATCH",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "auth-token": sessionStorage.getItem("token"),
    //         },
    //       }
    //     );

    //     const result = await response.json();
    //     // (result);

    //     setIsSaveBtnDisabled(false);

    //     if (response.status >= 400 && response.status < 600) {
    //       if (response.status === 401) {
    //         navigate("/admin/login"); // login or role issue
    //       } else if (response.status === 404) {
    //         toast.error(result.statusText);
    //       } else if (response.status === 500) {
    //         toast.error(result.statusText);
    //       }
    //     } else if (response.ok && response.status === 200) {
    //       refreshScreen();
    //     } else {
    //       // for future
    //     }
    //   } catch (err) {
    //     (err.message);
    //   }
    // };

    ////////////////////////////////////////////// Add Course Modal ///////////////////////////////////////////////////

    const ref = useRef(null);
    const refClose = useRef(null);

    async function openModal() {
        ref.current.click();
    }

    function onChange(e) {
        const updatedCourse = { ...newCourse, [e.target.name]: e.target.value };
        setNewCourse(updatedCourse);

        // (updatedCourse);
    }

    async function handleAddCourse() {
        const { verticalId } = params;

        // todo: validate input
        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
const basicAuth = btoa(`${adminId}:${adminPassword}`);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": sessionStorage.getItem("token"),
                       Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(newCourse),
                }
            );

            const result = await response.json();
            // (result);

            setIsLoading(false);

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    navigate("/admin/login"); // login or role issue
                } else if (response.status === 404) {
                    toast.error(result.statusText);
                } else if (response.status === 500) {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                refreshScreen();
            } else {
                // for future
            }

            refClose.current.click();
        } catch (err) {
        }
    }

    /////////////////////////////////////// Delete Course Modal //////////////////////////////////////////////////

    const ref2 = useRef(null);
    const refClose2 = useRef(null);
    const [toDeleteCourseId, setToDeleteCourseId] = useState("");
    const [confirmText, setConfirmText] = useState("");

    function onConfirmTextChange(e) {
        setConfirmText(e.target.value);
    }

    function openDeleteModal(e) {
        ref2.current.click();
        setToDeleteCourseId(e.target.id);
    }

    async function handleDeleteCourse() {
        const { verticalId } = params;
        const courseId = toDeleteCourseId;
        // (courseId);

        // todo: validate input
        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
const basicAuth = btoa(`${adminId}:${adminPassword}`);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/${courseId}/delete`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
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
                    navigate("/admin/login"); // login or role issue
                } else if (response.status === 404) {
                    toast.error(result.statusText);
                } else if (response.status === 500) {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                refreshScreen();
            } else {
                // for future
            }

            refClose2.current.click();
        } catch (err) {
        }
    }

    const deleteModal = (
        <>
            <button
                ref={ref2}
                type="button"
                className="btn btn-primary d-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal3"
            >
                Launch demo modal
            </button>

            <div
                className="modal fade"
                id="exampleModal3"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title text-ff1"
                                id="exampleModalLabel"
                            >
                                Delete course
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: "0.8rem" }}>
                                <label htmlFor="name" className="modalLabel">
                                    Confirmation
                                </label>
                                <input
                                    type="text"
                                    className="modalInput"
                                    id="confirm"
                                    name="confirm"
                                    minLength={3}
                                    required
                                    placeholder="Type 'Confirm' to delete"
                                    value={confirmText}
                                    onChange={onConfirmTextChange}
                                    autoComplete="on"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="modalCloseBtn"
                                data-bs-dismiss="modal"
                                ref={refClose2}
                            >
                                Close
                            </button>
                            <button
                                onClick={handleDeleteCourse}
                                type="button"
                                className="modalDltBtn"
                                disabled={confirmText !== "Confirm"}
                            >
                                Delete course
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    async function handleAddOrViewUnits(e) {
        const { verticalId } = params;
        const courseId = e.target.id;

        navigate(
            `/admin/verticals/${verticalId}/courses/${courseId}/units/all`
        );
    }

    const loader = <Loader />;

    const element = (
        <section id="courses">
            {allCourses.length > 0 ? (
                <CardGrid>
                    {allCourses.map((course) => (
                        <div
                            className="col-lg-4 col-md-6 col-sm-12 cardOuterDiv"
                            key={course._id}
                        >
                            <Card
                                data={course}
                                type="course"
                                onAddViewClick={handleAddOrViewUnits}
                                onDeleteClick={openDeleteModal}
                            />
                        </div>
                    ))}
                </CardGrid>
            ) : (
                <h1 className="nothingText">Sorry, we found nothing</h1>
            )}
        </section>
    );

    return (
        <div className={css.outerDiv}>
            {/* <div className={css.vInfoDiv}>
        <p
          style={{
            marginBottom: "1rem",
          }}
          className="editNote"
        >
          You can edit the vertical name and description fields by clicking upon
          them
        </p>
        <div style={{ marginBottom: "0.8rem" }} className="text-ff2">
          <label>Vertical name</label>
          <p className="headerSubtitle" contentEditable="true">
            {verticalInfo.name}
          </p>
        </div>
        <div style={{ marginBottom: "0.8rem" }} className="text-ff2">
          <label>Description</label>
          <p className="headerSubtitle" contentEditable="true">
            {verticalInfo.desc}
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            className={`${css.editBtn} commonBtn`}
            onClick={saveVInfoChanges}
            disabled={isSaveBtnDisabled}
          >
            Save changes
          </button>
        </div>
      </div> */}

            <div style={{ textAlign: "center" }}>
                <button
                    className={`${css.addBtn} commonBtn`}
                    onClick={openModal}
                >
                    Add a new Course
                </button>
            </div>

            {isLoading ? loader : element}

            <button
                ref={ref}
                type="button"
                className="btn btn-primary d-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
            >
                Launch demo modal
            </button>
            <div
                className="modal fade"
                id="exampleModal2"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title text-ff1"
                                id="exampleModalLabel"
                            >
                                Add a new course
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: "0.8rem" }}>
                                <label htmlFor="name" className="modalLabel">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    className="modalInput"
                                    id="name"
                                    name="name"
                                    maxLength={
                                        validation.verticalModal.name.maxLen
                                    }
                                    onChange={onChange}
                                    value={newCourse.name}
                                    autoComplete="on"
                                />
                            </div>
                            <div style={{ marginBottom: "0.8rem" }}>
                                <label
                                    htmlFor="description"
                                    className="modalLabel"
                                >
                                    Description *
                                </label>
                                <input
                                    type="text"
                                    className="modalInput"
                                    id="desc"
                                    name="desc"
                                    onChange={onChange}
                                    maxLength={
                                        validation.verticalModal.desc.maxLen
                                    }
                                    value={newCourse.desc}
                                    autoComplete="on"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="modalCloseBtn"
                                data-bs-dismiss="modal"
                                ref={refClose}
                            >
                                Close
                            </button>
                            <button
                                onClick={handleAddCourse}
                                type="button"
                                className="modalAddBtn"
                            >
                                Add course
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {deleteModal}
        </div>
    );
};

export default CoursesPage;

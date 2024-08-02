import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import Card from "../../components/admin/Card";
import HeaderCard from "../../components/common/HeaderCard";
import { CardGrid } from "../../components/common/CardGrid";
import Loader from "../../components/common/Loader";

// My css
import css from "../../css/admin/verticals-page.module.css";

import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import { refreshScreen } from "../../utilities/helper_functions";

//////////////////////////////////////////////////////////////////////////////////////////////

const VerticalsPage = () => {
    const [allVerticals, setAllVerticals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newVertical, setNewVertical] = useState({
        name: "",
        desc: "",
        imgSrc: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        async function getAllVerticals() {
            setIsLoading(true);

            try {
                const adminId = "yuva@gmail.com";
                const adminPassword = "admin@yuva123";
    const basicAuth = btoa(`${adminId}:${adminPassword}`);

                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/verticals/all`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                           Authorization: `Basic ${basicAuth}`, // Include Basic Authentication
                            "auth-token": sessionStorage.getItem("token"),
                        },
                    }
                );

                const result = await response.json();
                // (result);

                setIsLoading(false);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/login");
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    setAllVerticals(result.allVerticals);
                } else {
                    // for future
                }
            } catch (err) {
                // (err.message);
                setIsLoading(false);
            }
        }

        getAllVerticals();
    }, []);

    //////////////////////////////// Add Vertical Modal ////////////////////////////////////////

    const ref = useRef(null);
    const refClose = useRef(null);

    async function openAddModal() {
        ref.current.click();
    }

    function onAddChange(e) {
        const updatedVertical = {
            ...newVertical,
            [e.target.name]: e.target.value,
        };
        setNewVertical(updatedVertical);

        // (updatedVertical);
    }

    async function handleAddVertical() {
        // todo: validate input
        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
const basicAuth = btoa(`${adminId}:${adminPassword}`);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": sessionStorage.getItem("token"),
                       Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(newVertical),
                }
            );

            const result = await response.json();

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    navigate("/admin/login"); // login or role issue
                } else if (response.status === 500) {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                refreshScreen();
                // set fields in modal to empty if not refreshing scrn
            } else {
                // for future
            }

            refClose.current.click();
        } catch (err) {
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    async function handleAddOrViewCourses(e) {
        const verticalId = e.target.id;
        // (verticalId);
        navigate(`/admin/verticals/${verticalId}/courses/all`);
    }

    ////////////////////////////////////// Delete Vertical Modal ///////////////////////////////////////////////////
    const ref2 = useRef(null);
    const refClose2 = useRef(null);
    const [toDeleteVerticalId, setToDeleteVerticalId] = useState("");
    const [confirmText, setConfirmText] = useState("");

    function openDeleteModal(e) {
        ref2.current.click();
        setToDeleteVerticalId(e.target.id);
    }

    function onConfirmTextChange(e) {
        setConfirmText(e.target.value);
    }

    async function handleDeleteVertical() {
        const verticalId = toDeleteVerticalId;
        // todo: validate input
        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
const basicAuth = btoa(`${adminId}:${adminPassword}`);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/delete`,
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
                // set fields in modal to empty if not refreshing scrn
            } else {
                // for future
            }

            refClose2.current.click();
        } catch (error) {
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
                                Delete vertical
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: "1rem" }}>
                                <label htmlFor="confirm" className="modalLabel">
                                    Confirmation
                                </label>
                                <input
                                    type="text"
                                    className="modalInput"
                                    id="confirm"
                                    autoComplete="on"
                                    name="confirm"
                                    placeholder="Type 'Confirm' to delete"
                                    value={confirmText}
                                    onChange={onConfirmTextChange}
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
                                onClick={handleDeleteVertical}
                                type="button"
                                className="modalDltBtn"
                                disabled={confirmText !== "Confirm"}
                            >
                                Delete Vertical
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const loader = <Loader />;

    const element = (
        <section id="verticals">
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
                                onAddViewClick={handleAddOrViewCourses}
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
            <HeaderCard>
                <h1 className="headerTitle">Verticals</h1>

                <hr />
                <p className="headerSubtitle">
                    You can View/Add/Delete verticals from here
                </p>
                <p className="headerSubtitle">
                    Note: Deleting a vertical is irreversible. Do it at your own
                    risk.
                </p>

                <button
                    onClick={openAddModal}
                    className={`${css.addBtn} commonBtn`}
                >
                    Add a new vertical
                </button>
            </HeaderCard>

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
                                Add a new vertical
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
                                    minLength={1}
                                    maxLength={
                                        validation.verticalModal.name.maxLen
                                    }
                                    onChange={onAddChange}
                                    value={newVertical.name}
                                    autoComplete="on"
                                />
                            </div>
                            <div className="mb-3">
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
                                    onChange={onAddChange}
                                    maxLength={
                                        validation.verticalModal.desc.maxLen
                                    }
                                    value={newVertical.desc}
                                    autoComplete="on"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="imgSrc" className="modalLabel">
                                    Image Source *
                                </label>
                                <input
                                    type="text"
                                    className="modalInput"
                                    id="imgSrc"
                                    name="imgSrc"
                                    onChange={onAddChange}
                                    value={newVertical.imgSrc}
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
                                onClick={handleAddVertical}
                                type="button"
                                className="modalAddBtn"
                            >
                                Add Vertical
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {deleteModal}
        </div>
    );
};

export default VerticalsPage;

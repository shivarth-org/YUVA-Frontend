import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import Card from "../../components/admin/Card";
import { CardGrid } from "../../components/common/CardGrid";
import Loader from "../../components/common/Loader";

// My css
import css from "../../css/admin/units-page.module.css";

import { SERVER_ORIGIN } from "../../utilities/constants";
import {
    getVideoThumbnail,
    refreshScreen,
} from "../../utilities/helper_functions";

///////////////////////////////////////////////////////////////////////////////////////////////////////////

const UnitsPage = () => {
    const [allUnits, setAllUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function getAllUnits() {
            setIsLoading(true);
            const { verticalId, courseId } = params;

            try {
                const adminId = "yuva@gmail.com";
                const adminPassword = "admin@yuva123";
    const basicAuth = btoa(`${adminId}:${adminPassword}`);

                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/${courseId}/units/all`,
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
                    setAllUnits(result.allUnits);
                } else {
                    // for future
                }
            } catch (err) {
                setIsLoading(false);
            }
        }

        getAllUnits();
    }, []);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    async function redirectToAddUnitPage(e) {
        const { verticalId, courseId } = params;
        // (params);

        navigate(
            `/admin/verticals/${verticalId}/courses/${courseId}/units/add`
        );
    }

    /////////////////////////////////////// Delete Course Modal //////////////////////////////////////////////////

    const ref = useRef(null);
    const refClose = useRef(null);
    const [toDeleteUnitId, setToDeleteUnitId] = useState("");
    const [confirmText, setConfirmText] = useState("");

    function onConfirmTextChange(e) {
        setConfirmText(e.target.value);
    }

    function openDeleteModal(e) {
        // (e.target);
        ref.current.click();
        setToDeleteUnitId(e.target.id);
    }

    async function handleDeleteUnit() {
        const { verticalId, courseId } = params;
        const unitId = toDeleteUnitId;
        // (courseId);

        // todo: validate input
        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
const basicAuth = btoa(`${adminId}:${adminPassword}`);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/${courseId}/units/${unitId}/delete`,
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
        } catch (err) {
        }

        refClose.current.click();
    }

    const deleteModal = (
        <>
            <button
                ref={ref}
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
                                Delete Unit
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
                                ref={refClose}
                            >
                                Close
                            </button>
                            <button
                                onClick={handleDeleteUnit}
                                type="button"
                                className="modalDltBtn"
                                disabled={confirmText !== "Confirm"}
                            >
                                Delete unit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const loader = <Loader />;

    const element = (
        <section id="units">
            {allUnits.length > 0 ? (
                <CardGrid>
                    {allUnits.map((unit) => {
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
                                    onDeleteClick={openDeleteModal}
                                />
                            </div>
                        );
                    })}
                </CardGrid>
            ) : (
                <h1 className="nothingText">Sorry, we found nothing</h1>
            )}
        </section>
    );

    return (
        <div className={css.outerDiv}>
            <div style={{ textAlign: "center" }}>
                <button
                    className={`${css.addBtn} commonBtn`}
                    onClick={redirectToAddUnitPage}
                >
                    Add a new Unit
                </button>
            </div>

            {isLoading ? loader : element}

            {deleteModal}
        </div>
    );
};

export default UnitsPage;

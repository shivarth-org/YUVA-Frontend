import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    LinkedinShareButton,
    LinkedinIcon,
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
} from "react-share";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import cert_img from "./cert_new.png"

// My components
import Cert from "../../components/user/Cert";
import SecCard from "../../components/common/SecCard";
import Loader from "../../components/common/Loader";

// My css
import css from "../../css/user/cert-page.module.css";

// import { downloadCertificate } from "../../utilities/helper_functions";

import { SERVER_ORIGIN } from "../../utilities/constants";

//!
import "../../css/user/cert_new.css";
import cert_bg from "../../assets/images/cert_new.jpg";
//!

const CertPage = () => {
    const [certInfo, setCertInfo] = useState({
        holderName: "",
        passingDate: "",
        courseName: "",
        unitId: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isCertValid, setIsCertValid] = useState(true);

    const params = useParams();
    // (params);

    const certPagePublicURL = window.location.href;
    // (certPagePublicURL);

    function formatDate(inputDate) {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        // Split the input date into day, month, and year
        const dateParts = inputDate.split("-");
        if (dateParts.length !== 3) {
            return "Invalid date format";
        }

        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10);
        const year = parseInt(dateParts[2], 10); // Assuming 2000 as the base year for 'yy'

        // Handle the day suffix (e.g., 1st, 2nd, 3rd, 4th, ...)
        const daySuffix = (() => {
            if (day >= 11 && day <= 13) {
                return "th";
            }
            switch (day % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        })();

        // Format the date
        const formattedDate = `${day}${daySuffix} ${months[month - 1]} ${year}`;

        return formattedDate;
    }

    useEffect(() => {
        const getCert = async () => {
            setIsLoading(true);

            const certId = params.certId;
            //   ("CertPage certId: ", certId);

            try {
                const userId = process.env.REACT_APP_USER_ID;
                const userPassword = process.env.REACT_APP_USER_PASSWORD;
                 const basicAuth = btoa(`${userId}:${userPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/public/certificate/${certId}`,
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
                if (result.success === false) {
                    setIsCertValid(false);
                    setIsLoading(false);
                    return;
                }
                setIsCertValid(true);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 404) {
                        // invalid cert id
                    } else {
                        alert("Internal server error"); // todo: toast notify
                    }
                } else if (response.ok && response.status === 200) {
                    const date = result.certInfo.passingDate;
                    const dateInWords = formatDate(date);
                    result.certInfo.passingDate = dateInWords;

                    setCertInfo(result.certInfo);
                } else {
                    // for future
                }

                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
            }
        };

        getCert();
    }, []);

    const downloadCertificate = async () => {
        setIsDownloading(true);
        // Create a new jsPDF instance
        const doc = new jsPDF("l", "mm", "a4");

        // Determine the height based on the device's screen size
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Get all the elements you want to include in the PDF
        const elementsToCapture = document.querySelectorAll(
            ".element-to-capture"
        );
        // ('Number of elements to capture:', elementsToCapture.length);
        
        // Loop through each element and add it as a new page in the PDF
        for (const element of elementsToCapture) {
            // ('Capturing element:', element);
            // Capture the content of the element as an image using html2canvas
            const canvas = await html2canvas(element, { scale: 10 });
            const imgData = canvas.toDataURL("image/jpeg", 0.7);

            // Add the image to the PDF
            doc.addImage(
                imgData,
                "JPEG",
                0,
                0,
                pageWidth,
                pageHeight,
                "",
                "FAST"
            );

            // Add a new page for the next element
            if (element !== elementsToCapture[elementsToCapture.length - 1]) {
                doc.addPage();
            }
        }
        // Save the PDF with a specific filename
        const certFileName = `Yuva_${certInfo.holderName}_certificate`;
        // ("File: ", certFileName);
        doc.save(certFileName);
        setIsDownloading(false);
    };

    const handleCertPDFDownload = () => {
        // ("downloading");

        downloadCertificate();
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : isCertValid ? (
                <div className={css.outerDiv}>
                    <div className="row">
                        <div className="col-lg-8 ">
                            {/* //!NEW CERT */}
                            <div className="certificate">
                                <div className="element-to-capture">
                                    <img
                                        src={cert_bg}
                                        alt="Certificate Background"
                                        className="certificate-background"
                                    />
                                    <div className="text-overlay">
                                        <div className="name">
                                            {certInfo.holderName}
                                        </div>
                                        <div className="course-info">
                                            {`has successfully completed a module which is a part of the '${certInfo.courseName}' course on ${certInfo.passingDate}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* //!NEW CERT */}
                            <div className={css.certDescDiv}>
                                <div style={{ fontSize: "120%" }}>
                                    <p className="text-ff2">
                                        This certificate verifies that{" "}
                                        <span className="text-underline">
                                            {certInfo.holderName}
                                        </span>{" "}
                                        has successfully completed a module that
                                        is part of the{" "}
                                        <span className="text-underline">
                                            {certInfo.courseName}
                                        </span>{" "}
                                        course on the Yuva Portal on{" "}
                                        <span className="text-underline">
                                            {certInfo.passingDate}
                                        </span>{""}
                                        .
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className={css.certInfoDiv}>
                                <p className={css.holderText}>
                                    Certificate holder name:
                                </p>
                                <h3 className={css.holderName}>
                                    {certInfo.holderName}
                                </h3>

                                <p className={css.holderText}>Course name:</p>
                                <h3 className={css.holderName}>
                                    {certInfo.courseName}
                                </h3>

                                <hr></hr>

                                <button
                                    className={css.downloadBtn}
                                    onClick={handleCertPDFDownload}
                                >
                                    {isDownloading
                                        ? "Please wait.."
                                        : "Download PDF"}
                                </button>
                                <p className={css.shareText}>Or share on</p>
                                <div className={css.shareBtnDiv}>
                                    <LinkedinShareButton
                                        url={certPagePublicURL}
                                    >
                                        <LinkedinIcon
                                            className={css.shareIcon}
                                            size={55}
                                            round={true}
                                        />
                                    </LinkedinShareButton>

                                    <FacebookShareButton
                                        url={certPagePublicURL}
                                    >
                                        <FacebookIcon
                                            className={css.shareIcon}
                                            size={55}
                                            round={true}
                                        />
                                    </FacebookShareButton>

                                    <TwitterShareButton url={certPagePublicURL}>
                                        <TwitterIcon
                                            className={css.shareIcon}
                                            size={55}
                                            round={true}
                                        />
                                    </TwitterShareButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100vh", // Makes the container take the full height of the viewport
                            textAlign: "center",
                        }}
                    >
                        <p>This certificate is invalid.</p>
                        <p>
                            Please visit{" "}
                            <a href="https://yuvaportal.youngindians.net/">
                                https://yuvaportal.youngindians.net/
                            </a>{" "}
                            to get a valid certificate.
                        </p>
                    </div>
                </>
            )}
        </>
    );
};

export default CertPage;

import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import Spinloader from "./Spinloader";

import css from "../../css/admin/users-page.module.css";
import toast from "react-hot-toast";

const FileUpload = ({ collegeName }) => {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [excelData, setExcelData] = useState(null);
    const [correctFormat, setCorrectFormat] = useState(false);
    const [loader, setLoader] = useState(false);

    function handleFileRetrieve(e) {
        // const excelFile = e.target.files[0];
        setFileUploaded(true);
        setExcelData(e.target.files?.[0]);
    }
    function handleFileUpload() {
        if (!collegeName) {
            toast.error("Please select an Institute");
        } else {
            const formData = new FormData();
            const file = excelData;
            // console.log(collegeName);
            formData.append("collegeName", collegeName.label);
            formData.append("_id", collegeName.value)
            formData.append("document_file", file);
            axios.post(`${SERVER_ORIGIN}/api/admin/auth/students/upload`, formData, {
                headers: {
                    // "Content-Type": "multipart/form-data",
                },
            })
                .then((response) => {
                    setCorrectFormat(true);
                    setLoader(true);
                    setFileUploaded(false);
                })
                .catch((error) => {
                    alert(error.response.data.statusText || error.response.data);
                    setExcelData(null);
                    setFileUploaded(false);
                });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }

    return (
        <div className={css.fileDiv}>
            {/* <form className={css.fileDiv} onSubmit={handleExelDataSubmit}> */}
            <div className={css.innerFileDiv}>
                <label
                    htmlFor="inputTag"
                    className={`${css.fileUploadBtn} commonBtn`}>
                    <FontAwesomeIcon icon={faUpload} style={{ color: "#ffffff", marginRight: "5px" }} /> <span>Select Excel File</span>
                    <input
                        id="inputTag"
                        type="file"
                        onChange={handleFileRetrieve}
                        accept=".xlsx, .xls"
                        className={css.fileInput}
                    />
                </label>
            </div>
            <div className={css.innerFileDiv}>
                <div className={css.innerFileDiv}>
                    {/* <label
                    htmlFor="inputTag"
                    className={`${css.fileUploadBtn} commonBtn`}>
                    <FontAwesomeIcon icon={faUpload} style={{ color: "#ffffff", marginRight: "5px" }} /> <span>Select Excel File</span>
                    <input
                        id="inputTag"
                        type="file"
                        onChange={handleFileRetrieve}
                        accept=".xlsx, .xls"
                        className={css.fileInput}
                    />
                </label> */}

                    {loader && <Spinloader />}
                    {fileUploaded && excelData ? (
                        <h3 className={css.fileUploaded}>
                            Excel data retrieved successfully. Press the 'Upload'
                            button to upload the file.
                        </h3>
                    ) : (
                        correctFormat &&
                        excelData && (
                            <h3 className={css.fileUploaded}>
                                The data has been successfully uploaded.
                            </h3>
                        )
                    )}
                </div>
                {excelData && (
                    <button
                        // type="submit"
                        onClick={handleFileUpload}
                        className={`${css.fileUploadBtn} commonBtn`}
                    >
                        Upload
                    </button>
                )}
            </div>
            {/* </form> */}
        </div>
    );
};

// const dropZoneWrapper = {
//   paddingInline: '20%',
// }

// const dropzoneStyles = {
//   border: '2px dashed #cccccc',
//   borderRadius: '4px',
//   padding: '20px',
//   textAlign: 'center',
//   cursor: 'pointer',
// };

export default FileUpload;

// <div style={dropZoneWrapper}>
//       <div {...getRootProps()} style={dropzoneStyles}>
//         {/* <input type='file' {...getInputProps()} /> */}
//         {/* <button onClick={inputPropsFunction}>click</button> */}
//         <p>Drag and drop a file here, or click to select a file</p>
//         <form>

//           <input type="file"></input>
//         </form>
//       </div>
//     </div>

import React, { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import EM from "../../css/chapterEM/add-chapterEM.module.css";
import { useUserType } from '../../routes/common/UserTypeContext';
import { SERVER_ORIGIN } from '../../utilities/constants';
import css from '../../css/admin/home-page.module.css';
import userTypeModalCss from '../../css/common/user-type-modal.module.css';
import SecCard from '../../components/common/SecCard';
import upload_img from '../../assets/images/Download-bro.svg';
import manual_sign from '../../assets/images/manual-sign.png';
import upload_sign from '../../assets/images/upload-sign.png';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelect = ({ selectedYear, handleYearChange }) => {
    const handleChange = (date) => {
        if (date) {
            handleYearChange({
                target: {
                    name: "signDate", value: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
                }
            });
        }
        console.log(date, "date");
    };

    return (
        <DatePicker
            selected={selectedYear}
            onChange={handleChange}
            // showYearPicker
            // dateFormat="yyyy"
            className={`${EM.chapterEMInput} w-100`}
            placeholderText="Select MOU Sign Date"


        />
    );
};



const InstituteMouModal = ({ text }) => {
    // const { userType, setUserTypeToInstitute } = useUserType();
    // const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [selectedImage1, setSelectedImage1] = useState(null);
    const [imageBlob1, setImageBlob1] = useState(null);
    const [selectedImage2, setSelectedImage2] = useState(null);
    const [imageBlob2, setImageBlob2] = useState(null);
    // const [imageBlob2, setImageBlob2] = useState(null);
    // const [selectedImage2, setSelectedImage2] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMouManual, setIsMouManual] = useState(false)
    const [isMouSigned, setIsMouSigned] = useState(false)
    const [instituteForm, setInstituteForm] = useState({
        instituteName: "",
        nodalName: "",
        officeLocation: "",
        signatoryDesignation: "",
        mouDuration: "",
        signDate: ""

    });
    const [mouURL, setMouUrl] = useState(`http://yuva.evalue8.info/new-mou-sample-pdf.pdf`)
    // const [EM_id, setEM_id] = useState({ '_id': sessionStorage.getItem('_id') })

    // useEffect(() => {
    //     setEM_id({ '_id': sessionStorage.getItem('_id') });
    // }, []);
    useEffect(() => {
        const api = async function () {
            try {
                const response = await fetch(`${SERVER_ORIGIN}/api/institute/auth/check-mou`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify({ _id: sessionStorage.getItem('_id') }),
                });
                const result = await response.json();
                if (!response.status >= 300) {
                    throw new Error('Failed to upload PDFs');
                } else {
                    if (result.data.docUrl.includes('.pdf')) {
                        setMouUrl(result.data.docUrl)
                    }
                    // console.log(result,"http://localhost:8080/663d2ba6009ef886dd687f5f_mou.pdf");
                    setInstituteForm({
                        instituteName: result.data.name,
                        nodalName: result.data.officerName,
                        officeLocation: result.data.city + ", " + result.data.state,
                        signatoryDesignation: result.data.designation ?? "",
                        mouDuration: result.data.mouDuration ?? "",
                    });

                    if (isMouSigned === false) {
                        if (result.data.isSignatureReceived === false) {
                            toast.error('Please contact to EM for uploading digital signatures or manually signed MOU')
                            setIsMouSigned(true)
                        } else {
                            setIsMouSigned(false)
                        }
                    } else if (result.data.isMOUapproved === true) {
                        setIsMouSigned(true)
                    } else if (result.data.isMOUrejected === true) {
                        setIsMouSigned(false)
                    }
                }

            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }

        api()

    }, [isMouSigned]);

    // useEffect(() => {
    //     if (!userType) {
    //         setUserTypeToInstitute();
    //     }
    // }, [userType, setUserTypeToInstitute]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose2 = () => { setShow2(false); setIsMouManual(false) };
    const handleShow2 = () => { setShow2(true) };
    const handelManualUpload = () => setIsMouManual(true)
    const handleClick = () => {
        handleShow2();
        handelManualUpload();
    };

    const [errors, setErrors] = useState({});

    const onChange = (e) => {
        const { name, value } = e.target;
        setInstituteForm({ ...instituteForm, [name]: value });
    };


    const onDrop1 = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.type.startsWith('image/png')) {
                setSelectedImage1(URL.createObjectURL(file));
                setImageBlob1(file);
            } else {
                toast.error('Only .png are allowed.');
            }
        }
    }, []);
    const onDrop2 = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.type === 'application/pdf') {
                setSelectedImage2(URL.createObjectURL(file));
                setImageBlob1(file);
            } else {
                toast.error('Only .pdf files are allowed.');
            }
        }
    }, []);

    const clearImage1 = () => {
        setSelectedImage1(null);
        setImageBlob1(null);
        toast.success('File removed successfully');
    };
    const clearImage2 = () => {
        setSelectedImage2(null);
        setImageBlob2(null);
        toast.success('File removed successfully');
    };
    const logImageBlob = async () => {
        if (!imageBlob1) {
            toast.error('Institutes signed MOU must be uploaded');
        } else if (!instituteForm.instituteName) {
            toast.error('Please fill institute name');
        } else if (!instituteForm.nodalName) {
            toast.error('Please fill nodal name');
        } else if (!instituteForm.officeLocation) {
            toast.error('Please fill office location');
        } else if (!instituteForm.signatoryDesignation) {
            toast.error('Please fill signatory designation')
        } else if (!instituteForm.mouDuration) {
            toast.error('Please fill MOU duration')
        } else if (!instituteForm.signDate) {
            toast.error('Please fill Sign Date')
        } else {
            loadMouData()
        }
    };

    const loadMouData = async () => {
        setLoading(true);
        try {
            const institute_id = sessionStorage.getItem('_id')
            const formData = new FormData();
            formData.append('instituteName', instituteForm.instituteName);
            formData.append('nodalName', instituteForm.nodalName);
            formData.append('officeLocation', instituteForm.officeLocation);
            formData.append('signatoryDesignation', instituteForm.signatoryDesignation);
            formData.append('mouDuration', instituteForm.mouDuration);
            formData.append('institute_id', institute_id);
            formData.append('signDate', instituteForm.signDate);
            formData.append('document_file', imageBlob1);
            formData.append('document_file', imageBlob2);
            const response = await fetch(`${SERVER_ORIGIN}/api/institute/auth/${!selectedImage2 ? 'modify-pdf' : 'manual-mou'}`, {
                method: 'POST',
                headers: {
                    'auth-token': sessionStorage.getItem('token'),
                },
                body: formData,
            });
            const result = await response.json();
            // console.log(result);
            if (!response.status >= 300) {
                throw new Error('Failed to upload PDFs');
            } else {
                setSelectedImage1(null);
                toast.success('File uploaded successfully');
                setLoading(false);
                // console.log(result)
                // toast.success('MOU Updated Successfully');
            }
            handleClose();
        } catch (error) {
            // toast.error('Failed to Update MOU');
            // console.log(error);
            toast.error(error.message)
        } finally {
            setLoading(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }


    const handleInputChange = (e) => {
        setInstituteForm({ ...instituteForm, [e.target.name]: e.target.value });
    };

    const { getRootProps: getRootProps1, getInputProps: getInputProps1, isDragActive: isDragActive1 } = useDropzone({ onDrop: onDrop1 });
    const { getRootProps: getRootProps2, getInputProps: getInputProps2, isDragActive: isDragActive2 } = useDropzone({ onDrop: onDrop2 });

    return (
        <>
            <Button className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`} onClick={handleShow} sx={{
                "&.Mui-disabled": {
                    background: "#eaeaea",
                    color: "#c0c0c0"
                }
            }} disabled={isMouSigned}>
                {text ? text : 'Click Me'}
            </Button>

            {/* <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title> Select how you want to sign MOU?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex justify-content-evenly'>
                        <div className='d-grid m-5' style={{
                            border: '2px dashed #cccccc',
                            padding: '1rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: `${isDragActive2 ? '#00850026' : '#f5f5f5'}`

                        }} onClick={handleClick}>
                            <div>
                                <img src={upload_sign} alt='upload-sign' height='400px' width='400px' />
                            </div>
                            <Button className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`} onClick={handleClick}>
                                Manual Sign & Upload
                            </Button>
                        </div>
                        <div className='d-grid m-5' style={{
                            border: '2px dashed #cccccc',
                            padding: '1rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: `${isDragActive2 ? '#00850026' : '#f5f5f5'}`

                        }} onClick={handleShow2} >
                            <div>
                                <img src={manual_sign} alt='upload-sign' height='400px' width='400px' />
                            </div>
                            <Button className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`} onClick={handleShow2}>
                                Digital Sign & Upload
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal> */}
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>MEMORANDUM OF UNDERSTANDING (“MOU”)</Modal.Title>
                </Modal.Header>
                {
                    // isMouManual === true ?
                    //     <>


                    //     </>
                    //     :
                    //     <>
                    <Modal.Body>
                        <Row>
                            <Col sm={6} className={userTypeModalCss.col1}>
                                <SecCard>
                                    <div className="my-3">
                                        <b>Download this MOU for more clarity...</b>
                                    </div>
                                    <embed src={mouURL} type="application/pdf" width="100%" height="695px" />
                                </SecCard>
                            </Col>
                            <Col sm={6} className={userTypeModalCss.col1}>
                                <SecCard className="m-0">
                                    <div className="my-3">
                                        <b>Just fill MOU duration and Set the Sign Date rest is prefilled.</b>
                                    </div>
                                    <div>
                                        <div style={{ color: "red" }}>
                                            {Object.values(errors).map((error, index) => (
                                                <div key={index}>{error}</div>
                                            ))}
                                        </div>

                                        <div className="text-ff2" autoComplete="on">
                                            <div style={{ marginBottom: "0.8rem" }}>
                                                <label className={EM.chapterEMLabel} htmlFor="instituteName">
                                                    Institute Name <span style={{ color: "red" }}>*</span>{" "}
                                                </label>
                                                <input
                                                    className={EM.chapterEMInput}
                                                    type="text"
                                                    id="instituteName"
                                                    name="instituteName"
                                                    placeholder="Enter institute name"
                                                    value={instituteForm.instituteName}
                                                    onChange={onChange}
                                                    autoComplete="on"
                                                    readOnly
                                                    disabled
                                                />
                                            </div>

                                            <div style={{ marginBottom: "0.8rem" }}>
                                                <label className={EM.chapterEMLabel} htmlFor="nodalName">
                                                    Nodal Name <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    className={EM.chapterEMInput}
                                                    type="text"
                                                    id="nodalName"
                                                    name="nodalName"
                                                    placeholder="Enter nodal name"
                                                    value={instituteForm.nodalName}
                                                    onChange={onChange}
                                                    autoComplete="on"
                                                    readOnly
                                                    disabled
                                                // disabled
                                                />
                                            </div>
                                            <div style={{ marginBottom: "0.8rem" }}>
                                                <label className={EM.chapterEMLabel} htmlFor="officeLocation">
                                                    Office Location <span style={{ color: "red" }}>*</span>{" "}
                                                </label>
                                                <input
                                                    className={EM.chapterEMInput}
                                                    type="text"
                                                    id="officeLocation"
                                                    name="officeLocation"
                                                    placeholder="Enter office location"
                                                    value={instituteForm.officeLocation}
                                                    onChange={onChange}
                                                    autoComplete="on"
                                                    readOnly
                                                    disabled
                                                />
                                            </div>

                                            <div style={{ marginBottom: "0.8rem" }}>
                                                <label className={EM.chapterEMLabel} htmlFor="signatoryDesignation">
                                                    Signatory Designation <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    className={EM.chapterEMInput}
                                                    type="text"
                                                    id="signatoryDesignation"
                                                    name="signatoryDesignation"
                                                    placeholder="Enter signatory designation"
                                                    value={instituteForm.signatoryDesignation}
                                                    onChange={onChange}
                                                    autoComplete="on"
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                            <div style={{ marginBottom: "0.8rem" }}>
                                                <label className={EM.chapterEMLabel} htmlFor="mouDuration">
                                                    MOU Duration
                                                </label>
                                                <select
                                                    className={EM.chapterEMInput}
                                                    id="mouDuration"
                                                    name="mouDuration"
                                                    value={instituteForm.mouDuration}
                                                    onChange={onChange}
                                                >
                                                    {
                                                        instituteForm.mouDuration === "0" ?
                                                            <>
                                                                <option value="">-- Select Duration --</option>
                                                                <option value="1">1 Year</option>
                                                                <option value="2">2 Years</option>
                                                                <option value="3">3 Years</option>
                                                            </>
                                                            :
                                                            <>
                                                                <option value={instituteForm.mouDuration}>{instituteForm.mouDuration}</option>
                                                            </>
                                                    }
                                                </select>
                                            </div>
                                            <div style={{ marginBottom: "0.8rem" }}>
                                                <label className={EM.chapterEMLabel} htmlFor="signDate">
                                                    MOU Sign Date  <span style={{ color: "red" }}>*</span>{" "}
                                                </label>
                                                <div className="w-100">
                                                    <DateSelect
                                                        selectedYear={instituteForm.signDate}
                                                        handleYearChange={handleInputChange}
                                                        className='w-100'
                                                    />
                                                </div>
                                            </div>
                                            <Row>
                                                <Col md={12}>
                                                    <div style={{ marginBottom: "0.8rem" }}>
                                                        <div
                                                            {...getRootProps1()}
                                                            style={{
                                                                border: '2px dashed #cccccc',
                                                                padding: '1rem',
                                                                textAlign: 'center',
                                                                cursor: 'pointer',
                                                                backgroundColor: `${isDragActive1 ? '#00850026' : '#f5f5f5'}`
                                                            }}
                                                        >   <p><b>Institute Sign</b></p>
                                                            <input {...getInputProps1()} style={{ display: 'none' }} />
                                                            {selectedImage1 ? (
                                                                <>
                                                                    <img src={selectedImage1} alt="Selected" width="100%" height="100px" />
                                                                    <Button
                                                                        className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`}
                                                                        onClick={clearImage1}
                                                                        disabled={loading}
                                                                    >
                                                                        Dump Sign
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {isDragActive1 ? (
                                                                        <p>
                                                                            <img src={upload_img} alt="upload" width="100%" height="300px" />
                                                                            <b>Drop the files here ...</b>
                                                                        </p>
                                                                    ) : (
                                                                        <>
                                                                            <img src={upload_img} alt="upload" width="100%" height="300px" />
                                                                            <p>
                                                                                <b>Drag 'n' drop the file here, or click to select file. (Only .png is allowed)</b>
                                                                            </p>
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}

                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <Button
                                            className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`}
                                            style={{ marginLeft: '10px' }}
                                            onClick={logImageBlob}
                                            disabled={loading}
                                        >
                                            {loading ? 'Uploading...' : 'Save Files'}
                                        </Button>
                                    </div>
                                </SecCard>
                            </Col>
                        </Row>
                    </Modal.Body>
                    // </>
                }
                <div><br /></div>
            </Modal>
        </>
    );
};

export default InstituteMouModal;

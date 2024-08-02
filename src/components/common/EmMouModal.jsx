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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import manual_sign from '../../assets/images/manual-sign.png';
import upload_sign from '../../assets/images/upload-sign.png';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const DateSelect = ({ selectedYear, handleYearChange }) => {
    const handleChange = (date) => {
        if (date) {
            handleYearChange({
                target: {
                    name: "signDate", value: `${date.getMonth() + 1
                        }/${date.getDate()
                        }/${date.getFullYear()}`
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

const EmMouModal = ({ text }) => {
    const { userType, setUserTypeToInstitute } = useUserType();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [selectedImage1, setSelectedImage1] = useState(null);
    const [imageBlob1, setImageBlob1] = useState(null);
    const [selectedImage2, setSelectedImage2] = useState(null);
    const [imageBlob2, setImageBlob2] = useState(null);
    const [imageBlob3, setImageBlob3] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mouURL, setMouUrl] = useState(`http://yuva.evalue8.info/new-mou-sample-pdf.pdf`)
    const [EM_id, setEM_id] = useState({ _id: sessionStorage.getItem('_id') });
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [selectedImage3, setSelectedImage3] = useState(null);
    const [isMouManual, setIsMouManual] = useState(false)
    const [isMouUpload, setIsMouUpload] = useState(false)
    const [chapterEMForm, setchapterEMForm] = useState({
        chapterEmName: "",
        regionalManagerName: "",
        signDate: "",
        mouDuration: ""
    });
    const [errors, setErrors] = useState({});
    const handleShow2 = () => { setShow2(true) };
    const handleClose2 = () => { setShow2(false); setIsMouManual(false) };
    const handelManualUpload = () => setIsMouManual(true)
    const handleClick = () => {
        handleShow2();
        handelManualUpload();
    };
    useEffect(() => {
        if (!userType) {
            setUserTypeToInstitute();
        }
        const checkMou = async () => {
            try {
                const response = await fetch(`${SERVER_ORIGIN}/api/em/auth/check-mou`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify({ _id: EM_id }),
                });

                const result = await response.json();
                if (!response.status >= 300) {
                    throw new Error('Failed to upload PDFs');
                } else {
                    if (result.data.mou_url.includes('.pdf')) {
                        setMouUrl(result.data.mou_url)

                    }
                    // if (result.data.isMOUsigned){
                    setIsMouUpload(result.data.isMOUsigned)
                    // }
                    setchapterEMForm({
                        chapterEmName: result.data.name,
                        regionalManagerName: result.data.regionalManagerName,
                        mouDuration: result.data.mouDuration,
                        signDate: result.data.signDate
                    });
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
        checkMou()
    }, [userType, setUserTypeToInstitute]);
    const onChange = (e) => {
        const { name, value } = e.target;
        setchapterEMForm({ ...chapterEMForm, [name]: value });
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
            if (file.type.startsWith('image/png')) {
                setSelectedImage2(URL.createObjectURL(file));
                setImageBlob2(file);
            } else {
                toast.error('Only .png are allowed.');
            }
        }
    }, []);

    const onDrop3 = useCallback((acceptedFiles) => {
        // if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type === 'application/pdf') {
            setSelectedImage3(URL.createObjectURL(file));
            setImageBlob3(file);
        } else {
            toast.error('Only .pdf files are allowed.');
        }
        // }
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
    const clearImage3 = () => {
        setSelectedImage3(null);
        setImageBlob3(null);
        toast.success('File removed successfully');
    };
    function handelApi() {
        if (isMouManual) {
            if (!imageBlob3) {
                toast.error('MOU must be uploaded');
            } else if (!chapterEMForm.signDate) {
                toast.error('Signing date must be selected');
            } else if (!chapterEMForm.mouDuration) {
                toast.error('MOU duration must be selected');
            } else {
                logImageBlob()
            }
        } else {

            if (!imageBlob1) {
                toast.error('Yi Chapter Chair signature must be uploaded');
            } else if (!imageBlob2) {
                toast.error('Regional CII signature must be uploaded');
            }
            else if (!chapterEMForm.chapterEmName) {
                toast.error('Please fill Chapter EM name');
            } else if (!chapterEMForm.regionalManagerName) {
                toast.error('Please fill CII Regional Director');
            } else {

                logImageBlob()
            }
        }
    }

    const logImageBlob = async () => {

        // else {
        setLoading(true);
        try {
            const em_id = sessionStorage.getItem('_id')
            const formData = new FormData();
            formData.append('document_files', imageBlob1);
            formData.append('document_files', imageBlob2);
            formData.append('document_file', imageBlob3);
            formData.append('chapterEmName', chapterEMForm.chapterEmName);
            formData.append('regionalManagerName', chapterEMForm.regionalManagerName);
            formData.append('mouDuration', chapterEMForm.mouDuration);
            formData.append('signDate', chapterEMForm.signDate);
            formData.append('em_id', em_id);
            const response = await fetch(`${SERVER_ORIGIN}/api/em/auth/${!selectedImage3 ? 'modify-pdf' : 'manual-mou'}`, {
                method: 'POST',
                headers: {
                    // "Content-Type": "multipart/form-data",
                    'auth-token': sessionStorage.getItem('token'),
                },
                body: formData,
            });
            console.log(formData);
            const result = await response.json();
            if (!response.status >= 300) {
                throw new Error('Failed to upload PDFs');
            } else {
                // console.log(result);
                setMouUrl(result.data.mou_url)
                // setchapterEMForm({
                //     chapterEmName: "",
                //     regionalManagerName: "",
                // });
                setSelectedImage1(null);
                setSelectedImage2(null);
                setSelectedImage3(null);
                // toast.success('MOU Updated Successfully');
            }
            handleClose();
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        } finally {
            setLoading(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            toast.success("MOU updated successfully");
        }
        // }
    };

    const handleInputChange = (e) => {
        setchapterEMForm({ ...chapterEMForm, [e.target.name]: e.target.value });
    };

    const { getRootProps: getRootProps1, getInputProps: getInputProps1, isDragActive: isDragActive1 } = useDropzone({ onDrop: onDrop1 });
    const { getRootProps: getRootProps2, getInputProps: getInputProps2, isDragActive: isDragActive2 } = useDropzone({ onDrop: onDrop2 });
    const { getRootProps: getRootProps3, getInputProps: getInputProps3, isDragActive: isDragActive3 } = useDropzone({ onDrop: onDrop3 });
    console.log(isMouUpload,"isMouUpload");
    return (
        <>
            <Button className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`} onClick={handleShow} >
                {text ? text : 'Click Me'}
            </Button>
            {!isMouUpload
                &&
                <Modal show={show} onHide={handleClose} size="xl">
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
                </Modal>
            }

            <Modal show={isMouUpload ? show : show2} onHide={isMouUpload ? handleClose : handleClose2} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>MEMORANDUM OF UNDERSTANDING (“MOU”)</Modal.Title>
                </Modal.Header>
                {
                    isMouManual === true ?
                        <>
                            <Modal.Body>
                                <Row>
                                    <Col sm={6} className={userTypeModalCss.col1}>
                                        <SecCard>
                                            <div className="my-3">
                                                <b>Download this MOU for more clarity.</b>
                                            </div>
                                            <embed src={mouURL} type="application/pdf" width="100%" height="695px" />
                                        </SecCard>
                                    </Col>
                                    <Col sm={6} className={userTypeModalCss.col1}>
                                        <SecCard className="m-0">
                                            <div style={{ marginBottom: "0.8rem" }}>
                                                <label className={EM.chapterEMLabel} htmlFor="mouDuration">
                                                    MOU Duration
                                                </label>
                                                <select
                                                    className={EM.chapterEMInput}
                                                    id="mouDuration"
                                                    name="mouDuration"
                                                    value={chapterEMForm.mouDuration}
                                                    onChange={onChange}
                                                >
                                                    <option value="">-- Select Duration --</option>
                                                    <option value="1">1 Year</option>
                                                    <option value="2">2 Years</option>
                                                    <option value="3">3 Years</option>
                                                </select>
                                            </div>
                                            <div style={{ marginBottom: "0.8rem" }}>
                                                <label className={EM.chapterEMLabel} htmlFor="signDate">
                                                    MOU Sign Date  <span style={{ color: "red" }}>*</span>{" "}
                                                </label>
                                                <div className="w-100">
                                                    <DateSelect
                                                        selectedYear={chapterEMForm.signDate}
                                                        handleYearChange={handleInputChange}
                                                        className='w-100'
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: "0.8rem" }}>
                                                <div
                                                    {...getRootProps3()}
                                                    style={{
                                                        border: '2px dashed #cccccc',
                                                        padding: '1rem',
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                        backgroundColor: `${isDragActive3 ? '#00850026' : '#f5f5f5'}`

                                                    }}
                                                >
                                                    <p><b>Upload the signed MOU</b></p>
                                                    <input {...getInputProps3()} style={{ display: 'none' }} />
                                                    {selectedImage3 ? (
                                                        <>
                                                            <embed src={selectedImage3} type="application/pdf" width="100%" height="485px" />
                                                            <Button
                                                                className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`}
                                                                style={{ marginLeft: '10px' }}
                                                                onClick={clearImage3}
                                                                disabled={loading}
                                                            >
                                                                Dump MOU
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {isDragActive3 ? (
                                                                <p>
                                                                    <img src={upload_img} alt="upload" width="100%" height="300px" />
                                                                    <b>Drop the files here.</b>
                                                                </p>
                                                            ) : (
                                                                <>
                                                                    <img src={upload_img} alt="upload" width="100%" height="300px" />
                                                                    <p>
                                                                        <b>Drag 'n' drop the file here, or click to select file. (Only .pdf is allowed)</b>
                                                                    </p>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '10px' }}>
                                                <Button
                                                    className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`}
                                                    style={{ marginLeft: '10px' }}
                                                    onClick={handelApi}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Uploading...' : 'Save Files'}
                                                </Button>
                                            </div>
                                        </SecCard>
                                    </Col>
                                </Row>
                            </Modal.Body>

                        </>
                        :
                        <>
                            <Modal.Body>
                                <Row className={!isMouManual && 'd-flex justify-content-center align-item-center'} >
                                    {!isMouUpload ?
                                        <Col sm={6} className={userTypeModalCss.col1}>
                                            <SecCard>
                                                <div className="my-3">
                                                    <b>Download this MOU for more clarity...</b>
                                                </div>
                                                <embed
                                                    src={mouURL} type="application/pdf" width="100%" height="695px" />
                                            </SecCard>
                                        </Col>
                                        :
                                        <></>
                                    }
                                    <Col sm={6} className={userTypeModalCss.col1}>
                                        <SecCard className="m-0">
                                            <div className="my-3">
                                                <b>Fill the data in order to digitally sign the YUVA MOU</b>
                                            </div>
                                            <div>
                                                <div style={{ color: "red" }}>
                                                    {Object.values(errors).map((error, index) => (
                                                        <div key={index}>{error}</div>
                                                    ))}
                                                </div>

                                                <div className="text-ff2" autoComplete="on">
                                                    <div style={{ marginBottom: "0.8rem" }}>
                                                        <label className={EM.chapterEMLabel} htmlFor="chapterEmName">
                                                            Yi Chapter YUVA Chair Name <span style={{ color: "red" }}>*</span>{" "}
                                                        </label>
                                                        <input
                                                            className={EM.chapterEMInput}
                                                            type="text"
                                                            id="chapterEmName"
                                                            name="chapterEmName"
                                                            placeholder="Enter chapter EM name"
                                                            value={chapterEMForm.chapterEmName}
                                                            onChange={onChange}
                                                            readOnly

                                                        />
                                                    </div>

                                                    <div style={{ marginBottom: "0.8rem" }}>
                                                        <label className={EM.chapterEMLabel} htmlFor="regionalManagerName">
                                                            CII Regional Director Name <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <input
                                                            className={EM.chapterEMInput}
                                                            type="text"
                                                            id="regionalManagerName"
                                                            name="regionalManagerName"
                                                            placeholder="Enter CII RD name"
                                                            value={chapterEMForm.regionalManagerName}
                                                            onChange={onChange}
                                                            autoComplete="on"
                                                            readOnly
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
                                                            value={chapterEMForm.mouDuration}
                                                            onChange={onChange}
                                                        >
                                                            <option value="">-- Select Duration --</option>
                                                            <option value="1">1 Year</option>
                                                            <option value="2">2 Years</option>
                                                            <option value="3">3 Years</option>
                                                        </select>
                                                    </div>
                                                    <div style={{ marginBottom: "0.8rem" }}>
                                                        <label className={EM.chapterEMLabel} htmlFor="signDate">
                                                            MOU Sign Date  <span style={{ color: "red" }}>*</span>{" "}
                                                        </label>
                                                        <div className="w-100">
                                                            <DateSelect
                                                                selectedYear={chapterEMForm.signDate}
                                                                handleYearChange={handleInputChange}
                                                                className='w-100'
                                                            />
                                                        </div>
                                                    </div>
                                                    <Row>
                                                        <Col md={6}>
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
                                                                >   <p><b>Yi Chapter YUVA Chair Sign</b></p>
                                                                    <input {...getInputProps1()} style={{ display: 'none' }} />
                                                                    {selectedImage1 ? (
                                                                        <>
                                                                            <img src={selectedImage1} alt="Selected" width="100%" height="100px" />
                                                                            <div className={`${css.serviceBtn} commonBtn text-ff1 navbar-right d-flex justify-content-center align-items-center`}
                                                                                onClick={clearImage1}
                                                                                disabled={loading}>
                                                                                <FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff" }} />
                                                                            </div>
                                                                            {/* <Button
                                                                    className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`}
                                                                    onClick={clearImage1}
                                                                    disabled={loading}
                                                                >
                                                                    Dump Sign 1
                                                                </Button> */}
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
                                                        <Col md={6}>
                                                            <div style={{ marginBottom: "0.8rem" }}>
                                                                <div
                                                                    {...getRootProps2()}
                                                                    style={{
                                                                        border: '2px dashed #cccccc',
                                                                        padding: '1rem',
                                                                        textAlign: 'center',
                                                                        cursor: 'pointer',
                                                                        backgroundColor: `${isDragActive2 ? '#00850026' : '#f5f5f5'}`

                                                                    }}
                                                                >
                                                                    <p> <b>CII Regional Director Sign</b></p>
                                                                    <input {...getInputProps2()} style={{ display: 'none' }} />
                                                                    {selectedImage2 ? (
                                                                        <>

                                                                            <img src={selectedImage2} alt="Selected" width="100%" height="100px" />
                                                                            <div className={`${css.serviceBtn} commonBtn text-ff1 navbar-right d-flex justify-content-center align-items-center`}
                                                                                onClick={clearImage2}
                                                                                disabled={loading}>
                                                                                <FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff" }} />
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {isDragActive2 ? (
                                                                                <p>
                                                                                    <img src={upload_img} alt="upload" width="100%" height="300px" />
                                                                                    <b>Drop the files here.</b>
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
                                            <Row>
                                                <div style={{ marginTop: '10px' }}>

                                                    <Button
                                                        className={`${css.serviceBtn} commonBtn text-ff1 navbar-right`}
                                                        style={{ marginLeft: '10px', fontWeight: "600", backgroundColor: 'black' }}
                                                        onClick={handelApi}
                                                        disabled={loading}
                                                    >
                                                        {loading ? 'Uploading...' : 'Sign MOU'}
                                                    </Button>
                                                </div>
                                            </Row>
                                        </SecCard>
                                    </Col>
                                </Row>
                            </Modal.Body>
                        </>
                }

                <div><br /></div>
            </Modal>
        </>
    );
};

export default EmMouModal;

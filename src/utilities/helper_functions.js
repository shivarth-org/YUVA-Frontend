import { jsPDF } from "jspdf";
import { vars } from "./constants";

// My assets
import trophy_logo from "../assets/images/trophy_logo.jpg";
import sign from "../assets/images/all_signs.png";
import all_logo from "../assets/images/2_org_logo.png";

/////////////////////////////////////////////////////////////////////////////////////////////////

function youtubeParser(vdoSrc) {
    var regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = vdoSrc.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
}

function getVideoThumbnail(vdoSrc) {
    const vdoCode = youtubeParser(vdoSrc);
    const vdoThumbnail = `https://img.youtube.com/vi/${vdoCode}/hqdefault.jpg`;

    return vdoThumbnail;
}

function refreshScreen() {
    window.location.reload();
}

function roundOffDecimalPlaces(num, places) {
    let power = Math.pow(10, places);

    return Math.round(num * power) / power;
}

function downloadCertificateOld() {
    const opt = {
        //   orientation: "landscape",
        unit: "px",
        format: [4, 2],
    };

    const certElement = document.querySelector("#cert");
    const certElementWidth = certElement.offsetWidth;
    const certElementHeight = certElement.offsetHeight;

    // const doc = new jsPDF("l", "px", [404.1, 504]); // h,w (for h<w use landscape)

    const doc = new jsPDF("l", "px", [certElementHeight + 2, certElementWidth]); // h,w (for h<w use landscape)

    doc.html(document.querySelector("#cert"), {
        callback: function (pdf) {
            pdf.save("my.pdf");
        },
    });
}

const downloadCertificate = (certInfo) => {
    // (certInfo);

    const doc = new jsPDF("l", "px", [350, 500]); // h,w (for h<w use landscape)

    var pageHeight =
        doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth =
        doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    let startYMargin = 100; // reference vertical margin

    doc
        // All Yuva logos
        .addImage(all_logo, "PNG", 0, 10, pageWidth, pageWidth / 8)

        // Title: Certificate of Completion
        .setFont("Helvetica", "normal", "normal")
        .setFontSize(30)
        .text("Certificate of Completion", pageWidth / 2, startYMargin, {
            align: "center",
        })

        // Holder name
        .setFont("Times", "italic", "bold")
        .setFontSize(40)
        .text(certInfo.holderName, pageWidth / 2, (startYMargin += 40), {
            align: "center",
        })

        // Achievement description
        .setFont("Helvetica", "normal", "normal")
        .setFontSize(13)
        .text(
            `has successfully completed a unit which is a part of the course ${certInfo.courseName}`,
            pageWidth / 2,
            (startYMargin += 25),
            {
                align: "center",
            }
        )

        // Achievement date
        .text(
            `on ${certInfo.passingDate}`,
            pageWidth / 2,
            (startYMargin += 15),
            {
                align: "center",
            }
        )

        // Trophy logo
        .addImage(trophy_logo, "JPG", 215, (startYMargin += 20), 70, 70)

        // All officials' signs
        .addImage(
            sign,
            "PNG",
            0,
            (startYMargin += 70),
            pageWidth,
            pageWidth / 8
        )

        // Download
        .save(certInfo.fileName);
};

const convertBytesToMegaBytes = (bytes) => {
    return bytes / 1000000;
};

const generateQuizInstructions = (quizLength) => {
    return [
        `Quiz will contain ${quizLength} questions.`,
        `The duration of quiz is ${quizLength * vars.quiz.TIME_PER_QUE_IN_MIN
        } min.`,
        "The questions are Multiple Choice Questions (MCQs).",
        "Each question has equal weightage.",
        `Only those participants will be given certificate who appear and submit the response within stipulated time and score aleast ${vars.quiz.CUT_OFF_IN_PERCENT}%.`,
        "If you are not able to pass the quiz you might watch the video again and retake the quiz.",
    ];
};

/////////////////////////////////////////// Registration Form Validation ///////////////////////////////////////////////////

// const isRegisEmailValid = (email) => {
//   if (email === "") {
//     return false;
//   }
//   return true;
// };

// const isRegisPassValid = (pass) => {
//   if (pass === "") {
//     return false;
//   }
//   return true;
// };

// const isRegisCnfrmPassValid = (pass, cnfrmPass) => {
//   if (cnfrmPass === "") {
//     return false;
//   } else if (cnfrmPass !== pass) {
//     return false;
//   }
//   return true;
// };

// const isRegisFNameValid = (fName) => {
//   if (fName === "") {
//     return false;
//   }
//   return true;
// };

// const isRegisMNameValid = (mName) => {
//   if (mName === "") {
//     return false;
//   }
//   return true;
// };

// const isRegisLNameValid = (lName) => {
//   if (lName === "") {
//     return false;
//   }
//   return true;
// };

// const isRegisCollegeNameValid = (collegeName) => {
//   if (collegeName === "") {
//     return false;
//   }
//   return true;
// };
// const isRegisRegionValid = (region) => {
//   if (region === "") {
//     return false;
//   }
//   return true;
// };

// const isRegisBranchValid = (branch) => {
//   if (branch === "") {
//     return false;
//   }
//   return true;
// };

// const isRegisPhoneValid = (phone) => {
//   if (phone === "") {
//     return false;
//   }
//   return true;
// };

// const isRegisAddLine1Valid = (addLine1) => {
//   if (addLine1 === "") {
//     return false;
//   }
//   return true;
// };

// const isRegisAddLine2Valid = (addLine2) => {
//   if (addLine2 === "") {
//     return false;
//   }
//   return true;
// };

// const isRegisCityValid = (city) => {
//   if (city === "") {
//     return false;
//   }
//   return true;
// };

// const isRegisPincodeValid = (pincode) => {
//   if (pincode === "") {
//     return false;
//   }
//   return true;
// };
// const isRegisCountryValid = (country) => {
//   if (country === "") {
//     return false;
//   }
//   return true;
// };

// const isRegisFieldValid = (regisDetails, fieldName, fieldValue) => {
//   switch (fieldName) {
//     case "email":
//       return isRegisEmailValid(fieldValue);
//     case "pass":
//       return isRegisPassValid(fieldValue);
//     case "cnfrmPass":
//       return isRegisCnfrmPassValid(regisDetails["pass"], fieldValue);
//     case "fName":
//       return isRegisFNameValid(fieldValue);
//     case "mName":
//       return isRegisMNameValid(fieldValue);
//     case "lName":
//       return isRegisLNameValid(fieldValue);
//     case "collegeName":
//       return isRegisCollegeNameValid(fieldValue);
//     case "region":
//       return isRegisRegionValid(fieldValue);
//     case "branch":
//       return isRegisBranchValid(fieldValue);
//     case "phone":
//       return isRegisPhoneValid(fieldValue);
//     case "addLine1":
//       return isRegisAddLine1Valid(fieldValue);
//     case "addLine2":
//       return isRegisAddLine2Valid(fieldValue);
//     case "city":
//       return isRegisCityValid(fieldValue);
//     case "pincode":
//       return isRegisPincodeValid(fieldValue);
//     case "country":
//       return isRegisCountryValid(fieldValue);
//     default:
//       return false;
//   }
// };

// const validateRegisForm = (regisDetails) => {
//   return { isValid: true, desc: "All good" };
// };

//////////////////////////////////////////////////////////////////////////////////////////

const isEmailSyntaxValid = (email) => {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const isPhoneSyntaxValid = (phone) => {
    var phoneNum = phone.replace(/[^\d]/g, "");

    if (
        !/^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(
            phone
        )
    ) {
        return false;
    }

    if (phoneNum.length > 6 && phoneNum.length < 11) {
        return true;
    }

    return false;
};

const isPasswordPolicyFollowed = (password) => {
    let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,30}$/;
    if (!regex.test(password)) {
        return false;
    }

    return true;
};

// ! Note: lets say there's a string name = "", then !name is true if name is an empty string
const isRegisFormValid = (regisForm) => {
    // uncomment the object below to ignore client validation and test server validation
    // return {
    //   isValid: true,
    //   desc: "testing server validation",
    // };

    // User Id
    // const userId = regisForm.userId;
    // if (!(userId && userId.length > 0)) {
    //     return {
    //         isValid: false,
    //         desc: "UserId is not valid",
    //     };
    // }

    // // Password
    // const password = regisForm.password;
    // if (
    //     !(password && password.length > 0 && isPasswordPolicyFollowed(password))
    // ) {
    //     return {
    //         isValid: false,
    //         desc: "Password is not valid",
    //     };
    // }

    // // Confirm password
    // const cnfrmPassword = regisForm.cnfrmPassword;
    // if (!(cnfrmPassword && cnfrmPassword === password)) {
    //     return {
    //         isValid: false,
    //         desc: "Confirm Password is not valid",
    //     };
    // }

    // Email
    const email = regisForm.email;
    if (!(email && email.length > 0 && isEmailSyntaxValid(email))) {
        return {
            isValid: false,
            desc: "Email is not valid",
        };
    }

    // First name
    const fName = regisForm.fName;
    if (!(fName && fName.length > 0)) {
        return {
            isValid: false,
            desc: "First name is not valid",
        };
    }

    // Middle name
    const mName = regisForm.mName;
    if (mName === null || mName === undefined) {
        return {
            isValid: false,
            desc: "Middle name is not valid",
        };
    }

    // Last name
    const lName = regisForm.lName;
    if (!(lName && lName.length > 0)) {
        return {
            isValid: false,
            desc: "Last name is not valid",
        };
    }

    // College name
    //   const collegeName = regisForm.collegeName;
    //   if (!(collegeName && collegeName.length > 0)) {
    //     return {
    //       isValid: false,
    //       desc: "College name is not valid",
    //     };
    //   }

    // Region
    //   const region = regisForm.region;
    //   if (!(region && region.length > 0)) {
    //     return {
    //       isValid: false,
    //       desc: "Region is not valid",
    //     };
    //   }

    // Branch
    //   const branch = regisForm.branch;
    //   if (!(branch && branch.length > 0)) {
    //     return {
    //       isValid: false,
    //       desc: "Branch name is not valid",
    //     };
    //   }

    // Phone
    const phone = regisForm.phone;
    if (!(phone && isPhoneSyntaxValid(phone))) {
        return {
            isValid: false,
            desc: "Phone number is not valid",
        };
    }

    // Add Line 1
    //   const addLine1 = regisForm.addLine1;
    //   if (!(addLine1 && addLine1.length > 0)) {
    //     return {
    //       isValid: false,
    //       desc: "Address Line 1 is not valid",
    //     };
    //   }

    // Add Line 2
    //   const addLine2 = regisForm.addLine2;
    //   if (!(addLine2 && addLine2.length > 0)) {
    //     return {
    //       isValid: false,
    //       desc: "Address Line 2 is not valid",
    //     };
    //   }

    // City
    //   const city = regisForm.city;
    //   if (!(city && city.length > 0)) {
    //     return {
    //       isValid: false,
    //       desc: "City name is not valid",
    //     };
    //   }

    // Pincode
    //   const pincode = regisForm.pincode;
    //   if (!(pincode && pincode.length > 0)) {
    //     return {
    //       isValid: false,
    //       desc: "Pincode is not valid",
    //     };
    //   }

    // Country
    //   const country = regisForm.country;
    //   if (!(country && country.length > 0)) {
    //     return {
    //       isValid: false,
    //       desc: "Country name is not valid",
    //     };
    //   }

    return {
        isValid: true,
        desc: "All fields are valid",
    };
};

// function encryptData(data) {
//     const cipher = createCipher('aes-256-cbc', "1234567890");
//     let encrypted = cipher.update(data, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     return encrypted;
// }

// // Function to decrypt data
// function decryptData(encryptedData) {
//     const decipher = createDecipher('aes-256-cbc', "1234567890");
//     let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }
function capitalizeFirstLetter(str) {
    return str?.charAt(0).toUpperCase() + str?.substr(1);
}

export {
    youtubeParser,
    refreshScreen,
    getVideoThumbnail,
    roundOffDecimalPlaces,
    downloadCertificate,
    convertBytesToMegaBytes,
    isRegisFormValid,
    generateQuizInstructions,
    capitalizeFirstLetter
    // encryptData,
    // decryptData
};

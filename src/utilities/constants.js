// const SERVER_ORIGIN = "http://localhost:8080";
// const SERVER_ORIGIN = "https://yuva-portal-server-1.onrender.com";
// const SERVER_ORIGIN = process.env.REACT_APP_API_URL;
// const SERVER_ORIGIN = "https://api.yuvaportal.online";
const SERVER_ORIGIN = "https://api.yuvaportal.youngindians.net";
// const SERVER_ORIGIN = "http://yuva.evalue8.info";

const vars = {
  quizInstructions: [
    "Quiz will contain 10 questions.",
    "The duration of quiz is 5 min.",
    "The type of questions are Multiple Choice Questions(MCQs).",
    "Each question carries equal marks.",
    "There is only 1 possible answer on every question. ",
    "Only those participants will be given certificates who appear and submit the response within stipulated time with the score of above 65%.",
    "If you are not able to pass the quiz watch the content again and retake the quiz.",
  ],

  quiz: {
    TIME_PER_QUE_IN_MIN: 2,
    CUT_OFF_IN_PERCENT: 60,
  },
  video: {
    MIN_WATCH_TIME_IN_PERCENT: 40,
  },

  IMAGE_SIZE_LIMIT_IN_BYTES: 3 * 1000 * 1000, // 1MB = 10^3KB = 10^6 Bytes
  IMAGE_MIME_TYPES_WHITE_LIST: ["image/jpeg", "image/png"],
};

const validation = {
  authForm: {
    fName: { minLen: 2, maxLen: 60 },
    mName: { minLen: 0, maxLen: 60 },
    lName: { minLen: 2, maxLen: 60 },
    userId: { minLen: 5, maxLen: 45 },
    password: {
      minLen: 8,
      maxLen: 24,
      policy:
        "Password should contain atleast one special character and atleast one number",
    },
    cnfrmPassword: { minLen: 6, maxLen: 30 },
    collegeName: { minLen: 1, maxLen: 120 },
    region: { minLen: 1, maxLen: 60 },
    branch: { minLen: 2, maxLen: 60 },
    phone: { minLen: 10, maxLen: 10 },
    addLine1: { minLen: 1, maxLen: 120 },
    addLine2: { minLen: 1, maxLen: 120 },
    city: { minLen: 1, maxLen: 60 },
    pincode: { minLen: 1, maxLen: 10 },
    country: { minLen: 1, maxLen: 60 },
  },
  verticalModal: {
    name: { minLen: 1, maxLen: 100 },
    desc: { minLen: 1, maxLen: 5000 },
  },
  unit: {
    video: {
      title: { minLen: 1, maxLen: 120 },
      desc: { minLen: 1, maxLen: 500 },
    },
    text: {
      minLen: 1,
      maxLen: 5000,
    },
  },
};

export { SERVER_ORIGIN, vars, validation };

/*
Reference:
Mime types: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types

*/

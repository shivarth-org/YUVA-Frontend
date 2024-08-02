import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// My components
import UserNavbar from "./components/user/Navbar";
import AdminNavbar from "./components/admin/Navbar";
// import Footer from "./components/common/Footer";

// User Pages
import UserHome from "./routes/user/HomePage";
import UserLogin from "./routes/user/LoginPage";
import UserVerticals from "./routes/user/VerticalsPage";
import UserCourses from "./routes/user/CoursesPage";
import UserUnits from "./routes/user/UnitsPage";
import UserSingleUnit from "./routes/user/SingleUnitPage";
import UserResetPass from "./routes/user/ResetPassPage";
import UserRegis from "./routes/user/RegisPage";
import UserQuiz from "./routes/user/QuizPage";
import CertPage from "./routes/user/CertPage";
import UserDashBoard from "./routes/user/Dashboard";
import UserProfile from "./components/user/UserProfile";
import PrivacyPolicy from "./routes/user/PrivacyPolicy";
import SetPassword from "./routes/user/SetPassword.jsx";
import VerifyEmail from "./routes/user/VerifyEmail.jsx";

// Admin Pages
import AdminLogin from "./routes/admin/LoginPage";
import AdminServices from "./routes/admin/ServicesPage";
import AdminVerticals from "./routes/admin/VerticalsPage";
import AdminCourses from "./routes/admin/CoursesPage.jsx";
import AdminUnits from "./routes/admin/UnitsPage";
import AdminAddUnit from "./routes/admin/AddUnitPage";
import AdminUsers from "./routes/admin/AdminUsers.jsx";

//instititute pages
import AddInstitute from "./routes/institute/AddInstitute.jsx";
import AllInstitute from "./routes/institute/AllInstitute.jsx";
import InstituteServicePage from "./routes/institute/ServicePage.jsx";
import InstituteStudents from "./routes/institute/InstituteStudents.jsx";
import InstituteProfile from "./routes/institute/InstituteProfile.jsx";
import InstituteAllStudents from "./routes/institute/InstituteAllStudents.jsx";
import AllMouList from "./routes/institute/AllMouList.jsx";

//chapterEM pages
import AddChapterEM from "./routes/chapterEM/AddChapterEM.jsx";
import EMservicePage from "./routes/chapterEM/ServicePage.jsx";
import AllChapterEM from "./routes/chapterEM/AllChapterEM.jsx";
import ChapterEMAllInstitutes from "./routes/chapterEM/AllInstitutes.jsx";
import EmProfile from "./routes/chapterEM/EmProfile.jsx";
import EmInstitute from "./components/admin/EmInstitute.jsx";

//chapter
import AllChapter from "./routes/chapter/AllChapter.jsx";
import AddChapter from "./routes/chapter/AddChapter.jsx";
import RegionAll from "./routes/admin/RegionAll.jsx";

// Common Pages
import NotFound from "./routes/common/NotFound";
import UserAboutPage from "./routes/user/AboutPage";
import Footer from "./routes/user/Footer";
import AllUserLoginPage from "./routes/common/AllUserLoginPage.jsx";
import AllUserVerifyEmail from "./routes/common/AllUserVerifyEmail.jsx";
import AllUserSetPwd from "./routes/common/AllUserSetPwd.jsx";
import SingleProfilePage from "./routes/common/SingleProfilePage.jsx"
// import NewLoginPage from "./routes/common/NewLoginPage.jsx"

import "./App.css";
import ScrollToTop from "./components/user/ScrollToTop";
import AdminUserPage from "./routes/admin/AdminUserPage.jsx";
import { UserTypeProvider } from './routes/common/UserTypeContext.jsx';

function App() {
    return (
        <UserTypeProvider>
            <Router>
                <ScrollToTop />
                <div className="app-outer-div">
                    <Routes>
                        <Route
                            exact
                            path="/login"
                            element={
                                <>
                                    <UserNavbar />
                                    <AllUserLoginPage />
                                </>
                            }
                        />
                        <Route path="/em-profile/:_id" element={<> <AdminNavbar /><EmProfile /></>} />
                        <Route path="/institute-profile/:_id" element={<> <UserNavbar /><InstituteProfile /></>} />
                        <Route path="/institute-students/:_id" element={<> <UserNavbar /><InstituteAllStudents /></>} />
                        <Route path="/admin/institute-profile/:_id" element={<> <AdminNavbar /><InstituteProfile /></>} />
                        <Route path="/admin/institute-students/:_id" element={<> <AdminNavbar /><InstituteAllStudents /></>} />
                        <Route path="/em-institutes/:_id" element={<> <AdminNavbar /><EmInstitute /></>} />
                        {/* <Route
                            exact
                            path="/new-login"


                            element={
                                <>
                                    <UserNavbar />
                                    <NewLoginPage />
                                </>
                            }
                        /> */}
                        {/* <Route
                        exact
                        path="/user/login"
                        element={
                            <>
                                <UserNavbar />
                                <UserLogin />
                            </>
                        }
                    /> */}
                        <Route
                            path="/institute/students/all"
                            element={
                                <>
                                    <UserNavbar />
                                    <InstituteStudents />
                                </>
                            }
                        />
                        <Route
                            path="/admin/institute/mou/all/:_id"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AllMouList />
                                </>
                            }
                        />
                        <Route
                            path="/institute/mou/all/:_id"
                            element={
                                <>
                                    <UserNavbar />
                                    <AllMouList />
                                </>
                            }
                        />
                        <Route
                            path="/region/all"
                            element={
                                <>
                                    <AdminNavbar />
                                    <RegionAll />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/institute/services"
                            element={
                                <>
                                    <UserNavbar />
                                    <InstituteServicePage />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/em/institute/all"
                            element={
                                <>
                                    <AdminNavbar />
                                    <ChapterEMAllInstitutes />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/em/all"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AllChapterEM />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/chapter/all"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AllChapter />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/em/services"
                            element={
                                <>
                                    <AdminNavbar />
                                    <EMservicePage />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/verify-email"
                            element={
                                <>
                                    <UserNavbar />
                                    <AllUserVerifyEmail />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/set-password"
                            element={
                                <>
                                    <UserNavbar />
                                    <AllUserSetPwd />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/profile"
                            element={
                                <>
                                    <UserNavbar />
                                    <SingleProfilePage />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/institutes/insert"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AddInstitute />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/institutes/all"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AllInstitute />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/user/set-password"
                            element={
                                <>
                                    <UserNavbar />
                                    <SetPassword />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/user/verify-email"
                            element={
                                <>
                                    <UserNavbar />
                                    <VerifyEmail />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/ems/insert"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AddChapterEM />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/admin/chapter/insert"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AddChapter />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/ems/all"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AddChapterEM />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserHome />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/about"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserAboutPage />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/admin/about"
                            element={
                                <>
                                    <AdminNavbar />
                                    <UserAboutPage />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/em/about"
                            element={
                                <>
                                    <AdminNavbar />
                                    <UserAboutPage />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/institute/about"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserAboutPage />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/student/about"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserAboutPage />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/privacy-policy"
                            element={
                                <>
                                    <UserNavbar />
                                    <PrivacyPolicy />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/privacyPolicy"
                            element={
                                <>
                                    <AdminNavbar />
                                    <PrivacyPolicy />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/user/profile"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserProfile />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/user/verticals/all"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserVerticals />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/user/verticals/:verticalId/courses/all"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserCourses />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/user/verticals/:verticalId/courses/:courseId/units/all"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserUnits />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/user/verticals/:verticalId/courses/:courseId/units/:unitId"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserSingleUnit />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/user/verticals/:verticalId/courses/:courseId/units/:unitId/quiz"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserQuiz />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/user/reset-password"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserResetPass />
                                </>
                            }
                        />

                        <Route
                            exact
                            path="/user/register/:_id"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserRegis />
                                </>
                            }
                        />

                        <Route
                            exact
                            path="/user/certificate/:certId"
                            element={
                                <>
                                    <UserNavbar />
                                    <CertPage />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/user/dashboard"
                            element={
                                <>
                                    <UserNavbar />
                                    <UserDashBoard />
                                </>
                            }
                        />
                        <Route
                            path="/admin/services"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AdminServices />
                                </>
                            }
                        />
                        <Route
                            path="/admin/courses"
                            element={
                                <>
                                    <AdminCourses />
                                    <AdminNavbar />
                                </>
                            }
                        />
                        <Route
                            path={"/admin/login"}
                            element={
                                <>
                                    <AdminNavbar />
                                    <AdminLogin />
                                </>
                            }
                        />
                        <Route
                            path="/admin/verticals/all"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AdminVerticals />
                                </>
                            }
                        />
                        <Route
                            path="/admin/users/all"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AdminUsers />
                                </>
                            }
                        />
                        <Route
                            path="/admin/users/:userId"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AdminUserPage />
                                </>
                            }
                        />
                        <Route
                            path="/admin/verticals/:verticalId/courses/all"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AdminCourses />
                                </>
                            }
                        />
                        <Route
                            path="/admin/verticals/:verticalId/courses/:courseId/units/all"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AdminUnits />
                                </>
                            }
                        />
                        <Route
                            path="/admin/verticals/:verticalId/courses/:courseId/units/add"
                            element={
                                <>
                                    <AdminNavbar />
                                    <AdminAddUnit />
                                </>
                            }
                        />
                        <Route
                            exact
                            path="/user/resource-not-found"
                            element={
                                <>
                                    <UserNavbar />
                                    <NotFound />
                                </>
                            }
                        />

                        <Route
                            exact
                            path="/admin/resource-not-found"
                            element={
                                <>
                                    <AdminNavbar />
                                    <NotFound />
                                </>
                            }
                        />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>

                <Footer />

                <Toaster
                    toastOptions={{
                        duration: 3000,
                        style: {
                            fontFamily: "var(--font-family-2)",
                            marginTop: "2rem",
                        },
                    }}
                />
            </Router>
        </UserTypeProvider>
    );
}

export default App;

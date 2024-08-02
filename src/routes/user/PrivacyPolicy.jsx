import React, { useEffect } from "react";
import "../../css/user/privacy-policy.css";

//IMPORTS FOR Language change Functionality

const PrivacyPolicy = () => {

  return (
    <div className="privacy-policy-container">
      <header className="privacy-policy-header">
        <h1>Privacy Policy for Yuva Portal</h1>
        <p>Yuva Portal is committed to protecting the privacy and personal information of our users. This Privacy Policy outlines the information we collect, how we use it, and your rights regarding your data. By using our website, you consent to the practices described in this policy.</p>
      </header>
      <section className="privacy-policy-section">
        <ol>
          <li>
            <strong>Information We Collect:</strong>
            <p>We collect various types of personal information, including but not limited to:</p>
            <ul>
              <li><strong>Unique User ID </strong> </li>
              <li><strong>Password</strong></li>
              <li><strong>Email Address</strong> </li>
              <li><strong>Name</strong> </li>
              <li><strong>College details</strong> </li>
              <li><strong>Address</strong></li>
              <li><strong>Phone number</strong></li>
            </ul>
          </li>
          <li>
            <strong>How We Collect Information:</strong>
            <>We collect information through registration forms when users create accounts on our website. This information helps us create your user account and provide you with personalized content and services.</>
          </li>
     
          <li>
            <strong>Sharing of Information:</strong>
            <>We do not share user data with third parties. Your information is kept confidential and used only for providing services on our platform.</>
          </li>
          <li>
            <strong>Cookies and Tracking:</strong>
            <>We use cookies for personalization purposes. Cookies help us enhance your experience by remembering your preferences and providing personalized content.</>
          </li>
          <li>
            <strong>Security:</strong>
            <>We take data security seriously. We protect user data using encryption and secure servers to ensure your information is safe and confidential.</>
          </li>
          <li>
            <strong>User Rights:</strong>
            <>Users have full control over their data stored in the portal. This includes the right to access, correct, or delete their personal information.</>
          </li>
        </ol>
      </section>
      <footer className="privacy-policy-footer">
        <p>
        This Privacy Policy was last updated on 25/09/2023.
        </p>
        <p>
        If you have any questions or concerns, please contact us at {" "}
          <a href="mailto:yuva.onlineportal@gmail.com">yuva.onlineportal@gmail.com</a>.
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;

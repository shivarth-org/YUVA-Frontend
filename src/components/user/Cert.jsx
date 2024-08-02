import React, { useState } from "react";
// import { Document, Page, Text, View, StyleSheet } from "@react-18-pdf/renderer";

/* 
Install @react-18-pdf/renderer instead of @react-pdf/rendered as it throws an error while npm install:
https://stackoverflow.com/questions/72152690/react-pdf-renderer-not-working-on-react-18
*/

// My css
import css from "../../css/user/cert.module.css";

// My assets

import trophy_logo from "../../assets/images/trophy_logo.jpg";
import sign from "../../assets/images/sign.png";
import orgLogo from "../../assets/images/2_org_logo.png";

const Cert = (props) => {
  const { certInfo } = props;
  const certificate = (
    <div style={{}} className={css.outerDiv}>
      <div className={css.innerDiv}>
        <img src={orgLogo}  draggable="false" className={css.orgLogo} alt="org-logo" />

        <h2 className={css.completionText}>Certificate of Completion</h2>
        <h2 className={css.holderName}>{certInfo.holderName}</h2>
        <p className={css.achieveText}>
          has successfully completed a unit which is a part of the course{" "}
          {certInfo.courseName} <br /> on {certInfo.passingDate}
        </p>

        <img className={css.trophyLogo}  draggable="false" src={trophy_logo} alt="trophy-logo" />

        <div className="row">
          <div className="col-lg-4 col-md-4 col-4">
            <img className={css.signImg}  draggable="false" src={sign} alt="sign-img" />
            <p className={css.desigText}>
              NATIONAL <br /> YUVA CHAIR
            </p>
            <p className={css.ciyiText}>CIYI</p>
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            <img className={css.signImg}  draggable="false" src={sign} alt="sign-img" />
            <p className={css.desigText}>
              NATIONAL <br /> YUVA CO-CHAIR
            </p>
            <p className={css.ciyiText}>CIYI</p>
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            <img className={css.signImg}  draggable="false" src={sign} alt="sign-img" />
            <p className={css.desigText}>
              CHAIR <br /> YUVA
            </p>
            <p className={css.ciyiText}>CIYI</p>
          </div>
        </div>
      </div>
    </div>
  );

  return <>{certificate}</>;
};

export default Cert;

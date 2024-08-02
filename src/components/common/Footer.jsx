import React from "react";
import "../../css/common/footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="footer container-fluid">
        {/* <p className="footer-heading">Important links</p> */}
        {/* 
        <Link to="/user/verticals/all" className="footer-tab">
          Verticals
        </Link> */}
        <p className="copyright-tab">YUVA © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}

export default Footer;

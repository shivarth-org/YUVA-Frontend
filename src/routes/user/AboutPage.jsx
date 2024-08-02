import React from "react";
import { Link } from "react-router-dom";
import "../../css/user/u-about-page.css";
import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";
import logo from "../../assets/images/yuva_logo.png";
import img from "../../assets/images/students.jpeg";

const AboutPage = () => {
  return (
    <div className="u-about-page-outer-div">
      <div className="u-about-page-landing-div">
        <div className="u-about-page-landing-div-left">
          <p className="u-page-page-landing-heading">About Us</p>
          {/* <p className="u-about-page-landing-subheading">
            Your signature is all it takes to save a life.
          </p> */}
          <p className="u-about-page-landing-slogan">'We Can, We Will'</p>
        </div>
        <div className="u-about-page-landing-div-right">
          {/* <p className="u-about-page-landing-slogan">'We Can, We Will'</p> */}
          <img
            src={img}
            alt=""
            className="u-about-page-landing-slogan-bg"
          />
        </div>
      </div>
      <div>
        <p className="u-about-page-landing-l-heading">The 3 Pillars of Yi</p>
        <p className="u-about-page-landing-desc">
          Yi’s mission to strengthen the future of India gives a stage and voice
          to the country’s next generation of changemakers. It aims to instill
          in young minds the power of leadership, enhance the youth
          entrepreneurial ecosystem and create youth-led changes to build the
          nation. The robust framework of Yi and its vision is built on three
          significant pillars:
        </p>
      </div>
      {/* 1 hero */}
      <div
        className="u-about-page-landing-hero"
        style={{ backgroundColor: "var(--yuva-dark-green)" }}
      >
        <div className="u-about-page-landing-hero-left">
          <p className="u-about-page-landing-hero-heading">Youth Leadership</p>
          <p className="u-about-page-landing-hero-subheading">
            The first pillar of Yi believes that leaders aren’t born; they are
            made. It calls upon the students of India to recognize the leader in
            them through various leadership skill development programs, personal
            development programs and nation-building activities.
          </p>
        </div>
        <div className="u-about-page-landing-hero-right">
          <img
            src="https://youngindians.net/wp-content/uploads/2023/03/Youth-Leadership.jpg"
            alt="about-1"
            className="u-about-page-hero-img img-1"
          />
        </div>
      </div>
      {/* 2 hero */}
      <div
        className="u-about-page-landing-hero"
        style={{ backgroundColor: "var(--yuva-dark-orange)" }}
      >
        <div className="u-about-page-hero-right">
          <img
            src="https://youngindians.net/wp-content/uploads/2023/03/Nation-Building.jpg"
            alt="about-1"
            className="u-about-page-hero-img img-2"
          />
        </div>
        <div className="u-about-page-landing-hero-left">
          <p className="u-about-page-landing-hero-heading">Nation Building</p>
          <p className="u-about-page-landing-hero-subheading">
            The youth carry the baton of building an India that is
            self-sufficient, informed and on the path to development. The second
            pillar of Yi aims to give wings to the transformative power of
            India’s youth through various verticals that delve into present-day
            issues.
          </p>
        </div>
      </div>
      {/* 3 hero */}
      <div
        className="u-about-page-landing-hero"
        style={{ backgroundColor: "var(--yuva-dark-blue)" }}
      >
        <div className="u-about-page-landing-hero-left">
          <p className="u-about-page-landing-hero-heading">
            Thought Leadership
          </p>
          <p className="u-about-page-landing-hero-subheading">
            The third pillar of Yi aims to nudge the innate leader in today’s
            youth to give rise to a better India of tomorrow. It informs,
            engages and empowers the youth of India through a contributive
            movement of constructive action, collaborative reasoning and
            collective voice.
          </p>
        </div>
        <div className="u-about-page-hero-right">
          <img
            src="https://youngindians.net/wp-content/uploads/2023/03/Thought-Leadership.jpg"
            alt="about-1"
            className="u-about-page-hero-img img-1"
          />
        </div>
      </div>

      {/* Contact Section */}
      <div className="u-about-page-landing-reach" id="contact">
        <p className="u-about-page-landing-l-heading">Reach Us</p>
        <p className="u-about-page-landing-hero-subheading">
If you have any questions, concerns, or need assistance, do not hesitate to contact us. You can reach out to our team at any time by emailing us at  <a href="mailto:yuva.onlineportal@gmail.com">yuva.onlineportal@gmail.com</a>. Your inquiries are important to us, and we are here to provide you with the support you need.</p>
        {/* <div className="u-about-page-landing-reach-form">
          <div className="u-about-page-landing-reach-input-row">
            <input type="text" placeholder="Email" />
            <input type="text" placeholder="First Name" />
          </div>
          <div className="u-about-page-landing-reach-input-row">
            <input type="text" placeholder="Last Name" />
            <input type="number" placeholder="Mobile Number" />
          </div>
          <textarea
            name="message"
            id=""
            cols="30"
            placeholder="Write a message"
            rows="10"
          ></textarea>
          <button className="u-about-page-landing-btn-1">Contact Us</button>
        </div> */}
      </div>

    </div>
  );
};

export default AboutPage;

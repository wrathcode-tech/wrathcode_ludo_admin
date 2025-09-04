import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {

  return (
    <>
      <footer>
        <div className="container">

          <div className="row">

            <div className="col-sm-5">
              <div className="footer_info">

                <div className="logo_div">
                  <img src="/images/logo2.svg" alt="logo" />
                </div>

                <p>At Brainstorm Solution we specialize in professional crypto wallet recovery services, ensuring you regain
                  access to your digital assets securely and confidentially.</p>

                <ul className="social_media">
                  <li><a href="#"><i className="fa-brands fa-facebook"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-twitter"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-linkedin"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-youtube"></i></a></li>
                </ul>

              </div>

            </div>


            <div className="col-sm-3">
              <div className="footer_section">

                <h3>Quick Links</h3>

                <ul className="menu">
                  <li><Link to="/about_us">About Us</Link></li>
                  <li><Link to="/wallet_recovery">Wallet Recovery</Link></li>
                  <li><Link to="/scam_tracing">Scam Tracing</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/faq">FAQ</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                </ul>

              </div>
            </div>


            <div className="col-sm-4">
              <div className="footer_section">

                <h3>Location us</h3>

                <address>
                  <div className="phone_icon"><img src="/images/phone.svg" alt="phone" /></div>
                  Toll Free Customer Care<br />
                  012 3456 7890
                </address>

                <address>
                  <div className="phone_icon"><img src="/images/Email.svg" alt="email" /></div>
                  Have questions or want support?<br />
                  Support@test.com

                </address>

              </div>
            </div>

          </div>


          <div className="copyright_s">
            <p>Copyright © 2025 brainstrom.  All Rights Reserved.</p>
          </div>


        </div>
      </footer>
    </>
  );
};


export default Footer;

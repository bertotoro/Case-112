import React, { useEffect, useRef, useState } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container, Row, Col, Card, CardBody } from "reactstrap";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import routes from "routes.js";

const Auth = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videoSources = [
    require("../assets/img/brand/HIVID.mp4"),
    require("../assets/img/brand/HIVID2.mp4"),
    require("../assets/img/brand/HIVID3.mp4"),
  ];

  useEffect(() => {
    document.body.classList.add("bg-default");
    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const handleVideoEnded = () => {
    // Move to the next video or loop back to the first
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
  };

  return (
    <>
      <div className="main-content" ref={mainContent}>
        <AuthNavbar />

        {/* Full-Screen Card with Video */}
        <div
          className="header d-flex align-items-center justify-content-center"
          style={{
            height: "100vh", // Full height
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Card
            className="shadow-lg"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay for text contrast
            }}
          >
            <CardBody className="d-flex align-items-center justify-content-center text-center text-white h-100">
              <Col lg="5" md="6">
                <h1 className="text-white">Welcome!</h1>
                <p className="text-lead text-light">
                  Use this website to view HIV awareness & Data Visualization
                </p>
              </Col>
            </CardBody>
          </Card>

          {/* Video Background */}
          <video
            key={currentVideoIndex} // Use currentVideoIndex as a key to force re-render
            autoPlay
            
            onEnded={handleVideoEnded} // Call this function when the video ends
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover", // Ensures the video covers the full screen
              zIndex: 0,
            }}
          >
            <source
              src={videoSources[currentVideoIndex]} // Use the current video index
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <AuthFooter />
    </>
  );
};

export default Auth;
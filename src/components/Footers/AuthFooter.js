

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";
const handleAboutUsClick = () => {
  // Open a new tab with the image URL
  window.open(require("../../assets/img/brand/Minimal.jpg"), "_blank");
};

const Login = () => {
  return (
    <>
      <footer className="py-5" >
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="6">
              <div className="copyright text-center text-xl-left text-muted">
                © {new Date().getFullYear()}{" "}
                <a
                  className="font-weight-bold ml-1"
                  href="https://www.who.int/health-topics/hiv-aids#tab=tab_1"
                  target="_blank"
                >
                  Hiv Visualization
                </a>
              </div>
            </Col>
            <Col xl="6">
              <Nav className="nav-footer justify-content-center justify-content-xl-end">
                
              <NavItem>
              <NavLink
                href="#"
                onClick={handleAboutUsClick} // Call the function on click
              >
                About Us
              </NavLink>
            </NavItem>
                
              </Nav>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Login;

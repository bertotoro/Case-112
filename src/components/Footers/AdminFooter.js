
// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const handleAboutUsClick = () => {
  // Open a new tab with the image URL
  window.open(require("../../assets/img/brand/Minimal.jpg"), "_blank");
};

const Footer = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-muted">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1"
              href="https://www.who.int/health-topics/hiv-aids#tab=tab_1"
              rel="noopener noreferrer"
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
    </footer>
  );
};

export default Footer;

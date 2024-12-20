
import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const handleAboutUsClick = () => {
  // Open a new tab with the image URL
  window.open(require("../../assets/img/brand/Minimal.jpg"), "_blank");
};

const AdminNavbar = () => {
  return (
    <>
      <Navbar  className="navbar-top navbar-horizontal navbar-dark"
        expand="md"
        style={{
          
          zIndex: 2, // Ensures navbar is above the video
          backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent black background
        }}>
        <Container className="px-4">
          <NavbarBrand  to="/admin/index" tag={Link}>
            <img
              alt="..."
              src={require("../../assets/img/brand/HIVpic.png")}
            />
          </NavbarBrand>
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <Link to="/">
                    <img
                      alt="..."
                      src={require("../../assets/img/brand/argon-react.png")}
                    />
                  </Link>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button className="navbar-toggler" id="navbar-collapse-main">
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink className="nav-link-icon" to="/admin/index" tag={Link}>
                  <i className="ni ni-planet" />
                  <span className="nav-link-inner--text">Dashboard</span>
                </NavLink>
              </NavItem>
              
            <NavItem>
              <NavLink
                href="#"
                onClick={handleAboutUsClick} // Call the function on click
              >
                <i className="ni ni-circle-08" />
                <span className="nav-link-inner--text">About Us</span>
              </NavLink>
              
            </NavItem>
              
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;

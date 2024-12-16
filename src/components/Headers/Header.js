

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import React from "react";
import CsvUploader from "../../core/CsvUploader";
import AddHivData from "../../AddHivData";

const Header = () => {
  return (
    <>
      <div className="header bg-gradient-default pb-8 pt-5 pt-md-5">
        <Container fluid>
          <div className="header-body">

            {/* Card stats */}
            <Row>
            <Col lg="12" xl="10" className="mt-4">
              <Card className="card-upload mb-4">
                <CardBody>
                    <CardTitle
                        tag="h3"
                        className="text-uppercase  mb-2"
                      >
                        CSV Data Upload
                    </CardTitle>
                  <CsvUploader /> {/* Include the CsvUploader component */}
                </CardBody>
              </Card>
            </Col>

            <Col lg="12" xl="10" className="mt-4">
              <Card className="card-upload mb-4">
                <CardBody>
                    <CardTitle
                        tag="h3"
                        className="text-uppercase  mb-2"
                      >
                        Add Hiv Data
                    </CardTitle>
                  <AddHivData /> 
                </CardBody>
              </Card>
            </Col>

           
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;

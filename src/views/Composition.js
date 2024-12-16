import React, { useState, useEffect, useMemo, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Card, CardHeader, CardBody, Container, Row, Col, Input, Button, FormGroup, CardTitle } from "reactstrap";
import { Pie } from "react-chartjs-2";
import { debounce } from 'lodash';

const HivDataList = () => {
  const [hivCases, setHivCases] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1990);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGraphs, setShowGraphs] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const hivCollection = collection(db, "hivCases");
      const hivSnapshot = await getDocs(hivCollection);
      const dataList = hivSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHivCases(dataList);
    };

    fetchData();
  }, []);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const pieChartData = useMemo(() => {
    const filteredData = hivCases.filter(item => item.year === selectedYear);
    const entityData = {};

    filteredData.forEach(item => {
      if (!entityData[item.entity]) {
        entityData[item.entity] = { incidence: 0, deaths: 0 };
      }
      entityData[item.entity].incidence += item.incidence;
      entityData[item.entity].deaths += item.deaths;
    });

    return Object.keys(entityData).map(entity => ({
      entity,
      incidence: entityData[entity].incidence,
      deaths: entityData[entity].deaths,
    }));
  }, [hivCases, selectedYear]);

  const filteredPieChartData = pieChartData.filter(data =>
    data.entity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <>
      <div className="header bg-default pb-8 pt-5 pt-md-5">
        <Container className="mt--7" fluid>
          <Row className="mt-5">

            {/* Purpose/Explanation Card */}
            <Col lg="6" xl="12" className="mb-4" style={{ marginTop: '100px' }}>
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="text-uppercase text-muted mb-0">PIE GRAPH Information</h5>
                      <p className="h2 font-weight-bold mb-0">
                      The pie chart breaks the data into proportions, showing the relative share of Deaths and Incidence in a given year or region.
                       It complements the word cloud by offering a quantitative comparison of the two metrics within the dataset.
                      </p>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i className="fas fa-cloud" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-default shadow" style={{ marginTop: "40px", marginBottom: "40px" }}>
                <CardHeader className="bg-transparent">
                  <h6 className="text-uppercase text-light ls-1 mb-1">HIV Cases Distribution for {selectedYear} Pie Graph</h6>
                  
                  {/* Row for Dropdown and Search Input */}
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <Input type="select" onChange={(e) => setSelectedYear(Number(e.target.value))} value={selectedYear} style={{ width: '100%' }}>
                          {[...Array(30).keys()].map(i => (
                            <option key={i} value={1990 + i}>{1990 + i}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          type="text"
                          placeholder="Search by entity"
                          onChange={(e) => debouncedSearch(e.target.value)}
                          value={searchTerm}
                          style={{ width: '100%' }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Button color="primary" onClick={clearSearch} style={{ marginTop: '10px', marginLeft: '10px' }}>
                    Clear Search
                  </Button>
                  <Button 
                    color="info" 
                    onClick={() => setShowGraphs(!showGraphs)} 
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                  >
                    {showGraphs ? "Hide Graphs" : "Show Graphs"}
                  </Button>
                </CardHeader>
                <CardBody>
                  <Row>
                    {showGraphs && filteredPieChartData.map((data, index) => (
                      <Col key={ index} md="6">
                        <Card className="bg-gradient-default shadow">
                          <CardHeader className="bg-transparent">
                            <h6 className="text-uppercase text-light ls-1 mb-1">{data.entity}</h6>
                          </CardHeader>
                          <CardBody>
                            <Pie
                              data={{
                                labels: ['Incidence', 'Deaths'],
                                datasets: [{
                                  data: [data.incidence, data.deaths],
                                  backgroundColor: ['#11cdef', '#f5365c'],
                                }],
                              }}
                              options={{
                                responsive: true,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                  },
                                  title: {
                                    display: true,
                                    text: `HIV Data for ${data.entity}`,
                                  },
                                },
                              }}
                            />
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>



          </Row>
        </Container>
      </div>
    </>
  );
};

export default HivDataList;
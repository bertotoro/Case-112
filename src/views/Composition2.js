import React, { useState, useEffect, useMemo, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Card, CardHeader, CardBody, Container, Row, Col, Input, FormGroup } from "reactstrap";
import WordCloud from 'react-d3-cloud';
import { debounce } from 'lodash';

const HivDataList = () => {
  const [hivCases, setHivCases] = useState([]);
  const [wordCloudMetric, setWordCloudMetric] = useState("deaths");
  const [selectedYear, setSelectedYear] = useState(1990); // Default to 1990

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

  // Debounce the metric change
  const debouncedSetWordCloudMetric = useCallback(
    debounce((value) => {
      setWordCloudMetric(value);
    }, 300),
    []
  );

  // Memoize word cloud data
  const wordCloudData = useMemo(() => {
    return hivCases
      .filter(data => selectedYear === "All" || data.year === selectedYear) // Filter by selected year or include all
      .map(data => ({
        text: data.entity,
        value: wordCloudMetric === "deaths" ? data.deaths : data.incidence,
      }));
  }, [hivCases, wordCloudMetric, selectedYear]);

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
                      <h5 className="text-uppercase text-muted mb-0">Word Cloud Information</h5>
                      <p className="h2 font-weight-bold mb-0">
                      Shifting focus to a high-level overview, the word cloud highlights countries based on their contribution to Deaths or Incidence. 
                      Larger font sizes for countries with higher values provide an engaging way to quickly identify key players in the dataset.
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
              <Card className="bg-gradient-default shadow" style={{ marginTop: '20px' }}>
                <CardHeader className="bg-transparent">
                  <h6 className="text-uppercase text-light ls-1 mb-1">Word Cloud of Countries</h6>
                  
                  {/* Row for Year and Metric Selection */}
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          type="select"
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedYear(value === "All" ? value : Number(value)); // Convert to number if not "All"
                          }}
                          value={selectedYear}
                          style={{ width: '100%' }}
                        >
                          <option value="All">All (1990 - 2019)</option>
                          {/* Assuming years range from 1990 to 2019 */}
                          {[...Array(30).keys()].map(i => (
                            <option key={i} value={1990 + i}>{1990 + i}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          type="select"
                          onChange={(e) => debouncedSetWordCloudMetric(e.target.value)}
                          value={wordCloudMetric}
                          style={{ width: '100%' }}
                        >
                          <option value="deaths">Deaths</option>
                          < option value="incidence">Incidence</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <WordCloud
                    data={wordCloudData}
                    fontSize={(word) => Math.log2(word.value) * 10}
                    rotate={0}
                    padding={1}
                  />
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
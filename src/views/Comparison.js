import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  CardTitle,
} from "reactstrap";
import { Line, Bar } from "react-chartjs-2";

const HivDataList = () => {
  const [hivCases, setHivCases] = useState([]);

  // Fetch data from Firestore
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

  // Prepare data for the chart
  const getChartData = () => {
    const groupedData = {};
    hivCases.forEach(data => {
      if (!groupedData[data.year]) {
        groupedData[data.year] = { incidence: 0, deaths: 0 };
      }
      groupedData[data.year].incidence += data.incidence;
      groupedData[data.year].deaths += data.deaths;
    });

    const labels = Object.keys(groupedData);
    const incidenceData = labels.map(year => groupedData[year].incidence);
    const deathsData = labels.map(year => groupedData[year].deaths);

    return {
      labels,
      datasets: [
        {
          label: 'Incidence',
          data: incidenceData,
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
        },
        {
          label: 'Deaths',
          data: deathsData,
          fill: false,
          backgroundColor: 'rgba(255, 99, 132, 0.4)',
          borderColor: 'rgba(255, 99, 132, 1)',
        }
      ],
    };
  };

  const chartData = getChartData();

  const prepareBarChartData = () => {
    const dataMap = {};
    hivCases.forEach((data) => {
      if (!dataMap[data.year]) {
        dataMap[data.year] = { incidence: 0, deaths: 0 };
      }
      dataMap[data.year].incidence += data.incidence;
      dataMap[data.year].deaths += data.deaths;
    });

    const sortedLabels = Object.keys(dataMap).sort((a, b) => a - b);
    const incidenceData = sortedLabels.map((year) => dataMap[year].incidence);
    const deathsData = sortedLabels.map((year) => dataMap[year].deaths);

    return {
      labels: sortedLabels,
      datasets: [
        {
          label: "Incidence",
          data: incidenceData,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deathsData,
          backgroundColor: "rgba(255, 99, 132, 0.4)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const BarData = prepareBarChartData();

  return (
    <>
      <div className="header bg-default pb-8 pt-5 pt-md-5">
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            {/* Line Graph */}
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-default shadow" style={{ marginTop: '100px', marginBottom: "40px" }}>
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">HIV Cases Statistics</h6>
                      <h2 className="text-white mb-0">Line Graph</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart" style={{ height: "400px" }}>
 <Line
                      data={chartData}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                          legend: {
                            display: true,
                            position: "top",
                          },
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Year',
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Count',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardBody>
              </Card>


              <Col lg="6" xl="12">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Information
                        </CardTitle>
                        <p className="h2 font-weight-bold mb-0">
                          The line graph provides a temporal perspective, showing how Deaths and Incidence evolve over time. 
                          It highlights year-by-year trends, making it ideal for understanding long-term patterns and fluctuations. 
                          This sets the stage for deeper analysis of relationships or distributions.
                        </p>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-chart-line" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Col>

            {/* Bar Graph */}
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-default shadow" style={{ marginTop: "40px",marginBottom: "40px" }}>
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">HIV Cases Statistics</h6>
                      <h2 className="text-white mb-0">Bar Graph</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart" style={{ height: "400px" }}>
                    <Bar
                      data={BarData}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                          legend: {
                            display: true,
                            position: "top",
                          },
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Year',
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Count',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
              <Col lg="6" xl="12">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Information
                        </CardTitle>
                        <p className="h2 font-weight-bold mb-0">
                        Complementing the line graph, 
                        the grouped bar chart gives a direct year-by-year comparison of the two metrics. 
                        Where the line graph emphasizes trends, the bar chart focuses on proportional differences, 
                        helping to quickly pinpoint years with significant disparities or similarities.
                        </p>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default HivDataList;
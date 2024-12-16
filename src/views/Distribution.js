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
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

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

  // Prepare data for Density Plot
  const prepareDensityData = (data, variable, kernelWidth) => {
    const values = data.map(item => item[variable]);
    const densityData = calculateDensity(values, kernelWidth);
    return {
      labels: densityData.x,
      datasets: [{
        label: variable === 'incidence' ? 'Incidence Density' : 'Deaths Density',
        data: densityData.y,
        borderColor: variable === 'incidence' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
        backgroundColor: variable === 'incidence' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        fill: true,
      }],
    };
  };

  // Simple Kernel Density Estimation
  const calculateDensity = (data, kernelWidth) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const step = (max - min) / 100; // 100 points for the density curve
    const x = [];
    const y = [];

    for (let i = min; i <= max; i += step) {
      const density = data.reduce((acc, value) => {
        const kernel = Math.exp(-0.5 * Math.pow((i - value) / kernelWidth, 2));
        return acc + kernel;
      }, 0);
      x.push(i);
      y.push(density / (data.length * kernelWidth * Math.sqrt(2 * Math.PI))); // Normalize
    }

    return { x, y };
  };

  // Adjust the kernel width here
  const kernelWidth = 1; // Change this value to adjust the bandwidth

  const incidenceDensityData = prepareDensityData(hivCases, 'incidence', kernelWidth);
  const deathsDensityData = prepareDensityData(hivCases, 'deaths', kernelWidth);

  // Combine datasets for both incidence and deaths
  const combinedDensityData = {
    labels: incidenceDensityData.labels,
    datasets: [
      {
        label: 'Incidence Density',
        data: incidenceDensityData.datasets[0].data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Deaths Density',
        data: deathsDensityData.datasets[0].data,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  

  return (
    <>
      <div className="header bg-default pb-8 pt-5 pt-md-5">
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            {/* Combined Density Plot for Incidence and Deaths */}
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-default shadow" style={{ marginTop: "100px", marginBottom: " 40px" }}>
                <CardHeader className="bg-transparent">
                  <h6 className="text-uppercase text-light ls-1 mb-1">HIV Incidence and Deaths Density Plot</h6>
                </CardHeader>
                <CardBody>
                  <div style={{ height: '400px' }}>
                    <Line
                      data={combinedDensityData}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Values',
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Density',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            {/* Purpose/Explanation Card */}
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
                      To understand the distribution of values, the density plot smooths out the data, 
                      showing where Deaths or Incidence are most concentrated. It complements the scatter plot by providing context 
                      for where most data points lie and identifying any unusual peaks or gaps.
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


          </Row>
        </Container>
      </div>
    </>
  );
};

export default HivDataList;
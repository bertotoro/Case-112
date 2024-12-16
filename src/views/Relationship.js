import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  CardTitle,
} from "reactstrap";
import {  Scatter} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
} from "chart.js";
import Header from "components/Headers/Header.js";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
import { Link } from "react-router-dom";


// Register the necessary Chart.js components (scales, elements, etc.)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  RadialLinearScale
);



const HivDataList = () => {
  const [hivCases, setHivCases] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    entity: "",
    code: "",
    year: "",
    deaths: "",
    incidence: "",
  });
  const [previousForm, setPreviousForm] = useState(null);


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

  // Delete data
  const handleDelete = async (id) => {
    const hivDocRef = doc(db, "hivCases", id);
    try {
      await deleteDoc(hivDocRef);
      setHivCases(hivCases.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Edit data
  const handleEdit = (data) => {
    setEditingId(data.id);
    setPreviousForm({ ...data });
    setEditForm({
      entity: data.entity,
      code: data.code,
      year: data.year,
      deaths: data.deaths,
      incidence: data.incidence,
    });
  };

  // Update data
  const handleUpdate = async () => {
    const hivDocRef = doc(db, "hivCases", editingId);
    try {
      
      await updateDoc(hivDocRef, { ...editForm });
      setHivCases(hivCases.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      ));
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditForm(previousForm);
    setEditingId(null);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  




  // Prepare the data for the scatter plot
  const prepareScatterPlotData = () => {
    const scatterData = hivCases.map((data) => {
      return {
        x: data.deaths, // Deaths on the X-axis
        y: data.incidence, // Incidence on the Y-axis
        // Optionally, you can add a color based on the year
        backgroundColor: getColorByYear(data.year), // Function to get color based on year
      };
    });
  
    return {
      datasets: [
        {
          label: "HIV Cases",
          data: scatterData,
          backgroundColor: scatterData.map(data => data.backgroundColor), // Set background color for each point
          borderColor: "rgba(0, 0, 0, 0)", // Set border color for points
          borderWidth: 1,
          pointRadius: 5, // Set point radius for visibility
        },
      ],
    };
  };
  
  // Function to get color based on year
const getColorByYear = (year) => {
  switch (year) {
    case 1990:
      return "rgba(255, 99, 132, 0.6)"; // Red for 1990
    case 1991:
      return "rgba(255, 159, 64, 0.6)"; // Orange for 1991
    case 1992:
      return "rgba(255, 205, 86, 0.6)"; // Yellow for 1992
    case 1993:
      return "rgba(75, 192, 192, 0.6)"; // Teal for 1993
    case 1994:
      return "rgba(54, 162, 235, 0.6)"; // Blue for 1994
    case 1995:
      return "rgba(153, 102, 255, 0.6)"; // Purple for 1995
    case 1996:
      return "rgba(255, 99, 132, 0.6)"; // Red for 1996
    case 1997:
      return "rgba(255, 159, 64, 0.6)"; // Orange for 1997
    case 1998:
      return "rgba(255, 205, 86, 0.6)"; // Yellow for 1998
    case 1999:
      return "rgba(75, 192, 192, 0.6)"; // Teal for 1999
    case 2000:
      return "rgba(54, 162, 235, 0.6)"; // Blue for 2000
    case 2001:
      return "rgba(153, 102, 255, 0.6)"; // Purple for 2001
    case 2002:
      return "rgba(255, 99, 132, 0.6)"; // Red for 2002
    case 2003:
      return "rgba(255, 159, 64, 0.6)"; // Orange for 2003
    case 2004:
      return "rgba(255, 205, 86, 0.6)"; // Yellow for 2004
    case 2005:
      return "rgba(75, 192, 192, 0.6)"; // Teal for 2005
    case 2006:
      return "rgba(54, 162, 235, 0.6)"; // Blue for 2006
    case 2007:
      return "rgba(153, 102, 255, 0.6)"; // Purple for 2007
    case 2008:
      return "rgba(255, 99, 132, 0.6)"; // Red for 2008
    case 2009:
      return "rgba(255, 159, 64, 0.6)"; // Orange for 2009
    case 2010:
      return "rgba(255, 205, 86, 0.6)"; // Yellow for 2010
    case 2011:
      return "rgba(75, 192, 192, 0.6)"; // Teal for 2011
    case 2012:
      return "rgba(54, 162, 235, 0 .6)"; // Blue for 2012
    case 2013:
      return "rgba(153, 102, 255, 0.6)"; // Purple for 2013
    case 2014:
      return "rgba(255, 99, 132, 0.6)"; // Red for 2014
    case 2015:
      return "rgba(255, 159, 64, 0.6)"; // Orange for 2015
    case 2016:
      return "rgba(255, 205, 86, 0.6)"; // Yellow for 2016
    case 2017:
      return "rgba(75, 192, 192, 0.6)"; // Teal for 2017
    case 2018:
      return "rgba(54, 162, 235, 0.6)"; // Blue for 2018
    case 2019:
      return "rgba(153, 102, 255, 0.6)"; // Purple for 2019
    default:
      return "rgba(200, 200, 200, 0.6)"; // Default color for unspecified years
  }
};
  
  // Prepare data for Scatter Plot
  const scatterData = prepareScatterPlotData();





  return (
    <>
    <div className="header bg-default pb-8 pt-5 pt-md-5">
      
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row className="mt-5">

          {/* Scatter Plot */}
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-default shadow" style={{ marginTop: "100px", marginBottom: "40px" }}>
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">HIV Cases Statistics</h6>
                      <h2 className="text-white mb-0">Scatter Plot</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart" style={{ height: "400px" }}>
                    {/* Scatter plot wrapper */}
                    <Scatter
                      data={scatterData}
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
                              text: 'Deaths',
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Incidence',
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
                      Transitioning from trends to relationships, 
                      the scatter plot explores how Deaths and Incidence interact. 
                      By plotting the two variables against each other, 
                      it reveals potential correlations or anomalies that might not be evident in time-series graphs.
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

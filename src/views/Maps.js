import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import world from "../world.json";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Firebase imports
import { Card, CardBody, CardTitle, Container, Row, Button, CardHeader, Col } from "reactstrap"; // For layout (if needed)

const MapComponent = () => {
  const [geoData, setGeoData] = useState(null);
  const [metric, setMetric] = useState("incidence"); // Default to "incidence"

  // Fetch HIV data from Firestore
  const fetchHivCases = async () => {
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "hivCases"));
    
    const hivCases = [];
    snapshot.forEach((doc) => hivCases.push({ id: doc.id, ...doc.data() }));
    
    return hivCases;
  };

  // Enrich GeoJSON data with Firebase data
  useEffect(() => {
    const enrichGeoJSON = async () => {
      const hivCases = await fetchHivCases();

      const aggregatedHivCases = hivCases.reduce((acc, data) => {
        const countryName = data.entity; // Ensure region name is lowercase for comparison
        if (countryName) {
          if (!acc[countryName]) {
            acc[countryName] = { deaths: 0, incidence: 0 };
          }
          acc[countryName].incidence += data.incidence || 0;
          acc[countryName].deaths += data.deaths || 0;
        }
        return acc;
      }, {});

      const enrichedData = { ...world };
      enrichedData.features = enrichedData.features.map((feature) => {
        const countryName = feature.properties.ADMIN;
        const hivInfo = aggregatedHivCases[countryName];

        return {
          ...feature,
          properties: {
            ...feature.properties,
            incidence: hivInfo ? hivInfo.incidence : 0,
            deaths: hivInfo ? hivInfo.deaths : 0,
          },
        };
      });

      setGeoData(enrichedData);
    };

    enrichGeoJSON();
  }, []);

  // Get color based on selected metric
  const getColor = (value) => {
    return value > 200000
      ? "#2C003E"
      : value > 100000
      ? "#800026"
      : value > 50000
      ? "#FF0000"
      : value > 10000
      ? "#FFA500"
      : value > 5000
      ? "#FFFF00"
      : value > 1000
      ? "#00FF00"
      : value > 100
      ? "#00FFFF"
      : value > 10
      ? "#0000FF"
      : "#FFFFFF";
  };

  // Style based on the selected metric (incidence or deaths)
  const style = (feature) => {
    const value = feature.properties[metric]; // Get value based on selected metric
    return {
      fillColor: getColor(value),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  // Handler to switch between incidence and deaths
  const toggleMetric = () => {
    setMetric((prevMetric) => (prevMetric === "incidence" ? "deaths" : "incidence"));
  };

  return (
    <>
      <div className="header bg-gradient-default shadow pb-8 pt-5 pt-md-8">
        <div className="header-body"></div>
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow border-0" style={{ marginTop: "40px" }}>
                <CardHeader className="border-0">
                  <Row>
                    <Col>
                      <h2 className="mb-10">HIV Heatmap</h2>
                    </Col>
                    <Col className="text-right">
                      <Button
                        size='lg'
                        onClick={toggleMetric}
                        color="info"
                        style={{ marginBottom: "0 px" }}
                      >
                        Toggle Metric: {metric === "incidence" ? "Incidence" : "Deaths"}
 </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  style={{ height: "600px", width: "100%", borderRadius: "5px" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {geoData && <GeoJSON data={geoData} style={style} />}
                </MapContainer>
              </Card>
            </div>
          </Row>
          <Row>
            

            {/* Legend Card */}
            <Col className="mb-5 mb-xl-0" xl="3" style={{ marginTop: '20px' }}>
              <Card className="shadow mt-4" style={{ borderRadius: '7px' }}>
                <CardBody>
                  <CardTitle tag="h5" className="mb-3">HIV Cases Color Legend</CardTitle>
                  <div className="info legend" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i style={{ backgroundColor: '#2C003E', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                      200,000+ Cases
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i style={{ backgroundColor: '#800026', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                      100,000 - 199,999 Cases
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i style={{ backgroundColor: '#FF0000', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                      50,000 - 99,999 Cases
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i style={{ backgroundColor: '#FFA500', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                      10,000 - 49,999 Cases
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i style={{ backgroundColor: '#FFFF00', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                      5,000 - 9,999 Cases
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i style={{ backgroundColor: '#00FF00', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                      1,000 - 4,999 Cases
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i style={{ backgroundColor: '#00FFFF', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                      100 - 999 Cases
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i style={{ backgroundColor: '#0000FF', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                      10 - 99 Cases
                    </div>
                    <div style={{ display : 'flex', alignItems: 'center' }}>
                      <i style={{ backgroundColor: '#FFFFFF', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px', border: '1px solid black' }}></i>
                      0 - 9 Cases
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Purpose/Explanation Card */}
            <Col lg="6" xl="9" className="mb-4" style={{ marginTop: '45px' }}>
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="text-uppercase text-muted mb-0">Information</h5>
                      <p className="h2 font-weight-bold mb-0">
                      the heatmap combines temporal and spatial dimensions, showing how Deaths or Incidence vary across countries and years. 
                      The color intensity emphasizes variations, making it ideal for spotting regional or temporal peaks in the data.
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
          </Row>
        </Container>
      </div>
    </>
  );
};

export default MapComponent;
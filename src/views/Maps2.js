import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import world from "../world.json"; // Ensure this file contains valid GeoJSON data
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Firebase imports
import { Card, Container, Row, Col, CardBody } from "reactstrap"; // For layout
import { centroid } from "@turf/turf"; // For accurate marker placement

const MapComponent = () => {
  const [geoData, setGeoData] = useState(null);
  const [hivData, setHivData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      try {
        setLoading(true);
        const hivCases = await fetchHivCases();
        setHivData(hivCases); // Store raw data for bubble rendering

        const aggregatedHivCases = hivCases.reduce((acc, data) => {
          const countryName = data.entity; // Ensure region name matches GeoJSON
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    enrichGeoJSON();
  }, []);

  // Precompute GeoJSON feature lookup for efficient access
  const geoFeatureMap = useMemo(() => {
    return geoData?.features.reduce((map, feature) => {
      map[feature.properties.ADMIN] = feature;
      return map;
    }, {});
  }, [geoData]);

  // Bubble size calculation based on metric value
  const getBubbleSize = (value) => {
    return value > 200000
      ? 50
      : value > 100000
      ? 40
      : value > 50000
      ? 30
      : value > 10000
      ? 20
      : value > 5000
      ? 15
      : value > 1000
      ? 10
      : value > 100
      ? 5
      : 3;
  };

  return (
    <>
      <div className="header bg-gradient-default shadow pb-8 pt-5 pt-md-8">
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">

              {/* Incidence Map Card */}
              <Card className="shadow border-0" style={{ marginTop: "40px" }}>
                <h2>Incidence Map</h2>
                <MapContainer
                  center={[20, 0]} // Center on the world
                  zoom={2}
                  style={{ height: "400px", width: "100%", borderRadius: "5px" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {geoData && <GeoJSON data={geoData} />}
                  {hivData.map((country) => {
                    const countryName = country.entity;
                    const geoFeature = geoFeatureMap?.[countryName];
                    const value = country.incidence;

                    if (geoFeature && value > 0) {
                      const center = centroid(geoFeature).geometry.coordinates.reverse();
                      return (
                        <CircleMarker
                          key={countryName}
                          center={center}
                          radius={getBubbleSize(value)}
                          fillColor="#2dce89" // Green for incidence
                          color="#000"
                          weight={1}
                          fillOpacity={0.6}
                          aria-label={`${countryName} Incidence: ${value}`}
                        >
                          <Tooltip>
                            <strong>{countryName}</strong>
                            <br />
                            Incidence: {value}
                          </Tooltip>
                        </CircleMarker>
                      );
                    }
                    return null;
                  })}
                </MapContainer>
              </Card>
              

              {/* Deaths Map Card */}
              <Card className="shadow border-0" style={{ marginTop: "20px" }}>
                <h2>Deaths Map</h2>
                <MapContainer
                  center={[20, 0]} // Center on the world
                  zoom={2}
                  style={{ height: "400px", width: "100%", borderRadius: "5px" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {geoData && <GeoJSON data={geoData} />}
                  {hivData.map((country) => {
                    const countryName = country.entity;
                    const geoFeature = geoFeatureMap?.[countryName];
                    const value = country.deaths;

                    if (geoFeature && value > 0) {
                      const center = centroid(geoFeature).geometry.coordinates.reverse();
                      return (
                        <CircleMarker
                          key={countryName}
                          center={center}
                          radius={getBubbleSize(value)}
                          fillColor="#ff0000" // Red for deaths
                          color="#000"
                          weight={1}
                          fillOpacity={0.6}
                          aria-label={`${countryName} Deaths: ${value}`}
                        >
                          <Tooltip>
                            <strong>{countryName}</strong>
                            <br />
                            Deaths: {value}
                          </Tooltip>
                        </CircleMarker>
                      );
                    }
                    return null;
                  })}
                </MapContainer>
              </Card>
              
              {/* Purpose/Explanation Card */}
            <Col lg="6" xl="12" className="mb-4" style={{ marginTop: '40px' }}>
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="text-uppercase text-muted mb-0">Information</h5>
                      <p className="h2 font-weight-bold mb-0">
                      Incidence Bubble Map focuses on the geographical distribution of reported cases, 
                      with bubble sizes representing the magnitude of incidence rates across countries. 
                      This map helps identify regions with high case counts, providing a spatial context to temporal trends and distributions.
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

              {/* Purpose/Explanation Card */}
            <Col lg="6" xl="12" className="mb-4" style={{ marginTop: '40px' }}>
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="text-uppercase text-muted mb-0">Information</h5>
                      <p className="h2 font-weight-bold mb-0">
                      Deaths Bubble Map mirrors this design but emphasizes fatalities instead of cases. 
                      Comparing the two bubble maps side by side allows us to explore whether areas with high incidence rates also experience high death rates or if there are geographic disparities.
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
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default MapComponent;
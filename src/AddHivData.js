import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import {
  FormGroup,
  Form,
  Input,
  Button,
  Row,
  Col,
  Container,
} from "reactstrap";

const AddDengueData = () => {
  const [entity, setEntity] = useState("");
  const [code, setCode] = useState("");
  const [year, setYear] = useState("");
  const [deaths, setDeaths] = useState("");
  const [incidence, setIncidence] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "hivCases"), {
        entity,
        code,
        year: Number(year),
        deaths: Number(deaths),
        incidence: Number(incidence),
      });
      // Clear form fields
      setEntity("");
      setCode("");
      setYear("");
      setDeaths("");
      setIncidence("");
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

   return (
    <Container>
      <h3>Add Hiv Data</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                placeholder="Entity"
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                placeholder="Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="number"
                placeholder="Deaths"
                value={deaths}
                onChange={(e) => setDeaths(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="number"
                placeholder="Incidence"
                value={incidence}
                onChange={(e) => setIncidence(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="12">
            <Button color="primary" type="submit">
              Add Data
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AddDengueData;

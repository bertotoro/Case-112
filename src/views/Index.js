import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Container,
  Row,
  Col,
  Input,
} from "reactstrap"
import Header from "components/Headers/Header.js";;

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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered data based on search query
  const filteredData = hivCases.filter((data) =>
    data.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.year.toString().includes(searchQuery) ||
    data.deaths.toString().includes(searchQuery) ||
    data.incidence.toString().includes(searchQuery)
  );

  // Sorting logic
  const [sortConfig, setSortConfig] = useState({ key: 'year', direction: "ascending" });

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <div className="header bg-gradient-default">
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            <Col xl="11">
              <Card className="shadow" style={{ marginBottom: "40px" }}>
                <CardHeader className="border-0">
                  <h3 className="mb-0">HIV Data List</h3>
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ marginLeft: '80%',marginTop: '10px', width: "20%" }}
                  />
                </CardHeader>
                <CardBody>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col" onClick={() => requestSort('entity')}>
                          Entity
                          {sortConfig.key === 'entity' && (
                            <i className={`ni ${sortConfig.direction === 'ascending' ? 'ni-bold-up' : 'ni-bold-down'}`}></i>
                          )}
                        </th>
                        <th scope="col" onClick={() => requestSort('code')}>
                          Code
                          {sortConfig.key === 'code' && (
                            <i className={`ni ${sortConfig.direction === 'ascending' ? 'ni-bold-up' : 'ni-bold-down'}`}></i>
                          )}
                        </th>
                        <th scope="col" onClick={() => requestSort('year')}>
                          Year
                          {sortConfig.key === 'year' && (
                            <i className={`ni ${sortConfig.direction === 'ascending' ? 'ni-bold-up' : 'ni-bold-down'}`}></i>
                          )}
                        </th>
                        <th scope="col" onClick={() => requestSort('deaths')}>
                          Deaths
                          {sortConfig.key === 'deaths' && (
                            <i className={`ni ${sortConfig.direction === 'ascending' ? 'ni-bold-up' : 'ni-bold-down'}`}></i>
                          )}
                        </th>
                        <th scope="col" onClick={() => requestSort('incidence')}>
                          Incidence
                          {sortConfig.key === 'incidence' && (
                            <i className={`ni ${sortConfig.direction === 'ascending' ? 'ni-bold-up' : 'ni-bold-down'}`}></i>
                          )}
                        </th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                  </Table>

                  {/* Scrollable Body */}
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table className="align-items-center table-flush" responsive>
                      <tbody>
                        {sortedData.map((data, index) => (
                          <tr key={data.id}>
                            <td style={{ width: '9%' }}>{index + 1}</td>
                            <td style={{ width: '0%', padding: '0.375rem 0.75rem' }}>
                              {editingId === data.id ? (
                                <input
                                  type="text"
                                  name="entity"
                                  value={editForm.entity}
                                  onChange={handleChange}
                                  required
                                />
                              ) : (
                                <span onDoubleClick={() => handleEdit(data)}>{data.entity}</span>
                              )}
                            </td>
                            <td>
                              {editingId === data.id ? (
                                <input
                                  type="text"
                                  name="code"
                                  value={editForm.code}
                                  onChange={handleChange}
                                  required
                                />
                              ) : (
                                <span onDoubleClick={() => handleEdit(data)}>{data.code}</span>
                              )}
                            </td>
                            <td>
                              {editingId === data.id ? (
                                <input
                                  type="number"
                                  name="year"
                                  value={editForm.year}
                                  onChange={handleChange}
                                  required
                                />
                              ) : (
                                <span onDoubleClick={() => handleEdit(data)}>{data.year}</span>
                              )}
                            </td>
                            <td>
                              {editingId === data.id ? (
                                <input
                                  type="number"
                                  name="deaths"
                                  value={editForm.deaths}
                                  onChange={handleChange}
                                  required
                                />
                              ) : (
                                <span onDoubleClick={() => handleEdit(data)}>{data.deaths}</span>
                              )}
                            </td>
                            <td>
                              {editingId === data.id ? (
                                <input
                                  type="number"
                                  name="incidence"
                                  value={editForm.incidence}
                                  onChange={handleChange}
                                  required
                                />
                              ) : (
                                <span onDoubleClick={() => handleEdit(data)}>{data.incidence}</span>
                              )}
                            </td>
                            <td>
                              {editingId === data.id ? (
                                <>
                                  <Button color="success" onClick={handleUpdate} size="sm">Save</Button>
                                  <Button color="danger" onClick={handleCancel} size="sm">Cancel</Button>
                                </>
                              ) : (
                                <Button
                                  color="danger"
                                  href="#pablo"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(data.id);
                                  }}
                                  size="sm"
                                >
                                  Delete
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
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
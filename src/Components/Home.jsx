import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./Navbar";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
} from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { saveAs } from "file-saver";

const Home = () => {
  const styles = {
    tableContainer: {
      marginLeft: "550px",
      width: "500px",
      marginTop: "150px",
    },
    tableCell: {
      border: "1px solid #ddd",
    },
    fabContainer: {
      bottom: "40px",
    },
    circle: {
      position: "fixed",
      borderRadius: "50%",
      width: 56,
      height: 56,
      backgroundColor: "#1976d2",
      color: "white",
      marginLeft: "90%",
      marginTop: "10%",
    },
  };
  const [contractData, setContractData] = useState([]);

  const navigate = useNavigate();

  const handleAddIconClick = () => {
    navigate("/contract/addcontract");
  };
  const handleEditClick = (id) => {
    navigate(`/contract/edit/${id}`);
  };

  const handleDownloadClick = (id) => {
    axios
      .get(`http://127.0.0.1:8000/contract/${id}/report`, {
        responseType: "blob",
      })
      .then((response) => {
        console.log(response);
        const filename = `Contract_${id}.pdf`;
        saveAs(response.data, filename);
      });
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/contracts")
      .then((response) => {
        setContractData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <NavBar />
      <div style={styles.tableContainer}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={styles.tableCell}>Contract Name</TableCell>
                <TableCell style={styles.tableCell}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contractData.map((contract, index) => (
                <TableRow key={index}>
                  <TableCell style={styles.tableCell}>
                    Contract {contract.id}
                  </TableCell>
                  <TableCell style={styles.tableCell}>
                    <Button
                      color="primary"
                      onClick={() => handleEditClick(contract.id)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => handleDownloadClick(contract.id)}
                    >
                      <CloudDownloadIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Box style={styles.fab}>
        <Fab style={styles.circle} onClick={handleAddIconClick}>
          <AddIcon />
        </Fab>
      </Box>
    </>
  );
};

export default Home;

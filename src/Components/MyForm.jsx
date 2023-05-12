import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Box, Grid, FormHelperText } from "@mui/material";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@material-ui/icons/Add";
import NavBar from "./Navbar";
import { saveAs } from "file-saver";

const MyForm = () => {
  const boxWrapper = {
    padding: 20,
    marginTop: "5%",
    marginLeft: "400px",
    marginRight: "400px",
    height: "60vh",
  };
  const [initialValues, setInitialValues] = useState({
    firstPartyName: "",
    secondPartyName: "",
    startDate: "",
    endDate: "",
    packages: [
      {
        name: "",
        description: "",
        listFees: "",
        discountedFees: "",
      },
    ],
    countries: "",
    brands: "",
    orderVolume: "",
    returnVolume: "",
  });
  const [key, setKey] = useState(0);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/contract/${id}`)
      .then((response) => {
        const formData = response.data.formData;
        console.log(response.data);
        const packages = formData.packages.map((pack, id) => {
          return {
            name: pack.name,
            description: pack.description,
            listFees: pack.listFees,
            discountedFees: pack.discountedFees,
          };
        });
        setKey(key + 1);
        setInitialValues({
          firstPartyName: formData.firstPartyName,
          secondPartyName: formData.secondPartyName,
          startDate: formData.startDate,
          endDate: formData.endDate,
          packages: packages,
          countries: formData.countries,
          brands: formData.brands,
          orderVolume: formData.orderVolume,
          returnVolume: formData.returnVolume,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);
  const validationSchema = Yup.object({
    firstPartyName: Yup.string().required("Required"),
    secondPartyName: Yup.string().required("Required"),
    startDate: Yup.date().required("Required"),
    endDate: Yup.date().required("Required"),
    packages: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        listFees: Yup.number().required("Required"),
        discountedFees: Yup.number().required("Required"),
      })
    ),
    countries: Yup.string().required("Required"),
    brands: Yup.string().required("Required"),
    orderVolume: Yup.number().required("Required"),
    returnVolume: Yup.number().required("Required"),
  });
  const handleSubmit = async (values) => {
    if (id) {
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/contract/${id}`,
          values,
          { responseType: "blob" }
        );
        axios
          .get(`http://127.0.0.1:8000/contract/${id}/report`, {
            responseType: "blob",
          })
          .then((response) => {
            console.log(response);
            const filename = `Contract_${id}.pdf`;
            saveAs(response.data, filename);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/contract",
          values,
          { responseType: "blob" }
        );
        const contentDisposition = response.headers["content-disposition"];
        const fileNameRegex = /filename="(.+)"/;
        const matches = fileNameRegex.exec(contentDisposition);
        const fileName = matches ? matches[1] : `contract.pdf`;
        const fileBlob = await response.data;
        const fileUrl = URL.createObjectURL(fileBlob);
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(fileUrl);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Box style={{ width: "100%" }}>
        <NavBar />
        <Box style={boxWrapper}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            key={key}
          >
            {({ errors, touched }) => (
              <Form>
                <Grid
                  container
                  spacing={2}
                  style={{ marginTop: "4rem !important" }}
                >
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      type="text"
                      name="firstPartyName"
                      label="First Party Name"
                      required
                      fullWidth
                      helperText={
                        <ErrorMessage
                          name="firstPartyName"
                          component={FormHelperText}
                          error
                        />
                      }
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      type="text"
                      name="secondPartyName"
                      label="Second Party Name"
                      required
                      fullWidth
                      helperText={
                        <ErrorMessage
                          name="secondPartyName"
                          component={FormHelperText}
                          error
                        />
                      }
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      type="date"
                      name="startDate"
                      label="Start Date"
                      required
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      helperText={
                        <ErrorMessage
                          name="startDate"
                          component={FormHelperText}
                          error
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      type="date"
                      name="endDate"
                      label="End Date"
                      InputLabelProps={{ shrink: true }}
                      required
                      fullWidth
                      helperText={
                        <ErrorMessage
                          name="endDate"
                          component={FormHelperText}
                          error
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <h5>Packages:</h5>
                  </Grid>

                  <Grid item xs={12}>
                    <FieldArray name="packages">
                      {({ push, remove, form }) => (
                        <>
                          {form.values.packages.map((_, index) => (
                            <Grid
                              container
                              spacing={2}
                              key={index}
                              style={{ marginBottom: "16px" }}
                            >
                              <Grid item xs={3}>
                                <Field
                                  as={TextField}
                                  type="text"
                                  name={`packages.${index}.name`}
                                  label="Package Name"
                                  required
                                  fullWidth
                                  helperText={
                                    <ErrorMessage
                                      name={`packages.${index}.name`}
                                      component={FormHelperText}
                                      error
                                    />
                                  }
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <Field
                                  as={TextField}
                                  type="text"
                                  name={`packages.${index}.description`}
                                  label="Package Description"
                                  required
                                  multiline
                                  fullWidth
                                  helperText={
                                    <ErrorMessage
                                      name={`packages.${index}.description`}
                                      component={FormHelperText}
                                      error
                                    />
                                  }
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <Field
                                  as={TextField}
                                  type="number"
                                  name={`packages.${index}.listFees`}
                                  label="List Fees"
                                  required
                                  fullWidth
                                  helperText={
                                    <ErrorMessage
                                      name={`packages.${index}.listFees`}
                                      component={FormHelperText}
                                      error
                                    />
                                  }
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <Field
                                  as={TextField}
                                  type="number"
                                  name={`packages.${index}.discountedFees`}
                                  label="Discounted Fees"
                                  required
                                  fullWidth
                                  helperText={
                                    <ErrorMessage
                                      name={`packages.${index}.discountedFees`}
                                      component={FormHelperText}
                                      error
                                    />
                                  }
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <IconButton
                                  onClick={() =>
                                    push(initialValues.packages[0])
                                  }
                                >
                                  <AddIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => remove(index)}
                                  disabled={form.values.packages.length === 1}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))}
                        </>
                      )}
                    </FieldArray>
                  </Grid>

                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      type="text"
                      name="countries"
                      label="Countries"
                      required
                      fullWidth
                      helperText={
                        <ErrorMessage
                          name="countries"
                          component={FormHelperText}
                          error
                        />
                      }
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      type="text"
                      name="brands"
                      label="Brands"
                      required
                      fullWidth
                      helperText={
                        <ErrorMessage
                          name="brands"
                          component={FormHelperText}
                          error
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      type="number"
                      name="orderVolume"
                      label="Order Volume"
                      required
                      fullWidth
                      helperText={
                        <ErrorMessage
                          name="orderVolume"
                          component={FormHelperText}
                          error
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      type="number"
                      name="returnVolume"
                      label="Return Volume"
                      required
                      fullWidth
                      helperText={
                        <ErrorMessage
                          name="returnVolume"
                          component={FormHelperText}
                          error
                        />
                      }
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  style={{
                    margin: "20px 0 0px 910px",
                  }}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
};

export default MyForm;

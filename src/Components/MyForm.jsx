import React from "react";
import { Button, Box, Grid, FormHelperText } from "@mui/material";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@material-ui/icons/Add";
import NavBar from "./Navbar";

const MyForm = () => {
  const boxWrapper = {
    padding: 20,
    marginTop: "5%",

    display: "flex",
    justifyContent: "center",
    height: "80vh",
  };
  const initialValues = {
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
  };

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
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/contract/generate",
        values,
        { responseType: "blob" }
      );
      console.log(response);
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
  };

  return (
    <>
      <NavBar />
      <Box style={boxWrapper}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form
              style={{
                // backgroundColor: "gray",
                width: "700px",
              }}
            >
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
                    //inputProps={{ "data-testid": "startDateInput" }}
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
                          <Grid container spacing={2} key={index}>
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
                                onClick={() => push(initialValues.packages[0])}
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
                  margin: "20px 0 0px 610px",
                }}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default MyForm;

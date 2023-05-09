import React from "react";
import { Button, Box, Grid, FormHelperText } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import axios from "axios";

const MyForm = () => {
  const paperStyle = {
    padding: 20,
    height: "60vh",
    width: "320px",
    marginTop: "10%",
    marginLeft: "20px",
    border: "2px solid black",
  };
  const initialValues = {
    first_name: "",
    last_name: "",
    address: "",
    salary: "",
    age: "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    address: Yup.string().required("Address is required"),
    salary: Yup.string().required("Salary is required"),
    age: Yup.string().required("Age is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/pdf/generate",
        values,
        { responseType: "blob" }
      );
      const contentDisposition = response.headers["content-disposition"];
      const fileNameRegex = /filename="(.+)"/;
      const matches = fileNameRegex.exec(contentDisposition);
      const fileName = matches ? matches[1] : `${first_name} ${last_name}.pdf`;
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
    <Box style={paperStyle}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form style={{ marginLeft: "50px" }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  type="text"
                  name="first_name"
                  label="First Name"
                  required
                  fullwidth
                  helperText={
                    <ErrorMessage
                      name="first_name"
                      component={FormHelperText}
                      error
                    />
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  type="text"
                  name="last_name"
                  label="Last Name"
                  required
                  helperText={
                    <ErrorMessage
                      name="last_name"
                      component={FormHelperText}
                      error
                    />
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  type="text"
                  name="address"
                  label="Address"
                  required
                  multiline
                  helperText={
                    <ErrorMessage
                      name="address"
                      component={FormHelperText}
                      error
                    />
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  type="number"
                  name="salary"
                  label="Salary"
                  required
                  helperText={
                    <ErrorMessage
                      name="salary"
                      component={FormHelperText}
                      error
                    />
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  as={TextField}
                  type="number"
                  name="age"
                  label="Age"
                  required
                  helperText={
                    <ErrorMessage name="age" component={FormHelperText} error />
                  }
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              style={{
                margin: "20px 0 0 70px",
              }}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default MyForm;

import React, { useState, useRef } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Autocomplete,
  Select,
  MenuItem,
  Input,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm, Controller, useFieldArray } from "react-hook-form";

const top100Films = ["CGK", "DLH", "TYOA", "SIN", "HND"];
const objOptions = [
  { label: "Traveloka", file_name : "nusatrip_webscrapper/scraper_traveloka.py" },
  { label: "Tkyscanner", file_name : "nusatrip_webscrapper/scraper_skyscanner.py"},
  { label: "Booking", file_name : "nusatrip_webscrapper/scraper_booking.py" },
  { label: "Pegi Pegi", file_name : "nusatrip_webscrapper/scraper_pegi.py" },
];
const myHelper = {
  auto: {
    required: "Email is Required",
    pattern: "Invalid Email Address",
  },
};
const Form = () => {
  const { control, handleSubmit } = useForm({
    reValidateMode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formFields", // Nama field array, bisa disesuaikan dengan kebutuhan
  });

  // const [inputCount, setInputCount] = useState(0);
  // const [formData, setFormData] = useState({
  //   from1: "",
  //   to1: "",
  //   depart1: null,
  //   cabin1: "",
  //   platform1: "",
  // });

  // const autoCompleteRefs = useRef([]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };
  // const handleInputChange = (e, value) => {
  //   const { name, value: inputValue } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: inputValue || value, // Menggunakan inputValue jika tersedia, jika tidak, gunakan value dari Autocomplete
  //   }));
  // };
  // const handleInputChange = (e) => {
  //   // const { name, value: inputValue } = e.target;
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  //   // setFormData((prevFormData) => ({
  //   //   ...prevFormData,
  //   //   [name]: inputValue !== '' ? inputValue : value,
  //   // }));
  // };

  // const handleChange = (event, value, index) => {
  //   const { name } = event.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };

  // const handleAddInput = () => {
  //   setInputCount(inputCount + 1);
  //   setFormData({
  //     ...formData,
  //     [`from${inputCount + 2}`]: "",
  //     [`to${inputCount + 2}`]: "",
  //     [`depart${inputCount + 2}`]: "",
  //     [`cabin${inputCount + 2}`]: "",
  //     [`platform${inputCount + 2}`]: "",
  //   });
  // };

  // const handleRemoveInput = () => {
  //   if (inputCount > 0) {
  //     setInputCount(inputCount - 1);
  //     const newFormData = { ...formData };
  //     delete newFormData[`from${inputCount + 1}`];
  //     delete newFormData[`to${inputCount + 1}`];
  //     delete newFormData[`depart${inputCount + 1}`];
  //     delete newFormData[`cabin${inputCount + 1}`];
  //     delete newFormData[`platform${inputCount + 1}`];
  //     setFormData(newFormData);
  //   }
  // };

  // const Submit = (e) => {
  //   e.preventDefault();

  //   axios
  //     .post("http://127.0.0.1:5000/api/submit-form", formData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  const onSubmit = (data) => {
    // const { formFields, ...formData } = data;
    const platforms = data.formFields.map((field) =>
    field.PLATFORM1.map((option) => option.file_name)
  );

  // Create a new data object without the 'formFields' property
  const newData = { 
    ...data,
    formFields: data.formFields.map(({ PLATFORM1, ...rest }) => ({ ...rest })),
    PLATFORM1: platforms,
  };
    
    axios
      // .post("http://127.0.0.1:5000/api/submit-form", data, {
      .post("http://127.0.0.1:5000/scrapper", data, {
        // .post("/api/submit-form", data ,{
        headers: {
          "Content-Type": "application/json", // Set the Content-Type header to application/json
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderInputs = () => {
    return fields.map((field, index) => (
      <React.Fragment key={field.id}>
        {
          // Skip index 0
          <Grid item xs={10} sm={2} style={{ margin: 5 }}>
            <Controller
              control={control}
              name={`DEPARTURE${index + 2}`}
              render={({ field }) => (
                <Autocomplete
                  options={top100Films}
                  placeholder="Departure"
                  onChange={(_, data) => field.onChange(data)}
                  value={field.value}
                  sx={{ backgroundColor: "white" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="filled"
                      label="Departure"
                    />
                  )}
                />
              )}
            />
          </Grid>
        }

        {
          <Grid item xs={10} sm={2} style={{ margin: 5 }}>
            <Controller
              control={control}
              name={`DESTINATION${index + 2}`}
              render={({ field }) => (
                <Autocomplete
                  options={top100Films}
                  placeholder="Destination"
                  onChange={(_, data) => field.onChange(data)}
                  value={field.value}
                  sx={{ backgroundColor: "white" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="filled"
                      label="Destination"
                    />
                  )}
                />
              )}
            />
          </Grid>
        }
        {
          <Grid item xs={10} sm={2} style={{ margin: 5 }}>
            <Controller
              control={control}
              name={`START_DATE${index + 2}`}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ backgroundColor: "white" }}
                    placeholderText="Select date"
                    onChange={field.onChange}
                    selected={field.value}
                    label="Start Date"
                    slotProps={{
                      textField: {
                        placeholder: "depart",
                        variant: "filled",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth variant="filled" />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>
        }
        {
          <Grid item xs={10} sm={2} style={{ margin: 5 }}>
            <Controller
              control={control}
              name={`PERIODS${index + 2}`} // Ubah name menjadi "totalBill" karena ini adalah field "totalBill"
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  sx={{ backgroundColor: "white" }}
                  label="Periods"
                  variant="filled"
                  value={field.value} // Gunakan field.value sebagai nilai input
                  onChange={field.onChange}
                  inputProps={{ min: 0 }}
                />
              )}
            />
          </Grid>
        }
        {
          <Grid item xs={10} sm={2} style={{ margin: 5 }}>
            <Controller
              control={control}
              name={`PLATFORM${index + 2}`}
              render={({ field: { ref, onChange, ...field } }) => (
                <Autocomplete
                  multiple
                  options={objOptions}
                  sx={{ backgroundColor: "white" }}
                  getOptionLabel={(option) => option.label}
                  onChange={(_, data) => onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...field}
                      {...params}
                      fullWidth
                      inputRef={ref}
                      variant="filled"
                      label="Platform"
                    />
                  )}
                />
              )}
            />
          </Grid>
        }

        {/* ... kode lainnya ... */}
      </React.Fragment>
    ));
  };

  return (
    <div className="rectangle-13">
      <div className="form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center" className="form-container">
            <Grid item container xs={10} sm={10} justifyContent="center">
              <Grid item xs={10} sm = {2} style={{ margin: 5 }}>
                <Controller
                  control={control}
                  name="DEPARTURE1"
                  render={({ field: { ref, onChange, ...field } }) => (
                    <Autocomplete
                      options={top100Films}
                      placeholder="Departure"
                      onChange={(_, data) => onChange(data)}
                      sx={{ backgroundColor: "white" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          fullWidth
                          inputRef={ref}
                          variant="filled"
                          label="Departure"
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={10} sm= {2} style={{ margin: 5 }}>
                <Controller
                  control={control}
                  name="DESTINATION1"
                  render={({ field }) => (
                    <Autocomplete
                      options={top100Films}
                      placeholder="Destination"
                      onChange={(_, data) => field.onChange(data)}
                      value={field.value}
                      sx={{ backgroundColor: "white" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="filled"
                          label="Destination"
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={10} sm= {2} style={{ margin: 5 }}>
                <Controller
                  control={control}
                  name="START_DATE1"
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        sx={{ backgroundColor: "white" }}
                        placeholderText="Select date"
                        onChange={field.onChange}
                        selected={field.value}
                        label="Start Date"
                        slotProps={{
                          textField: {
                            placeholder: "depart",
                            variant: "filled",
                          },
                        }}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth variant="filled" />
                        )}
                        // renderInput={(params) => {
                        //   console.log(params);
                        //   return (
                        //     <TextField
                        //       {...params}
                        //       inputProps={{
                        //         ...params.inputProps,
                        //         placeholder: "tt.mm.jjjj"
                        //       }}
                        //       variant="filled"
                        //     />
                        //   );
                        // }}
                        // renderInput={(params) => <TextField placeholder="tt.mm.jjjj" {...params} />}
                        // renderInput={(params) => (
                        //   <TextField
                        //     {...params}
                        //     // placeholder="Inputkan tanggal" // Tambahkan placeholder di sini
                        //     fullWidth
                        //     variant="filled"
                        //     label="Select Date"
                        //     placeholder="tt.mm.jjjj"
                        //   />
                        // )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xs={10} sm= {2} style={{ margin: 5 }}>
                <Controller
                  control={control}
                  name="PERIODS1" // Ubah name menjadi "totalBill" karena ini adalah field "totalBill"
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      sx={{ backgroundColor: "white" }}
                      label="Periods"
                      variant="filled"
                      value={field.value} // Gunakan field.value sebagai nilai input
                      onChange={field.onChange}
                      inputProps={{ min: 0 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={10} sm= {2} style={{ margin: 5 }}>
                <Controller
                  control={control}
                  name="PLATFORM1"
                  render={({ field: { ref, onChange, ...field } }) => (
                    <Autocomplete
                      multiple
                      options={objOptions}
                      sx={{ backgroundColor: "white" }}
                      getOptionLabel={(option) => option.label}
                      onChange={(_, data) => onChange(data)}
                      renderInput={(params) => (
                        <TextField
                          {...field}
                          {...params}
                          fullWidth
                          inputRef={ref}
                          variant="filled"
                          label="Platform"
                        />
                      )}
                    />
                  )}
                />
                {/* <Controller
                  control={control}
                  name="PLATFORM1"
                  render={({ field: { ref, onChange, ...field } }) => (
                    <Autocomplete
                      options={top100Films}
                      placeholder="Platform"
                      onChange={(_, data) => onChange(data)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ backgroundColor: "white" }}
                          {...params}
                          {...field}
                          fullWidth
                          inputRef={ref}
                          variant="filled"
                          label="Auto-Complete"
                        />
                      )}
                    />
                  )}
                /> */}
              </Grid>
              {renderInputs()}
            </Grid>
            <Grid
              item
              xs={12}
              sm={1}
              style={{ margin: 5 }}
              justifyContent="center"
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ fontSize: "12px", height: 50 }}
                color="primary"
              >
                Submit
              </Button>
              {/* <Button
                variant="contained"
                sx={{ fontSize: "12px", height: 50 }}
                color="primary"
                onClick={() => append({})}
                
              >
                +
              </Button> */}

              <Button
                variant="contained"
                sx={{ fontSize: "12px", height: 50 }}
                color="primary"
                onClick={() => {
                  append({});
                  // setInputCount((prevCount) => prevCount + 1);
                }}
              >
                +
              </Button>
              {/* <Button
                variant="contained"
                sx={{ fontSize: "12px", height: 50, marginLeft: 10 }}
                color="primary"
                onClick={() => {
                  if (fields.length > 1) remove(fields.length - 1);
                }}
              >
                -
              </Button> */}
              <Button
                variant="contained"
                sx={{ fontSize: "12px", height: 50, marginLeft: 10 }}
                color="primary"
                onClick={() => {
                  if (fields.length >= 1) {
                    remove(fields.length - 1);
                    // setInputCount((prevCount) => prevCount - 1);
                  }
                }}
              >
                -
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default Form;

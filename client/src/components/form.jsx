import React, { useState, useRef, useEffect } from "react";
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
import AppBar from "./appbar";
import Tabelgrup from "./tabel";
import Download from "./download";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import CircularProgress from "@mui/material/CircularProgress";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const top100Films = ["CGK", "SIN", "YIA"];

const filterOptions = (options, { inputValue }) => {
  const inputValueLower = inputValue.toLowerCase();
  return options
    .filter((option) => option.label.toLowerCase().includes(inputValueLower))
    .sort((a, b) => {
      // Sort options by descending match order
      const aIndex = a.label.toLowerCase().indexOf(inputValueLower);
      const bIndex = b.label.toLowerCase().indexOf(inputValueLower);
      return bIndex - aIndex;
    });
};

const objOptions = [
  {
    label: "Traveloka",
    file_name: "nusatrip_webscrapper/scraper_traveloka.py",
  },
  {
    label: "Skyscanner",
    file_name: "nusatrip_webscrapper/scraper_skyscanner.py",
  },
  { label: "Booking", file_name: "nusatrip_webscrapper/scraper_booking.py" },
  { label: "Pegi Pegi", file_name: "nusatrip_webscrapper/scraper_pegi.py" },
];

// const [check, getCheck] = useState(false);

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

  const [data, setData] = useState([]);

  const [hide, setHide] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  // get data for table
  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/printData");
      setData(response.data);
      // if(data != 0 ){
      //   setHide(false);
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch the data when the component mounts
    fetchData();

    // newData();
  }, [hide, readOnly]);

  // useEffect(()=>{
  //   fetchData();
  // });

  // useEffect(() => {
  //   // Mengubah nilai readOnly berdasarkan nilai check
  //   if(check){
  //     setReadOnly(true)
  //   }else{
  //     setReadOnly(false)
  //   }
  // } );

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formFields", // Nama field array, bisa disesuaikan dengan kebutuhan
  });
  const onSubmit = (data) => {
    const platforms = data.formFields.map((field) =>
      field.PLATFORM1.map((option) => option.file_name)
    );
    setHide(true);
    setReadOnly(true);
    // Create a new data object without the 'formFields' property
    const newData = {
      ...data,
      formFields: data.formFields.map(({ PLATFORM1, ...rest }) => ({
        ...rest,
      })),
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
      .then(() => {
        console.log("cobaaa");
        setHide(true);
        setReadOnly(true);

        if (data != 0) {
          setHide(false);
          setReadOnly(false);
        }
        // setCheck(true);
        // updateCheck(true);

        // setHideTable(true);
        // setReadOnly(true)
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
                  getOptionLabel={(option) => option.label}
                  filterOptions={filterOptions} // Set the custom filter function
                  onChange={(_, data) => field.onChange(data)}
                  value={field.value}
                  disabled={readOnly}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...field}
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
                  disabled={readOnly}
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
                    disabled={readOnly}
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
                  disabled={readOnly}
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
                  disabled={readOnly}
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
      </React.Fragment>
    ));
  };

  return (
    <>
      <AppBar
        onAdd={() => {
          append({});
        }}
        onRemove={() => {
          if (fields.length >= 1) {
            remove(fields.length - 1);
          }
        }}
        readOnly={readOnly}
      />
      <div className="rectangle-13">
        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container justifyContent="center" className="form-container">
              <Grid item container xs={10} sm={10} justifyContent="center">
                <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                  <Controller
                    control={control}
                    name="DEPARTURE1"
                    render={({ field: { ref, onChange, ...field } }) => (
                      <Autocomplete
                        options={top100Films}
                        placeholder="Departure"
                        onChange={(_, data) => onChange(data)}
                        disabled={readOnly}
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
                <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                  <Controller
                    control={control}
                    name="DESTINATION1"
                    render={({ field }) => (
                      <Autocomplete
                        options={top100Films}
                        placeholder="Destination"
                        onChange={(_, data) => field.onChange(data)}
                        value={field.value}
                        disabled={readOnly}
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
                <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                  <Controller
                    control={control}
                    name="START_DATE1"
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          sx={{ backgroundColor: "white" }}
                          placeholderText="Select date"
                          onChange={field.onChange}
                          disabled={readOnly}
                          selected={field.value}
                          label="Start Date"
                          slotProps={{
                            textField: {
                              placeholder: "depart",
                              variant: "filled",
                              fullWidth: true,
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
                <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                  <Controller
                    control={control}
                    name="PERIODS1" // Ubah name menjadi "totalBill" karena ini adalah field "totalBill"
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        disabled={readOnly}
                        fullWidth
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
                <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                  <Controller
                    control={control}
                    name="PLATFORM1"
                    render={({ field: { ref, onChange, ...field } }) => (
                      <Autocomplete
                        multiple
                        options={objOptions}
                        disabled={readOnly}
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
                  // onClick={setHide(true)}
                  // onClick={setHide(true)}
                  disabled={readOnly}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>

      {/* ============================================= component Download ================================================= */}
      <Download />
      {/* ============================================== coponent Tabel ==================================================== */}
      <div className="table">
        {hide ? ( // Tampilkan atau sembunyikan tabel berdasarkan nilai hide
          <div className="table-hidden">
            <CircularProgress />
          </div>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">JOB_ID</TableCell>
                  <TableCell align="right">PLATFORM</TableCell>
                  <TableCell align="right">DEPARTURE_DATE</TableCell>
                  <TableCell align="right">DEPARTURE_AIRPORT</TableCell>
                  <TableCell align="right">DESTINATION_AIRPORT</TableCell>
                  <TableCell align="right">MARKERTING_AIRLINE</TableCell>
                  <TableCell align="right">FLIGHT_CODE</TableCell>
                  <TableCell align="right">CABIN_CLASS</TableCell>
                  <TableCell align="right">DEPARTURE_TIME</TableCell>
                  <TableCell align="right">ARRIVAL_TIME</TableCell>
                  <TableCell align="right">TRANSIT</TableCell>
                  <TableCell align="right">ROUTES</TableCell>
                  <TableCell align="right">FLIGHT_DURATION</TableCell>
                  <TableCell align="right">RATES</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right">{row["JOB_ID"]}</TableCell>
                    <TableCell align="right">{row["PLATFORM"]}</TableCell>
                    <TableCell align="right">
                      {formatDate(row["DEPARTURE_DATE"])}
                    </TableCell>
                    <TableCell align="right">
                      {row["DEPARTURE_AIRPORT"]}
                    </TableCell>
                    <TableCell align="right">
                      {row["DESTINATION_AIRPORT"]}
                    </TableCell>
                    <TableCell align="right">
                      {row["MARKETING_AIRLINE"]}
                    </TableCell>
                    <TableCell align="right">{row["FLIGHT_CODE"]}</TableCell>
                    <TableCell align="right">{row["CABIN_CLASS"]}</TableCell>
                    <TableCell align="right">{row["DEPARTURE_TIME"]}</TableCell>
                    <TableCell align="right">{row["ARRIVAL_TIME"]}</TableCell>
                    <TableCell align="right">{row["TRANSIT"]}</TableCell>
                    <TableCell align="right">{row["ROUTES"]}</TableCell>
                    <TableCell align="right">
                      {row["FLIGHT_DURATION"]}
                    </TableCell>
                    <TableCell align="right">{row["RATES"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </>
  );
};

export default Form;

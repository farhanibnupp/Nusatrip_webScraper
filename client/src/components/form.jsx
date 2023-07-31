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
// import { useFieldArray } from 'react-hook-form';

const top100Films = ["CGK", "SIN", "YIA"];

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

const Form = () => {
  const handleAddField = () => {
    setSendList([
      ...sendList,
      {
        id: sendList.length + 1,
        [`DEPARTURE${sendList.length + 1}`]: "",
        [`DESTINATION${sendList.length + 1}`]: "",
        [`START_DATE${sendList.length + 1}`]: [],
        [`PERIODS${sendList.length + 1}`]: "",
        [`PLATFORM${sendList.length + 1}`]: "",
      },
    ]);
  };

  const [sendList, setSendList] = useState([
    {
      id: 1,
      [`DEPARTURE${1}`]: "",
      [`DESTINATION${1}`]: "",
      [`START_DATE${1}`]: [],
      [`PERIODS${1}`]: "",
      [`PLATFORM${1}`]: "",
    },
  ]);

  // const handleChange = (id, field, value) => {
  //   const updatedList = sendList.map((person) =>
  //     person.id === id ? { ...person, [field]: value } : person
  //   );
  //   setSendList(updatedList);
  // };

  // const handleClose = (id, field, value) => {
  //   // Reset hobi to an empty array if no value is selected and the options are closed
  //   if (field === `PLATFORM${id}` && value.length === 0) {
  //     handleChange(id, field, []);
  //   }
  // };
  const handleChange = (id, field, value) => {
    const updatedList = sendList.map((person) =>
      person.id === id ? { ...person, [field]: value } : person
    );
    setSendList(updatedList);
  };

  const handleClose = (id, field, value) => {
    if (field === `PLATFORM${id}` && value.length === 0) {
      handleChange(id, field, []);
    }
  };

  const isplatformfilled = (platform) => {
    return (
      platform &&
      platform.length > 0 
      // platform.every((item) =>
      //   objOptions.some((option) => option.label === item)
      // )
    );
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    console.log("sendList:", sendList);
    const isValidData = sendList.every(
      (person) =>
        person[`DEPARTURE${person.id}`] !== "" &&
        person[`DESTINATION${person.id}`] !== "" &&
        person[`START_DATE${person.id}`] !== "" &&
        person[`PERIODS${person.id}`] !== "" &&
        person[`PLATFORM${person.id}`].length > 0
        // isplatformfilled(person[`PLATFORM${person.id}`])
    );
    console.log("isValidData:", isValidData);

    if (isValidData) {
      alert("Data yang Anda masukkan:\n" + JSON.stringify(sendList));
      setHide(true);
      setReadOnly(true);

      axios
        .post("http://127.0.0.1:5000/scrapper", sendList, {
          headers: {
            "Content-Type": "application/json", // Set the Content-Type header to application/json
          },
        })
        .then(() => {
          console.log("cobaaa");
          setHide(true);
          setReadOnly(true);

          if (sendList != 0) {
            setHide(false);
            setReadOnly(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert(
        "Mohon isi semua field nama, tanggal lahir, dan hobi sebelum submit."
      );
    }
  };
  const handleRemoveLast = () => {
    if (sendList.length > 1) {
      setSendList(sendList.slice(0, sendList.length - 1));
    }
  };

  const [data, setData] = useState([]);
  const [hide, setHide] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  // get data for table
  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/printData");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch the data when the component mounts
    fetchData();

    // newData();
  }, [hide, readOnly]);

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

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "formFields", // Nama field array, bisa disesuaikan dengan kebutuhan
  // });
  const onSubmit = (data) => {
    // const { formFields, ...formData } = data;

    setHide(true);
    setReadOnly(true);

    axios
      .post("http://127.0.0.1:5000/scrapper", data, {
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
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // const renderInputs = () => {
  //   return fields.map((field, index) => (
  //     <React.Fragment key={field.id}>
  //         <Grid item xs={10} sm={2} style={{ margin: 5 }}>
  //           <Controller
  //             control={control}
  //             name={`DEPARTURE${index + 2}`}
  //             render={({ field }) => (
  //               <Autocomplete
  //                 options={top100Films}
  //                 onChange={(_, data) => field.onChange(data)}
  //                 value={field.value}
  //                 sx={{ backgroundColor: "white" }}
  //                 disabled={readOnly}
  //                 renderInput={(params) => (
  //                   <TextField
  //                   {...params}
  //                     fullWidth
  //                     variant="filled"
  //                     label="Departure"
  //                   />
  //                 )}
  //               />
  //             )}
  //           />
  //         </Grid>
  //         <Grid item xs={10} sm={2} style={{ margin: 5 }}>
  //           <Controller
  //             control={control}
  //             name={`DESTINATION${index + 2}`}
  //             render={({ field }) => (
  //               <Autocomplete
  //                 options={top100Films}
  //                 placeholder="Destination"
  //                 onChange={(_, data) => field.onChange(data)}
  //                 value={field.value}
  //                 sx={{ backgroundColor: "white" }}
  //                 disabled={readOnly}
  //                 renderInput={(params) => (
  //                   <TextField
  //                     {...params}
  //                     fullWidth
  //                     variant="filled"
  //                     label="Destination"
  //                   />
  //                 )}
  //               />
  //             )}
  //           />
  //         </Grid>
  //         <Grid item xs={10} sm={2} style={{ margin: 5 }}>
  //           <Controller
  //             control={control}
  //             name={`START_DATE${index + 2}`}
  //             render={({ field }) => (
  //               <LocalizationProvider dateAdapter={AdapterDayjs}>
  //                 <DatePicker
  //                   sx={{ backgroundColor: "white" }}
  //                   placeholderText="Select date"
  //                   onChange={field.onChange}
  //                   {...field}
  //                   selected={field.value}
  //                   disabled={readOnly}
  //                   label="Start Date"
  //                   slotProps={{
  //                     textField: {
  //                       placeholder: "depart",
  //                       variant: "filled",
  //                     },
  //                   }}
  //                   renderInput={(params) => (
  //                     <TextField {...params}{...field} fullWidth variant="filled" />
  //                   )}
  //                 />
  //               </LocalizationProvider>
  //             )}
  //           />
  //         </Grid>

  //         <Grid item xs={10} sm={2} style={{ margin: 5 }}>
  //           <Controller
  //             control={control}
  //             name={`PERIODS${index + 2}`} // Ubah name menjadi "totalBill" karena ini adalah field "totalBill"
  //             defaultValue=""
  //             render={({ field }) => (
  //               <TextField
  //                 {...field}
  //                 type="number"
  //                 disabled={readOnly}
  //                 {...field}
  //                 sx={{ backgroundColor: "white" }}
  //                 label="Periods"
  //                 variant="filled"
  //                 value={field.value} // Gunakan field.value sebagai nilai input
  //                 onChange={field.onChange}
  //                 inputProps={{ min: 0 }}
  //               />
  //             )}
  //           />
  //         </Grid>
  //         <Grid item xs={10} sm={2} style={{ margin: 5 }}>
  //           <Controller
  //             control={control}
  //             name={`PLATFORM${index + 2}`}
  //             render={({ field: { ref, onChange, ...field } }) => (
  //               <Autocomplete
  //                 multiple
  //                 disabled={readOnly}
  //                 options={objOptions}
  //                 // {...field}
  //                 sx={{ backgroundColor: "white" }}
  //                 getOptionLabel={(option) => option.label}
  //                 onChange={(_, data) => onChange(data)}
  //                 renderInput={(params) => (
  //                   <TextField
  //                     {...field}
  //                     {...params}
  //                     fullWidth
  //                     inputRef={ref}
  //                     variant="filled"
  //                     label="Platform"
  //                   />
  //                 )}
  //               />
  //             )}
  //           />
  //         </Grid>
  //     </React.Fragment>
  //   ));
  // };
  return (
    <>
      <AppBar
        onAdd={handleAddField}
        onRemove={handleRemoveLast}
        readOnly={readOnly}
      />
      <div className="rectangle-13">
        <div className="form">
          <form onSubmit={handleSubmit1}>
            <Grid container justifyContent="center" className="form-container">
              <Grid item container xs={10} sm={10} justifyContent="center">
                {sendList.map((person) => (
                  <>
                    <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                      <Autocomplete
                        options={top100Films}
                        placeholder="DEPARTURE"
                        value={person[`DEPARTURE${person.id}`]}
                        onChange={(e, value) =>
                          handleChange(
                            person.id,
                            `DEPARTURE${person.id}`,
                            value
                          )
                        }
                        onClose={(e, value) =>
                          handleClose(
                            person.id,
                            `DEPARUTURE${person.id}`,
                            value
                          )
                        }
                        sx={{ backgroundColor: "white" }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            variant="filled"
                            label="DEPARTURE"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                      <Autocomplete
                        options={top100Films}
                        placeholder="DESTINATION"
                        value={person[`DESTINATION${person.id}`]}
                        onChange={(e, value) =>
                          handleChange(
                            person.id,
                            `DESTINATION${person.id}`,
                            value
                          )
                        }
                        sx={{ backgroundColor: "white" }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            variant="filled"
                            label="DESTINATION"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          sx={{ backgroundColor: "white" }}
                          placeholderText="Select date"
                          // onChange={(e) =>
                          //   handleChange(
                          //     person.id,
                          //     `START_DATE${person.id}`,
                          //     e.target.value
                          //   )
                          // }
                          onChange={(newValue) =>
                            handleChange(
                              person.id,
                              `START_DATE${person.id}`,
                              newValue
                            )
                          }
                          // onAccept={(date) =>
                          //   handleChange(
                          //     person.id,
                          //     `START_DATE${person.id}`,
                          //     date
                          //   )
                          // }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              fullWidth = {true}
                            />
                          )}
                          value={person[`START_DATE${person.id}`]}
                          // selected={value}
                          fullWidth = {true}
                          required
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                      <TextField
                        type="number"
                        // disabled={readOnly}
                        sx={{ backgroundColor: "white" }}
                        label="Periods"
                        fullWidth
                        variant="filled"
                        value={person[`PERIODS${person.id}`]} // Gunakan field.value sebagai nilai input
                        onChange={(e) =>
                          handleChange(
                            person.id,
                            `PERIODS${person.id}`,
                            e.target.value
                          )
                        }
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                    <Grid item xs={10} sm={2} style={{ margin: 5 }}>
                      <Autocomplete
                        multiple
                        options={objOptions}
                        placeholder="Platform"
                        onChange={(e, value) =>
                          handleChange(person.id, `PLATFORM${person.id}`, value)
                        }
                        value={person[`PLATFORM${person.id}`] || []}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{ backgroundColor: "white" }}
                            fullWidth
                            variant="filled"
                            label="Auto-Complete"
                          />
                        )}
                      />
                    </Grid>
                  </>
                ))}
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

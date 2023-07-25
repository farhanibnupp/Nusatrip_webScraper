import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";
// import Form from "./form";

// import { check, setCheck } from './form';

import "../style/styles4.css";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function BasicTable({ setCheck, check }) {
  const [data, setData] = useState([]);
  const [hide, setHide] = useState(true);

  // const [nyala, setNyala] = useState(false);

  useEffect(() => {
    // Fetch the data when the component mounts
    if(!check){
      fetchData();
      // setHide(false);
    }
    
  }, []);

  // useEffect(() => {
  //   // Fetch the data when the component mounts
  // }, [check]);

  useEffect(() => {
    // Fetch the data when the component mounts
    if (check) {
      fetchData();
      setCheck(false);
      setHide(false);
      // setHide(false)
    }
  });

  const fetchData = async () => {
    try {
      // if(Form.check){
      //   const response = await axios.get("http://127.0.0.1:5000/printData");
      //   setData(response.data);
      // }
      const response = await axios.get("http://127.0.0.1:5000/printData");
      setData(response.data);
      // setHide(false);

      // progressValueElement.textContent = data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Custom function to format the date
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

  // setInterval(fetchData, 3500);
  return (
    <div className="table">
      {hide ? ( // Tampilkan atau sembunyikan tabel berdasarkan nilai hide
        <div className="table-hidden">Tabel sedang bersembunyi...</div>
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
                  <TableCell align="right">{row["FLIGHT_DURATION"]}</TableCell>
                  <TableCell align="right">{row["RATES"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
  // return (
  //   <div className="table">
  //     <TableContainer component={Paper}>
  //       <Table sx={{ minWidth: 650 }} aria-label="simple table">

  //         <TableHead>
  //           <TableRow>
  //             <TableCell align="right">JOB_ID</TableCell>
  //             <TableCell align="right">PLATFORM</TableCell>
  //             <TableCell align="right">DEPARTURE_DATE</TableCell>
  //             <TableCell align="right">DEPARTURE_AIRPORT</TableCell>
  //             <TableCell align="right">DESTINATION_AIRPORT</TableCell>
  //             <TableCell align="right">MARKERTING_AIRLINE</TableCell>
  //             <TableCell align="right">FLIGHT_CODE</TableCell>
  //             <TableCell align="right">CABIN_CLASS</TableCell>
  //             <TableCell align="right">DEPARTURE_TIME</TableCell>
  //             <TableCell align="right">ARRIVAL_TIME</TableCell>
  //             <TableCell align="right">TRANSIT</TableCell>
  //             <TableCell align="right">ROUTES</TableCell>
  //             <TableCell align="right">FLIGHT_DURATION</TableCell>
  //             <TableCell align="right">RATES</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {data.map((row, index) => (
  //             <TableRow
  //               key={index}
  //               sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
  //             >
  //               {/* <TableCell component="th" scope="row">
  //                       {item.name}
  //                   </TableCell> */}
  //               <TableCell align="right">{row['JOB_ID']}</TableCell>
  //               <TableCell align="right">{row['PLATFORM']}</TableCell>
  //               <TableCell align="right">{formatDate(row['DEPARTURE_DATE'])}</TableCell>
  //               <TableCell align="right">{row['DEPARTURE_AIRPORT']}</TableCell>
  //               <TableCell align="right">{row['DESTINATION_AIRPORT']}</TableCell>
  //               <TableCell align="right">{row['MARKETING_AIRLINE']}</TableCell>
  //               <TableCell align="right">{row['FLIGHT_CODE']}</TableCell>
  //               <TableCell align="right">{row['CABIN_CLASS']}</TableCell>
  //               <TableCell align="right">{row['DEPARTURE_TIME']}</TableCell>
  //               <TableCell align="right">{row['ARRIVAL_TIME']}</TableCell>
  //               <TableCell align="right">{row['TRANSIT']}</TableCell>
  //               <TableCell align="right">{row['ROUTES']}</TableCell>
  //               <TableCell align="right">{row['FLIGHT_DURATION']}</TableCell>
  //               <TableCell align="right">{row['RATES']}</TableCell>
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   </div>
  // );
}

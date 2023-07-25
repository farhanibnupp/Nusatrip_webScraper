import * as React from "react";
import "../style/styles4.css";
import axios from "axios";
import { Link } from "@mui/material";

function download() {


  const handleDownload = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/download", {
        responseType: "blob", // Tell axios to treat the response as a binary object
      });

      // Create a URL for the blob data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "scraping_result.csv"); // Set the filename for the downloaded file
      document.body.appendChild(link);

      // Simulate a click on the link to trigger the download
      link.click();

      // Remove the temporary link element
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading data:", error);
    }
  };
  // const fectDownload = async() =>{
  //   try {
  //     // if(Form.check){
  //     //   const response = await axios.get("http://127.0.0.1:5000/printData");
  //     //   setData(response.data);
  //     // }
  //     const response = await axios.get("http://127.0.0.1:5000/printData");
  //     // setData(response.data);
      
  //     // progressValueElement.textContent = data;
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }

  // }

  return (
    <>
      <div className="">
        <form action="http://localhost:5000/download" method="POST">
          <div className="download">
            <p className="text-end">
              <Link onClick={handleDownload}>
                Download data
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
export default download;

import * as React from "react";
import "../style/styles4.css";

function download() {
  return (
    <>
      <div className="">
        <form action="http://localhost:5000/download" method="POST">
          <div className="download">
            <p className="text-end">
              <a href="http://localhost:5000/download" className="download-data-as-csv ">
                Download data as csv
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
export default download;

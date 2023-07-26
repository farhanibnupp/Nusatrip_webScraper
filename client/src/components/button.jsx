import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const button = ({ onAdd, onRemove,readOnly }) => {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          sx={{ fontSize: "20px", height: 50, color : "white", }}
          color="primary"
          onClick={onAdd}
          disabled = {readOnly}
        >
          +
        </Button>
        <Button
          variant="outlined"
          sx={{ fontSize: "20px", height: 50, marginLeft: 10, color : "white" }}
          color="primary"
          onClick={onRemove}
          disabled = {readOnly}
        >
          -
        </Button>
      </Stack>
    </>
  );
};
export default button;

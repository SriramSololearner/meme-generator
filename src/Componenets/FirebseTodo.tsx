import { Box, Button, TextField } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";

const FirebseTodo = () => {
  const [data, setData] = useState({
    txt: "",
  });
  const [txt, setTxt] = useState("");

  useEffect(() => {
    postFirebaseData();
  }, [txt]);

  const postFirebaseData = async () => {
    const res = await fetch(
      "https://login-app-10888-default-rtdb.asia-southeast1.firebasedatabase.app/Todo.json",
      { method: "POST", body: JSON.stringify(data) }
    );
    const json = await res.json();
    console.log(json);
  };

  const formSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setData({ ...data, txt });
  };
  return (
    <Box component={"form"} onSubmit={formSubmit}>
      realtime firebase database
      <TextField value={txt} onChange={(event) => setTxt(event.target.value)} />
      <Button variant="outlined" type="submit">
        {" "}
        Add
      </Button>
    </Box>
  );
};

export default FirebseTodo;

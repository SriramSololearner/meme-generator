import { Box, Button, Stack } from "@mui/material";
import html2canvas from "html2canvas";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { StyleSheet } from "./Styles";
interface Istate {
  text: {
    topTextField: string;
    bottomTextField: string;
  };
  data: { url: string }[];
  file: string;
  error: string;
  colorPicker: {
    color: string;
    shadow: string;
  };
  onHover: boolean;
  fontSize: number;
  isError: boolean;
  inputs: {
    id: number;
    text: string;
    color: string;
    shadow: string;
    fontSize: number;
  }[];
}
const Landing = () => {
  const [data, setData] = useState<Istate["data"]>([
    {
      url: "https://i.imgflip.com/30b1gx.jpg",
    },
  ]);
  const [hoverState, setHoverState] = useState<Istate["onHover"]>(false);
  const Iref = useRef();
  const TopTextBox = useRef();
  const [inputs, setInputs] = useState<Istate["inputs"]>([
    {
      id: 1,
      text: "",
      color: "#ffffff",
      shadow: "#000000",
      fontSize: 36,
    },
  ]);
  const [file, setFile] = useState<Istate["file"]>(data[0].url);
  const [url] = useState<string>("");
  const [error, setError] = useState<Istate["error"]>();
  const [isError] = useState<Istate["isError"]>(false);
  async function fetchData() {
    try {
      const response = await fetch("https://api.imgflip.com/get_memes");
      const res = await response.json();

      setData(res.data.memes);
    } catch (error) {
      setError(error as string);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  const adjustSize = (text1: string, inputId: number) => {
    let minFont = 5;
    let topText = 36 - 0.5 * text1.length;
    const newInputs = [...inputs];
    newInputs[inputId - 1].fontSize = Math.max(topText, minFont);
    setInputs(newInputs);
  };
  const handlerChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    inputId: number
  ) => {
    const newInputs = [...inputs];

    newInputs[inputId - 1].text = event.target.value;
    setInputs(newInputs);
    adjustSize(newInputs[inputId - 1].text, inputId);
  };

  const handleFileChange = (event: React.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    let imgUrl = URL.createObjectURL(file);
    imgUrl && setFile(imgUrl ?? url);
  };
  const handleDownload = () => {
    Iref.current &&
      html2canvas(Iref.current, { useCORS: true })
        .then(function (canvas) {
          const link = document.createElement("a");
          link.download = "meme-img.png";
          link.href = canvas.toDataURL("image/png/jpeg/jpg");
          link.click();
        })
        .catch((er) => setError(er.message));
  };
  const handleClick = (Url: string) => {
    setFile(Url);
  };
  const colorChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    objId: number
  ) => {
    const newData = [...inputs];
    console.log(event.target.value);
    newData[objId - 1].color = event.target.value;
    setInputs(newData);
  };

  const shadowColorChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    objId: number
  ) => {
    const newData = [...inputs];
    console.log(event.target.value);
    newData[objId - 1].shadow = event.target.value;
    setInputs(newData);
  };

  const handlerAddTextField = () => {
    setInputs([
      ...inputs,
      {
        id: inputs.length + 1,
        text: "",
        color: "#ffffff",
        shadow: "#000000",
        fontSize: 36,
      },
    ]);
  };
  return (
    <Box>
      {error || isError ? (
        <Box>Something went wrong!!! {error}</Box>
      ) : (
        <Box sx={StyleSheet.Main}>
          <Box>
            <Box>
              <Box sx={StyleSheet.headerContent}>Meme Generator</Box>
              <Box
                component={"input"}
                type="file"
                id="image-file"
                sx={StyleSheet.upload}
                onChange={handleFileChange}
              />
            </Box>
            <Box sx={StyleSheet.memeContainer}>
              {file && (
                <Box
                  ref={Iref}
                  sx={{
                    ...StyleSheet.imageContainer,
                    backgroundImage: `url(${url || file})`,
                  }}
                  onMouseEnter={() => setHoverState(true)}
                  onMouseLeave={() => setHoverState(false)}
                >
                  <Box sx={StyleSheet.imgContent}>
                    {inputs.map((obj) => (
                      <Draggable key={obj.id}>
                        <Box
                          component={"p"}
                          ref={TopTextBox}
                          id="mydiv"
                          sx={{
                            ...StyleSheet.imgContent_TopTextBox,
                            fontSize: `${inputs[obj.id - 1].fontSize}px`,
                            color: `${obj.color}`,
                            textShadow: `0px 4px 3px ${obj.shadow}`,
                            border: `${
                              hoverState
                                ? `${hoverState} && 2px solid ${obj?.color}`
                                : null
                            }`,
                          }}
                        >
                          {obj.text}
                        </Box>
                      </Draggable>
                    ))}
                  </Box>
                </Box>
              )}
              <Box sx={StyleSheet.InputFields}>
                <Box
                  component={"label"}
                  htmlFor="image-file"
                  sx={StyleSheet.uploadBtn}
                >
                  Upload new template
                </Box>
                <Box sx={StyleSheet.images}>
                  {data.length > 0 &&
                    data.map(function (obj, index) {
                      return (
                        <Box
                          key={index}
                          component={"img"}
                          src={obj.url}
                          sx={StyleSheet.echImage}
                          onClick={() => handleClick(obj.url)}
                        ></Box>
                      );
                    })}
                </Box>
                <Box sx={StyleSheet.inputContainer}>
                  {inputs.map((obj) => (
                    <Stack
                      key={obj.id}
                      direction={"column"}
                      sx={StyleSheet.inputContainer_innerBox}
                    >
                      <Stack direction={"row"} alignItems={"center"}>
                        <Box
                          component={"input"}
                          sx={StyleSheet.Input}
                          placeholder={`Text #${obj.id}`}
                          onChange={(evt) => handlerChange(evt, obj.id)}
                          name="text"
                          value={obj.text}
                        ></Box>
                        <Box
                          component={"input"}
                          type="color"
                          name="color"
                          value={obj.color}
                          onChange={(event) =>
                            colorChangeHandler(event, obj.id)
                          }
                          sx={StyleSheet.inputColorField}
                        ></Box>
                        <Box
                          component={"input"}
                          type="color"
                          name="shadow"
                          value={obj.shadow}
                          onChange={(event) =>
                            shadowColorChangeHandler(event, obj.id)
                          }
                          sx={StyleSheet.inputColorField}
                        ></Box>
                      </Stack>
                    </Stack>
                  ))}
                </Box>
                <Box sx={StyleSheet.btnsContainer}>
                  <Button
                    onClick={handlerAddTextField}
                    sx={StyleSheet.addText}
                    variant="outlined"
                  >
                    Add Text
                  </Button>
                  <Button sx={StyleSheet.addText} variant="outlined">
                    Remove Text
                  </Button>
                </Box>
                <Box>
                  <Button variant="contained" onClick={handleDownload}>
                    Generate Meme
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default Landing;

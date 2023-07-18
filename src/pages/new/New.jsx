import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!info.name) {
      setErrorMessage("Please enter a name.");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "upload");
    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dmrxamgbh/image/upload",
        data
      );

      const { url } = uploadRes.data;

      const newUser = {
        ...info,
        img: url,
      };

      await axios.post("http://localhost:8800/api/auth/register", newUser);
      setSuccessMessage("Data and file are successfully inserted.");

      // Clear the form and file input after successful insertion
      setInfo({});
      setFile(null);
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        const errorMessage = err.response.data.message;
        setErrorMessage(errorMessage);
        console.log(errorMessage);
      } else if (err.request) {
        // The request was made but no response was received
        const errorMessage = "Request error. Please try again.";
        setErrorMessage(errorMessage);
        console.log(err.request);
      } else {
        // Something happened in setting up the request
        const errorMessage = "An unexpected error occurred.";
        setErrorMessage(errorMessage);
        console.log(err.message);
      }
    }
  };

  console.log(info);
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && (
          <div className="popup">
            <p>{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default New;

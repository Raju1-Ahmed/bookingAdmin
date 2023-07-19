import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import Loading from "../../components/loading/Loading";

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const { data, error } = useFetch("http://localhost:8800/api/hotels");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const roomNumbers = rooms.split(",").map((room) => ({ number: room }));

    setLoading(true); // Set loading to true before making the request

    try {
      const response = await axios.post(`http://localhost:8800/api/rooms/${hotelId}`, { ...info, roomNumbers });
      // Handle the successful response here
      console.log(response.data); // Example: log the response data
    } catch (err) {
      if (err.response && err.response.status === 500) {
        // Handle the 500 Internal Server Error here
        console.log("Internal Server Error occurred.");
        console.log(err.response.data); // Example: log the error response data
      } else {
        // Handle other errors
        console.log("Error occurred:", err.message);
      }
    }

    setLoading(false); // Set loading back to false after the request is complete
  };

  console.log(info);
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Rooms</label>
                <textarea
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="give comma between room numbers."
                />
              </div>
              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)}
                >
                  {data ? (
                    data.map((hotel) => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </option>
                    ))
                  ) : (
                    <option><Loading/></option>
                  )}
                </select>
              </div>
              <button onClick={handleClick}>Send</button>
              {loading && <div className="spinner"><Loading/></div>} {/* Render the loading spinner */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;

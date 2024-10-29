import "./App.css";
import { Axios } from "axios";

const API_KEY = import.meta.env.WEATHER_API_KEY;


function App() {
  return (
    <>
      <div>
        <h1 className="text-white text-center text-3xl pt-3.5">Weather App</h1>
        <div className="text-center p-4">
          <input
            type="text"
            name="search-bar"
            id="search-bar"
            className="text-lg border-gray-300 bg-white border-2 rounded-xl px-2 py-1 w-4/6"
            placeholder="Enter City Name"
          />
        </div>
      </div>
    </>
  );
}

export default App;

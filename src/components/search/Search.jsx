import React, { useState } from "react";
import "./Search.css";
import CountUp from "react-countup";

const Search = () => {
  const [city, setCity] = useState("Trichy");
  const handleCityName = (e) => {
    setCity(e.target.value);
  };

  return (
    <div className="search" id="home">
      <h1>Properties for rent in {city}</h1>
      <p>10K+ listings added daily and 50k+ total verified</p>
        <div className="searchBarContainer">
          <select
            id="city"
            value={city}
            onChange={handleCityName}
            className="cityDropdown"
          >
            <option value="">Select City</option>
            <option value="Chennai">Chennai</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Madurai">Madurai</option>
            <option value="Tiruchirappalli">Tiruchirappalli</option>
            <option value="Salem">Salem</option>
            <option value="Tirunelveli">Tirunelveli</option>
            <option value="Tiruppur">Tiruppur</option>
            <option value="Thiruvallur">Thiruvallur</option>
            <option value="Thoothukkudi">Thoothukkudi</option>
            <option value="Kanniyakumari">Kanniyakumari</option>
            <option value="Thanjavur">Thanjavur</option>
            <option value="Chengalpattu">Chengalpattu</option>
            <option value="Dindigul">Dindigul</option>
            <option value="Vellore">Vellore</option>
            <option value="Cuddalore">Cuddalore</option>
            <option value="Kancheepuram">Kancheepuram</option>
            <option value="Erode">Erode</option>
            <option value="Tiruvannamalai">Tiruvannamalai</option>
            <option value="Virudhunagar">Virudhunagar</option>
            <option value="Pudukkottai">Pudukkottai</option>
            <option value="Krishnagiri">Krishnagiri</option>
            <option value="Sivagangai">Sivagangai</option>
            <option value="Nagapattinam">Nagapattinam</option>
          </select>
          <input
            type="text"
            placeholder="Search for locality, landmark, project or builder"
            className="searchBox"
          />
        </div>

      <div className="labels">
        <div className="homes">
          <h1>Homes</h1>
          <span>
            <CountUp start={0} end={50} duration={2} delay={0} />+
          </span>
        </div>
        <div className="customer">
          <h1>
            Happy <br />
            Customers
          </h1>
          <span>
            <CountUp start={0} end={100} duration={2} delay={0} />+
          </span>
        </div>
        <div className="areas">
          <h1>Areas</h1>
          <span>
            <CountUp start={0} end={100} duration={2} delay={0} />+
          </span>
        </div>
      </div>
    </div>
  );
};

export default Search;

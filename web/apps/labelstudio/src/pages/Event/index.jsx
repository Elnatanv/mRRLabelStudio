import { useState } from "react";
import { SidebarMenu } from "../../components/SidebarMenu/SidebarMenu";

const MenuLayout = ({ children, ...routeProps }) => {
  const menuItems = [];

  return (
    <SidebarMenu
      menuItems={menuItems}
      path={routeProps.match.url}
      children={children}
    />
  );
};

const eventPages = {};
const EventPageComponent = () => {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState(""); // New date state
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [token, setToken] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventName || !date || !file) return;

    const formData = new FormData();
    formData.append("event_id", eventName);
    formData.append("event_date", date); // Add date to form data
    formData.append("csv_file", file);
    formData.append("video_urls", JSON.stringify(filteredData)); // Add filteredData as video_urls

    await fetch("http://localhost:8000/process-videos", {
      method: "POST",
      body: formData,
    });
  };

  const handleFetchLink = async () => {
    if (!link) return;
    try {
      const res = await fetch(link, {
        headers: token ? { Authorization: token } : {},
      });
      const data = await res.json();
      const filtered = Array.isArray(data.results)
        ? data.results
            .filter((obj) => obj.status === 2)
            .map((obj) => ({
              url: obj.res_url,
              segm_end: obj.segm_end,
              segm_start: obj.segm_start,
              status: obj.status,
            }))
        : [];
      console.log("Filtered Data:", filtered);

      setFilteredData(filtered);
    } catch (err) {
      setFilteredData([]);
    }
  };

  return (
    <div>
      <div>
        <label>
          Link to fetch data:
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            style={{ marginLeft: 8, width: 300 }}
          />
        </label>
        <label style={{ marginLeft: 16 }}>
          Authorization Token:
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ marginLeft: 8, width: 300 }}
            placeholder="Bearer ..."
          />
        </label>
        <button onClick={handleFetchLink} style={{ marginLeft: 8 }}>
          Fetch & Filter
        </button>
      </div>
      {filteredData.length > 0 && (
        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div>
            <label>
              Event Name:
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </label>
            <label style={{ marginLeft: 16 }}>
              Date:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{ marginLeft: 8 }}
              />
            </label>
          </div>
          <div>
            <label>
              CSV File:
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export const EventPage = {
  title: "Event",
  path: "/event",
  exact: true,
  layout: MenuLayout,
  component: EventPageComponent,
  pages: eventPages,
};

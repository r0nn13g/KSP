import { ReactTicker } from "@guna81/react-ticker";
import '../styles/ticker-styles.css';

const AdTicker = () => {
  const data = [
    {
      id: 1,
      value:
        "🌎 IRLNetwork",
    },
    {
      id: 1,
      value:
      "|",
    },
    {
      id: 1,
      value:
      "displaying real viewer counts on Kick 😈",
    },
    {
      id: 1,
      value:
      "|",
    },
    {
      id: 1,
      value:
      "search for a specific channel",
    },
    {
      id: 1,
      value:
      "|",
    },
    {
      id: 1,
      value:
      "create a watchlist",
    },
    {
      id: 1,
      value:
      "|",
    },
    {
      id: 1,
      value:
      "is your favorite streamer banned?",
    },
    {
      id: 1,
      value:
      "|",
    },
    {
      id: 1,
      value:
      "created by scriptedagain",
    },
    {
      id: 1,
      value:
        "|",
    },
    {
      id: 1,
      value:
      "give me money: eth - 0xb043AFf65296E369741a280bFf3A4638776AdDb7",
    },
    {
      id: 1,
      value:
        "|",
    },
  ];

  const renderItem = (item) => {
    return (
      <p
        style={{
          whiteSpace: "nowrap",
          color: "#252525",
        }}
      >
        {item.value}
      </p>
    );
  };

  return (
    <div className="App">
      {/* using custom ticker item component */}
      <ReactTicker
        data={data}
        component={renderItem}
        speed={58}
        keyName="_id"
        tickerStyle={{
          position: "relative",
          bottom: 0,
          left: "0",
          width: "100%",
          height: "24px",
          color: "#252525",
          backgroundColor: "var(--green-elements)",
          zIndex: 99,
        }}
        tickerClassName="news-ticker"
      />
    </div>
  );
};

export default AdTicker;

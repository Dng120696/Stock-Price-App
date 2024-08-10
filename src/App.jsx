import { useState } from "react";

function App() {
  const [stockData, setStockData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [stockQuery, setStockQuery] = useState("");
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

  async function handleSubmit(e) {
    e.preventDefault();

    // guardclause, it will do anything if the input is empty and return nothing
    if (inputVal.trim().length === 0) return;

    setStockQuery(inputVal.trim()); // Update query
    setInputVal(""); //clear the input after submit
    setLoading(true); //it show the loading before the data fetch
    setStockData(null); // Clear previous stock data
    setErrorMessage(null); // Clear previous error message

    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${inputVal}&token=${apiKey}`
      );

      const data = await response.json();
      console.log(data);
      //check if the API is invalid key
      if (data.error) {
        throw new Error(data.error);
      }

      // Check if current price data is invalid
      if (data.c === 0) {
        throw new Error("Invalid symbol or no data found"); // create a custom error if the symbol is invalid
      } else {
        setStockData(data); // save the data to a state variable
        setErrorMessage(null); // clear error message
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setStockData(null);
      setErrorMessage(error.message);
    } finally {
      // Always hide loading indicator
      setLoading(false);
    }
  }

  return (
    <div
      className="w-[clamp(30rem,90%,120rem)] mx-auto flex items-center justify-center
    min-h-screen flex-col gap-10 text-2xl"
    >
      <h1 className="text-4xl lg:text-5xl font-bold tracking-[2px] text-gray-700 mb-4 lg:mb-6">
        Stock Price App
      </h1>
      <div className="w-[clamp(30rem,100%,50rem)] shadow-[0_0_1rem_rgba(0,0,0,0.15)] p-10 rounded-md">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4 lg:gap-6 text-xl md:text-2xl"
        >
          <input
            type="text"
            name="searchStockQuery"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search Stock..."
            className="w-full border border-gray-400 px-6 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500 "
          />
          <button
            type="submit"
            className="px-6 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Search
          </button>
        </form>
        <div
          className="h-[20vh] flex items-center flex-col
         justify-center font-medium text-gray-700 text-xl md:text-2xl "
        >
          {loading && <p>Loading...</p>}
          {!stockQuery && !loading && (
            <p className="text-gray-500 ">
              Search Stock Symbol to view the Current Price
            </p>
          )}
          {errorMessage && stockQuery && (
            <p className="text-red-500">Error: {errorMessage}</p>
          )}
          {stockData && !errorMessage && stockQuery && (
            <div
              className="
            flex items-center flex-col gap-2"
            >
              <p>
                <span className=" text-gray-500 font-normal">
                  Stock Symbol:
                </span>{" "}
                {stockQuery}
              </p>
              <p>
                {" "}
                <span className=" text-gray-500 font-normal">
                  Current Price:{" "}
                </span>{" "}
                ${stockData.c}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

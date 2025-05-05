import { useState } from "react";
import Content from "./Content";
import Loader from "./Loader";

const Interface = () => {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("affordable");
  const [days, setDays] = useState(1);
  const [content, setContent] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    console.log("Loading...");

    try {
      setContent();
      const response = await fetch("http://localhost:8000/process-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: destination,
          budget_preference: budget,
          days: days,
        }),
      });

      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error sending the data:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      console.log("Loaded");
    }
  };

  return (
    <div>
      <h1 className="text-5xl font-bold text-center text-white mt-16 mb-4 font-sans">
        Trip Buddy
      </h1>
      <h2 className="text-xl font-semibold text-center text-white mb-6 font-mono">
        Your AI trip planner buddy
      </h2>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Destination
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Where do you want to go?"
              required
            />
          </div>

          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Budget
            </label>
            <select
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="cheap">Cheap</option>
              <option value="affordable">Affordable</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="days"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Days
            </label>
            <input
              type="number"
              id="days"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out cursor-pointer"
          >
            Plan My Trip
          </button>
        </form>
      </div>

      {isLoading && <Loader />}
      {content && <Content content={content} />}
      {isError && (
        <div>
          <h1 className="text-3xl text-red-600">
            Error Planning. Please Try Again.
          </h1>
        </div>
      )}
    </div>
  );
};

export default Interface;

import React from "react";

const Content = ({ content }) => {
  if (!content)
    return (
      <div>
        <h1 className="text-3xl text-red-600">
          Error Planning. Please Try Again.
        </h1>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 rounded-2xl shadow-lg backdrop-blur-lg bg-white/10 border border-white/20">
      {/* Destination Header */}
      <div className="text-center mb-10 flex flex-col">
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-md">
          {content.destination}
        </h1>
        <div className="p-4 flex gap-2 text-center justify-center">
          <h2 className="font-semibold text-white/90">Estimated Budget: </h2>
          <span className="text-cyan-300 font-medium drop-shadow-sm">
            {content.estimated_budget}
          </span>
        </div>
      </div>

      <section className="mb-8 p-6 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-sm">
        <h2 className="text-2xl font-semibold text-white mb-3">Overview</h2>
        <p className="text-white leading-relaxed">{content.overview}</p>
      </section>

      <section className="p-6 mb-8 rounded-2xl backdrop-blur-sm bg-blue-500/10 border border-blue-400/20">
        <h2 className="text-2xl font-semibold text-white mb-3">
          Current weather and best time to visit
        </h2>
        <p className="text-cyan-200 font-medium">
          {content.best_time_to_visit}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 border-b pb-2 border-white/20">
          Top Attractions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.attractions.map((attraction, index) => (
            <div
              key={index}
              className="flex items-start p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <span className="text-cyan-400 mr-3 mt-0.5">•</span>
              <span className="text-white/90">{attraction}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 border-b pb-2 border-white/20">
          Recommended Hotels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.hotels.map((hotel, index) => (
            <div
              key={index}
              className="border rounded-xl p-5 hover:shadow-lg transition-all backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10"
            >
              <h3 className="font-bold text-lg text-white">{hotel.name}</h3>
              <p className="text-white/90 mt-1">{hotel.price}</p>
              {hotel.link !== "Not Available" && (
                <a
                  href={hotel.link}
                  className="text-cyan-300 hover:text-cyan-100 mt-2 inline-block font-medium transition-colors"
                >
                  View Hotel →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 p-6 rounded-2xl backdrop-blur-sm bg-indigo-500/10 border border-indigo-400/20">
        <h2 className="text-2xl font-semibold text-white mb-3">
          Getting Around
        </h2>
        <p className="text-white">{content.transportation}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 border-b pb-2 border-white/20">
          Your {Object.keys(content.itinerary).length}-Day Itinerary
        </h2>
        {Object.entries(content.itinerary).map(([day, schedule]) => (
          <div
            key={day}
            className="mb-5 border rounded-xl overflow-hidden backdrop-blur-sm bg-white/5 border-white/20"
          >
            <div className="bg-cyan-600/80 text-white p-4">
              <h3 className="font-bold">Day {day.replace("day", "")}</h3>
            </div>
            <div className="p-5 bg-white/5">
              <ul className="space-y-3">
                {Object.entries(schedule).map(([time, activity]) => (
                  <li key={time} className="flex">
                    <span className="font-medium text-white w-24 flex-shrink-0">
                      {time}
                    </span>
                    <span className="text-white/90">{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 border-b pb-2 border-white/20">
          Travel Tips
        </h2>
        <ul className="space-y-3">
          {content.travel_tips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10"
            >
              <span className="text-emerald-300 mr-3 mt-0.5">✓</span>
              <span className="text-white">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {content.sources.length > 0 && (
        <div className="text-sm text-white/50 mt-8 pt-4 border-t border-white/20">
          <p>Sources: {content.sources.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default Content;

"use client";

import { useEffect, useState } from "react";
import Header from "@/app/(admin)/Header";

const Destination = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/destinations") // Sesuaikan dengan URL API backend Laravel
      .then((res) => res.json())
      .then((data) => {
        setDestinations(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching destinations:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="ml-64 p-6 space-y-6">
        <Header title="Destination" />
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h1 className="text-2xl font-bold mb-4">Destinations</h1>

              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2 text-left w-16">
                        ID
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Location
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Description
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Price
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Image
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinations.map((destination) => (
                      <tr key={destination.id}>
                        <td className="border border-gray-300 px-4 py-2">
                          {destination.id}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {destination.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {destination.location}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {destination.description}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {destination.price}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {destination.image}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Destination;

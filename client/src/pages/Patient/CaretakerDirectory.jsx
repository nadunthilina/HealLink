// CaretakerDirectory.jsx
import React, { useState } from "react";

const caretakers = [
  { id: 1, name: "Jane Doe", skills: ["Nursing"], rating: 4.5, available: true },
  { id: 2, name: "John Smith", skills: ["Physiotherapy"], rating: 4.8, available: false },
];

const CaretakerDirectory = () => {
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");

  const filteredCaretakers = caretakers.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (availability === "all" || (availability === "available" && c.available))
    );
  });

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Caretaker Directory</h2>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search caretaker..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="available">Available Only</option>
        </select>
      </div>

      {/* Caretaker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCaretakers.map((c) => (
          <div key={c.id} className="p-4 border rounded shadow">
            <h3 className="font-bold text-lg">{c.name}</h3>
            <p>Skills: {c.skills.join(", ")}</p>
            <p>Rating: {c.rating}</p>
            <p>{c.available ? "Available" : "Not Available"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaretakerDirectory;


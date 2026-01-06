import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CaretakerDirectory() {
  const [search, setSearch] = useState("");

  const caretakers = [
    {
      name: "Jane Silva",
      skills: "Elderly Care, Medical Support",
      availability: "Available",
      rating: "⭐ 4.8",
      experience:
        "5 years experience providing compassionate home-based elderly care.",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "John Perera",
      skills: "Physical Therapy, Daily Assistance",
      availability: "Busy",
      rating: "⭐ 4.6",
      experience:
        "3 years experience supporting patients with mobility and therapy needs.",
      photo: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      name: "Nimal Fernando",
      skills: "Medical Support, Patient Monitoring",
      availability: "Available",
      rating: "⭐ 4.9",
      experience:
        "Former nurse assistant with 6 years of hospital patient care experience.",
      photo: "https://randomuser.me/api/portraits/men/50.jpg",
    },
    {
      name: "Tharushi Weerasinghe",
      skills: "Nutrition Guidance, Emotional Support",
      availability: "Available",
      rating: "⭐ 4.7",
      experience:
        "Expert in patient counseling and nutrition-based recovery programs.",
      photo: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    {
      name: "Kavindu Senanayake",
      skills: "Medical Checkups, House Visits",
      availability: "Busy",
      rating: "⭐ 4.5",
      experience:
        "Provides home-based medical checkups and follow-up care for patients.",
      photo: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      name: "Anjali de Silva",
      skills: "Child Care, Disability Assistance",
      availability: "Available",
      rating: "⭐ 4.8",
      experience:
        "4 years experience caring for children and patients with disabilities.",
      photo: "https://randomuser.me/api/portraits/women/60.jpg",
    },
  ];

  const filteredCaretakers = caretakers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 md:mb-0">
          Caretaker Directory
        </h1>

        <input
          type="text"
          placeholder="🔍 Search caretaker..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full md:w-72 focus:ring-2 focus:ring-green-400"
        />
      </header>

      {/* Back to Dashboard */}
      <div className="mb-6">
        <Link
          to="/patient/dashboard"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Caretaker Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCaretakers.map((c, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-blue-400"
          >
            <div className="flex flex-col items-center">
              <img
                src={c.photo}
                alt={c.name}
                className="rounded-full w-24 h-24 mb-3 border-4 border-green-300 object-cover"
              />
              <h2 className="text-xl font-semibold text-blue-800">{c.name}</h2>
              <p className="text-gray-600 text-center">{c.skills}</p>
              <p className="mt-2 font-medium text-center">
                Availability:{" "}
                <span
                  className={`${
                    c.availability === "Available"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {c.availability}
                </span>
              </p>
              <p className="text-center">{c.rating}</p>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {c.experience}
              </p>

              <div className="flex justify-center space-x-3 mt-5">
                <Link
                  to="/patient/dashboard#booking"
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
                >
                  Book
                </Link>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                  Feedback
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCaretakers.length === 0 && (
        <p className="text-center text-gray-600 mt-8">
          No caretakers found matching your search.
        </p>
      )}
    </div>
  );
}

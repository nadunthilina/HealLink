// BookingFeedback.jsx
import React, { useState } from "react";

const BookingFeedback = () => {
  const [booking, setBooking] = useState({ name: "", date: "" });
  const [bookings, setBookings] = useState([]);
  const [feedback, setFeedback] = useState({ caretaker: "", rating: "", comment: "" });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookings([...bookings, { ...booking, status: "Pending" }]);
    setBooking({ name: "", date: "" });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert(`Feedback submitted for ${feedback.caretaker}`);
    setFeedback({ caretaker: "", rating: "", comment: "" });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Booking Form */}
      <form onSubmit={handleBookingSubmit} className="space-y-2 p-4 border rounded shadow">
        <h2 className="text-xl font-bold">Request Caretaker</h2>
        <input
          type="text"
          placeholder="Caretaker Name"
          value={booking.name}
          onChange={(e) => setBooking({ ...booking, name: e.target.value })}
          className="p-2 border rounded w-full"
        />
        <input
          type="date"
          value={booking.date}
          onChange={(e) => setBooking({ ...booking, date: e.target.value })}
          className="p-2 border rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Book
        </button>
      </form>

      {/* Booking Tracker */}
      <div className="p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-2">Booking Tracker</h2>
        <ul>
          {bookings.map((b, i) => (
            <li key={i} className="p-2 bg-green-100 rounded my-1">
              {b.name} - {b.date} ({b.status})
            </li>
          ))}
        </ul>
      </div>

      {/* Feedback Form */}
      <form onSubmit={handleFeedbackSubmit} className="space-y-2 p-4 border rounded shadow">
        <h2 className="text-xl font-bold">Give Feedback</h2>
        <input
          type="text"
          placeholder="Caretaker Name"
          value={feedback.caretaker}
          onChange={(e) => setFeedback({ ...feedback, caretaker: e.target.value })}
          className="p-2 border rounded w-full"
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={feedback.rating}
          onChange={(e) => setFeedback({ ...feedback, rating: e.target.value })}
          className="p-2 border rounded w-full"
          min="1"
          max="5"
        />
        <textarea
          placeholder="Comment"
          value={feedback.comment}
          onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
          className="p-2 border rounded w-full"
        ></textarea>
        <button type="submit" className="bg-yellow-500 text-white p-2 rounded">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default BookingFeedback;


import { useState } from "react";
import ServiceCard from "./ServiceCard";

const DashboardTabs = () => {
  const tabs = ["Available Services", "Booking Status", "Notifications"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const services = [
    { title: "Daily Care Assistance", description: "Basic daily assistance for patients", status: "Available" },
    { title: "Specialized Care", description: "Specialized services by trained caretakers", status: "Busy" },
    { title: "Physiotherapy", description: "Physiotherapy sessions and rehabilitation", status: "Available" },
  ];

  const bookings = [
    { title: "Booking #1234", description: "Pending approval", status: "Pending" },
    { title: "Booking #5678", description: "Confirmed", status: "Confirmed" },
    { title: "Booking #9101", description: "Cancelled", status: "Cancelled" },
  ];

  const notifications = [
    { title: "Appointment Reminder", description: "Physiotherapy session is tomorrow" },
    { title: "New Message", description: "Dr. Smith sent you a message" },
    { title: "Lab Results", description: "Your recent test results are available" },
  ];

  const cardClass =
    "p-6 rounded-xl shadow-lg text-gray-800 w-64 transition-transform duration-300 hover:scale-105";

  return (
    <div className="mt-8 px-4 md:px-16">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-bold transition-all duration-200
              ${activeTab === tab ? "bg-gradient-to-r from-[#00BFA5] to-[#00C2CB] text-white shadow-lg" : "bg-white text-[#00A5CB] border border-[#00A5CB] hover:bg-gradient-to-r hover:from-[#00BFA5] hover:to-[#00C2CB] hover:text-white"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex gap-6 flex-wrap justify-center">
        {activeTab === "Available Services" &&
          services.map((item, idx) => (
            <div
              key={idx}
              className={`${cardClass} bg-gradient-to-tr from-[#B2EBF2] to-[#80DEEA]
`}
            >
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-sm mb-2">{item.description}</p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  item.status === "Available" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}

        {activeTab === "Booking Status" &&
          bookings.map((item, idx) => (
            <div
              key={idx}
              className={`${cardClass} bg-gradient-to-tr from-[#B2EBF2] to-[#80DEEA]

`}
            >
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-sm mb-2">{item.description}</p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  item.status === "Confirmed"
                    ? "bg-green-200 text-green-800"
                    : item.status === "Pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}

        {activeTab === "Notifications" &&
          notifications.map((item, idx) => (
            <div
              key={idx}
              className={`${cardClass} bg-gradient-to-tr from-[#B2EBF2] to-[#80DEEA]
`}
            >
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-sm">{item.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DashboardTabs;

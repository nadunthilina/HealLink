// ServiceCard.jsx
const ServiceCard = ({ title, description, status }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg w-80 h-44 p-4 relative">
      <h3 className="font-bold text-xl">{title}</h3>
      <p className="text-gray-500 mt-2">{description}</p>

      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            status === "Available" ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-sm">{status}</span>
      </div>

      <button className="absolute bottom-4 right-4 bg-blue-900 text-white px-3 py-1 rounded">
        Request
      </button>
    </div>
  );
};

export default ServiceCard;

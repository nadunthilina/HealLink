import DashboardHeader from "../../components/DashboardHeader";
import DashboardTabs from "../../components/DashboardTabs";
import ActionButton from "../../components/ActionButton";
import profileImage from "../../assets/Patient.svg";

const PatientDashboard = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <DashboardHeader
        patientName="Saman Perera"
        profileImage={<img src={profileImage} alt="Profile" />}
      />

      {/* Tabs Section */}
      <DashboardTabs />

      {/* Summary Cards */}
      <div className="flex flex-wrap justify-center gap-8 mt-12 px-6">
        <div className="border-2 border-[#00BFA5] rounded-2xl shadow-md p-6 w-64 text-center bg-gradient-to-tr from-[#E0F7FA] to-[#D0F0FF] hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-bold text-[#00A5CB] mb-2">Total Caretakers</h3>
          <p className="text-4xl font-extrabold text-[#00796B]">24</p>
          <p className="text-gray-600 mt-1 text-sm">Active this week</p>
        </div>

        <div className="border-2 border-[#00A5CB] rounded-2xl shadow-md p-6 w-64 text-center bg-gradient-to-tr from-[#E3F2FD] to-[#BBDEFB] hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-bold text-[#0066CC] mb-2">Pending Bookings</h3>
          <p className="text-4xl font-extrabold text-[#0D47A1]">5</p>
          <p className="text-gray-600 mt-1 text-sm">Awaiting confirmation</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-8 justify-center mt-16 mb-24">
        <ActionButton text="Book Caretaker" />
        <ActionButton text="Submit Feedback" />
      </div>
    </div>
  );
};

export default PatientDashboard;




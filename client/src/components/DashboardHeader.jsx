const DashboardHeader = ({ patientName, profileImage }) => {
  return (
    <div className="relative bg-white/70 backdrop-blur-md border-b border-gray-200 py-8 px-4 flex flex-col items-center">
      {/* Profile image */}
      {profileImage && (
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-400 mb-4">
          {profileImage}
        </div>
      )}

      {/* Welcome text */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#00BFA5] flex items-center justify-center gap-2">
          WELCOME <span className="text-[#0600BF]">{patientName}</span>
        </h1>
        <p className="text-[#1678F2] mt-2 text-lg">
          Here’s your dashboard at a glance
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;



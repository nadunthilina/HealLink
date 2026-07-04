import Schedule from "../models/Schedule.js";
import Caretaker from "../models/Caretaker.js";
import { createNotification } from "../utils/notificationHelper.js";
import mongoose from "mongoose";



export async function getAssignedPatients(req, res) {
    try {
        const { caretakerId } = req.params;
        if (!caretakerId) {
            return res.status(400).json({ message: "caretakerId is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(caretakerId)) {
            return res.status(400).json({ message: "Invalid caretakerId format" });
        }

        const caretaker = await Caretaker.findOne({ userId: caretakerId }).lean();
        if (!caretaker) {
            return res.status(200).json([]);
        }

        const schedules = await Schedule.find({ caretakerId: caretaker._id })
            .populate(
                "patientId",
                "patientId name age phone address emergencyContact notes",
            )
            .sort({ startDate: -1 })
            .lean();

        const result = schedules.map((s) => ({
            _id: s._id,
            scheduleId: s._id,
            startDate: s.startDate,
            startTime: s.startTime,
            dayType: s.dayType,
            wardNo: s.wardNo,
            status: s.status,
            dailyRate: s.dailyRate,
            paymentToAgency: s.paymentToAgency,
            paymentToCaretaker: s.paymentToCaretaker,
            jobCompletedByAdmin: s.jobCompletedByAdmin,
            adminNote: s.adminNote,
            patient: s.patientId
                ? {
                    _id: s.patientId._id,
                    patientId: s.patientId.patientId,
                    name: s.patientId.name,
                    age: s.patientId.age,
                    phone: s.patientId.phone,
                    address: s.patientId.address,
                    emergencyContact: s.patientId.emergencyContact,
                    condition: s.patientId.notes || null,
                    medications: [],
                }
                : null,
        }));

        res.json(result);
    } catch (err) {
        console.error("getAssignedPatients error:", err);
        res.status(500).json({ message: "Server error" });
    }
}
export const updateScheduleStatus = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { status } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { status },
      { new: true },
    );

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found",
      });
    }

    res.status(200).json({
      message: "Status updated successfully",
      schedule,
    });
  } catch (error) {
    console.error("Update status error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

import UserDetails from "../models/userDetails.js";

export const getAvailability = async (req, res) => {
  try {
    const { userId } = req.params;

    const caretaker = await UserDetails.findOne({ userId });

    if (!caretaker) {
      return res.status(404).json({
        success: false,
        message: "Caretaker not found",
      });
    }

    res.status(200).json({
      success: true,
      availability: caretaker.availability,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { userId } = req.params;
    const { availability } = req.body;

    const caretaker = await UserDetails.findOneAndUpdate(
      { userId },
      { availability },
      { new: true }
    );

    if (!caretaker) {
      return res.status(404).json({
        success: false,
        message: "Caretaker not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      availability: caretaker.availability,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
import Caretaker from "../models/Caretaker.js";

export const getAvailability = async (req, res) => {
  try {
    const { userId } = req.params;

    const caretaker = await Caretaker.findOne({ userId });

    if (!caretaker) {
      return res.status(404).json({
        success: false,
        message: "Caretaker not found",
      });
    }

    res.status(200).json({
      success: true,
      status: caretaker.status,
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
    const { status } = req.body;

    const caretaker = await Caretaker.findOneAndUpdate(
      { userId },
      { status },
      { new: true, runValidators: true }
    );

    if (!caretaker) {
      return res.status(404).json({
        success: false,
        message: "Caretaker not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      status: caretaker.status,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

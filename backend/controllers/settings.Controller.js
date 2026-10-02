
import User from "../models/User.model.js";

export const getAccountInformation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name email")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Get account information error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load account information",
    });
  }
};


// Get pharmacy information
export const getPharmacyInformation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("pharmacyName")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        pharmacyName: user.pharmacyName || "",
      },
    });
  } catch (error) {
    console.error("Get pharmacy information error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load pharmacy information",
    });
  }
};


// Update pharmacy information
export const updatePharmacyInformation = async (req, res) => {
  try {
    const { pharmacyName } = req.body;

    if (!pharmacyName || !pharmacyName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Pharmacy name is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        pharmacyName: pharmacyName.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("pharmacyName")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pharmacy information updated successfully",
      data: {
        pharmacyName: user.pharmacyName,
      },
    });
  } catch (error) {
    console.error("Update pharmacy information error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update pharmacy information",
    });
  }
};

const User = require("../../models/User");
const bcrypt = require("bcrypt");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Respond with success (return user info or token if using JWT)
    return res
      .status(200)
      .json({
        message: "Login successful!",
        user: { email: user.email, role: user.role },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

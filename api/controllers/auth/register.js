const User = require("../../models/User");
const { sendEmail } = require("../../services/email");
const bcrypt = require("bcrypt"); // Added bcrypt

exports.registerUser = async (req, res) => {
    const { email, password, role, cv, materials } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password

        const newUser = new User({
            email,
            password: hashedPassword, // Store the hashed password
            role,
            cv: role === "instructor" ? cv : undefined,
            materials: role === "instructor" ? materials : undefined,
        });

        await newUser.save();

        // Send confirmation email
        await sendEmail(
            email,
            "Welcome!",
            "Thank you for registering on our platform."
        );

        return res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
};

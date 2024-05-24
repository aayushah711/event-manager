const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const registerValidator = require("../validators/registerValidator");
const loginValidator = require("../validators/loginValidator");

exports.register = async (req, res) => {
  try {
    const { error } = registerValidator.validate(req.body);
    if (error) return res.status(400).json({ error: error.details });

    const { email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword, role });
    await user.save();

    // Send confirmation email
    // await sendEmail(
    //   email,
    //   "Registration Confirmation",
    //   "You have successfully registered!"
    // );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = loginValidator.validate(req.body);
    if (error) return res.status(400).json({ error: error.details });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid Email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid Password" });

    if (process.env.API_SECRET) {
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.API_SECRET,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ token });
    }

    res.status(500).json({
      error:
        "Unable to login user at the moment. Please try again after sometime!",
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

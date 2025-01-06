import bcrypt from "bcrypt";
import User from "./src/models/User.js";

const createAdmin = async () => {
  const adminEmail = "admin@example.com";
  const adminPassword = "password";

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = new User({
      nom: "Admin",
      prenom: "User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }
};

export default createAdmin;

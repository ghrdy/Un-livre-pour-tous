// back/src/middleware/isAdmin.js
const isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied (isAdmin)" });
  }
};

export default isAdmin;

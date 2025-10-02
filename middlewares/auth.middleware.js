import jwt from "jsonwebtoken";

export const authMiddleware = async function (req, res, next) {
  try {
    const tokenHeader = req.headers["authorization"];
    if (!tokenHeader) {
      return next();
    }

    if (!tokenHeader.startsWith("Bearer")) {
      return res
        .status(400)
        .json({ error: "Authorization must be starts with bearer" });
    }

    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    next();
  }
};

export const ensureAuthenticated = async function (req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Access Denied❌" });
  }
  next();
};

export const restrictToRole = function (role) {
  return function (req, res, next) {
    if (req.user.role !== role) {
      return res.status(401).json({ erroe: "Not Authorized🚫" });
    }
    return next();
  };
};


export const adminOnly = (req, res, next) => {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    return res.status(503).json({
      message: "Admin authentication is not configured"
    });
  }

  if (req.get("x-admin-key") !== adminKey) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  next();
};

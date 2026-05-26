export default function auth(req, res, next) {
  const key = req.headers["authorization"]?.replace("Bearer ", "");
  if (!key || key !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

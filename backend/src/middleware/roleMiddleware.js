// backend/src/middleware/roleMiddleware.js
export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: 'Forbidden: insufficient permissions',
                requiredRoles: allowedRoles,
                currentRole: userRole,
            });
        }

        return next();
    };
}

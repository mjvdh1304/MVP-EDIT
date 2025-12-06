import jwt from 'jsonwebtoken';
import { config } from '../config.js';
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ error: 'Missing authorization token' });
        return;
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
export function adminMiddleware(req, res, next) {
    if (req.userRole !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }
    next();
}
export function optionalAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (token) {
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            req.userId = decoded.userId;
            req.userRole = decoded.role;
        }
        catch (error) {
            // Token is invalid, continue without auth
        }
    }
    next();
}
//# sourceMappingURL=auth.js.map
import dotenv from 'dotenv';

dotenv.config();

// Helper function to encode username/password for MongoDB URI
const encodeMongoCredentials = (uri: string): string => {
    if (!uri.startsWith('mongodb+srv://') && !uri.startsWith('mongodb://')) {
        return uri;
    }
    
    // Find the last @ which separates credentials from host
    // This handles cases where username contains @ (like email addresses)
    const protocolMatch = uri.match(/^(mongodb\+?srv?:\/\/)/);
    if (!protocolMatch) {
        return uri;
    }
    
    const protocol = protocolMatch[1];
    const afterProtocol = uri.substring(protocol.length);
    
    // Find the last @ before the host (should be after username:password)
    const lastAtIndex = afterProtocol.lastIndexOf('@');
    if (lastAtIndex === -1) {
        return uri; // No @ found, return as-is
    }
    
    const credentials = afterProtocol.substring(0, lastAtIndex);
    const rest = afterProtocol.substring(lastAtIndex + 1);
    
    // Split credentials into username and password (split on the LAST colon)
    const lastColonIndex = credentials.lastIndexOf(':');
    if (lastColonIndex === -1) {
        // No password, just username
        const encodedUsername = encodeURIComponent(credentials);
        return `${protocol}${encodedUsername}@${rest}`;
    }
    
    const username = credentials.substring(0, lastColonIndex);
    const password = credentials.substring(lastColonIndex + 1);
    
    // URL encode username and password (especially important for emails with @)
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    
    return `${protocol}${encodedUsername}:${encodedPassword}@${rest}`;
};

// Helper function to sanitize MongoDB URI - removes port numbers from mongodb+srv URIs
const sanitizeMongoUri = (uri: string): string => {
    let sanitized = uri;
    
    if (uri.startsWith('mongodb+srv://')) {
        // Remove port numbers from mongodb+srv URIs (they're not allowed)
        // Pattern: @hostname:port -> @hostname
        sanitized = sanitized.replace(/@([^:/]+):(\d+)(\/|\?|$)/g, '@$1$3');
    }
    
    return sanitized;
};

const rawMongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
// First encode credentials, then sanitize
const encodedUri = encodeMongoCredentials(rawMongoUri);
const mongoUri = sanitizeMongoUri(encodedUri);

// Debug: Log the connection string (without password) for troubleshooting
if (process.env.NODE_ENV === 'development') {
    // Mask password in the connection string for logging
    // Pattern: protocol://encodedUsername:encodedPassword@host
    const maskedUri = mongoUri.replace(/(mongodb\+?srv?:\/\/[^:]+):([^@]+)@/, '$1:***@');
    console.log('🔗 MongoDB URI:', maskedUri);
    
    // Check if there's still a port number (which would cause the error)
    if (mongoUri.includes('mongodb+srv://') && /@[^:]+:\d+/.test(mongoUri)) {
        console.warn('⚠️  WARNING: Port number detected in mongodb+srv URI. This will cause connection errors.');
        console.warn('   Attempting to remove port number...');
    }
}

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    mongoUri: mongoUri,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    adminCredentials: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
    },
};

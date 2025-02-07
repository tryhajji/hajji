import { Client, Account, Databases, Teams, ID, OAuthProvider } from 'appwrite';
import { UserRole} from './contexts/AppContext';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || '')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// Team IDs - these should match the teams created in Appwrite console
export const ADMIN_TEAM_ID = 'admin';
export const AGENCY_TEAM_ID = 'agency';
export const UMRAH_GROUP_TEAM_ID = 'umrah_group';
export const CLIENT_TEAM_ID = 'client';

if (!appwriteEndpoint || !appwriteProjectId) {
    throw new Error('Missing Appwrite configuration. Please check your .env file.');
}

export const account = new Account(client);
export const databases = new Databases(client);
export const teams = new Teams(client);

// Auth methods
export const createAccount = async (email: string, password: string, name: string, role: 'admin' | 'agency' | 'umrah_group' | 'client' = 'client') => {
    try {
        // Create the user account
        const user = await account.create(ID.unique(), email, password, name);
        
        // Create a session for the new user
        await account.createSession(email, password);
        
        // Add user to appropriate team based on role
        let teamId;
        switch (role) {
            case 'admin':
                teamId = ADMIN_TEAM_ID;
                break;
            case 'agency':
                teamId = AGENCY_TEAM_ID;
                break;
            case 'umrah_group':
                teamId = UMRAH_GROUP_TEAM_ID;
                break;
            case 'client':
            default:
                teamId = CLIENT_TEAM_ID;
                break;
        }
        
        await teams.createMembership(
            teamId,
            [],
            `${window.location.origin}/auth-callback`,
            user.$id,
            user.email
        );
        
        return user;
    } catch (error) {
        console.error('Create account error:', error);
        throw error;
    }
};

export const login = async (email: string, password: string) => {
    try {
        const session = await account.createSession(email, password);
        return session;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        if (!user) return null;

        const memberships = await teams.list();
        const preferences = await account.getPrefs();
        
        let role: UserRole = 'client';
        for (const membership of memberships.teams) {
            if (membership.$id === ADMIN_TEAM_ID) {
                role = 'admin';
                break;
            } else if (membership.$id === AGENCY_TEAM_ID) {
                role = 'agency';
                break;
            } else if (membership.$id === UMRAH_GROUP_TEAM_ID) {
                role = 'umrah_group';
                break;
            }
        }
        
        return {
            ...user,
            role,
            firstName: preferences.firstName || '',
            lastName: preferences.lastName || ''
        };
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
};

export const logout = async () => {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const loginWithGoogle = async () => {
    try {
        await account.createOAuth2Session(
            OAuthProvider.Google,
            `${window.location.origin}/auth-callback`,
            `${window.location.origin}/auth-callback?error=true`
        );
    } catch (error) {
        console.error('Google login error:', error);
        throw error;
    }
};

// Profile update methods
export const updateName = async (name: string) => {
    try {
        const response = await account.updateName(name);
        return response;
    } catch (error) {
        console.error('Update name error:', error);
        throw error;
    }
};

export const updateEmail = async (email: string, password: string) => {
    try {
        const response = await account.updateEmail(email, password);
        return response;
    } catch (error) {
        console.error('Update email error:', error);
        throw error;
    }
};

export const updatePassword = async (password: string, oldPassword?: string) => {
    try {
        const response = await account.updatePassword(password, oldPassword);
        return response;
    } catch (error) {
        console.error('Update password error:', error);
        throw error;
    }
};

// Password reset
export const requestPasswordReset = async (email: string) => {
    try {
        await account.createRecovery(
            email,
            `${window.location.origin}/reset-password`
        );
        return true;
    } catch (error) {
        console.error('Password reset request error:', error);
        throw error;
    }
};

// Password reset confirmation function
export const confirmPasswordReset = async (
    userId: string, 
    secret: string, 
    newPassword: string, 
    confirmPassword: string
) => {
    // Validate that the new password and confirmation password match
    if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match.'); // Throw an error if they don't match
    }

    try {
        // Call the Appwrite account method to update the password
        await account.updateRecovery(userId, secret, newPassword);
        return true; // Indicate success
    } catch (error) {
        console.error('Confirm password reset error:', error); // Log the error for debugging
        throw error; // Rethrow the error for handling in the calling function
    }
};

// Role management methods
export const getUserRole = async () => {
    try {
        const memberships = await teams.list();
        
        if (memberships.teams.some(team => team.$id === ADMIN_TEAM_ID)) {
            return 'admin';
        }
        if (memberships.teams.some(team => team.$id === AGENCY_TEAM_ID)) {
            return 'agency';
        }
        if (memberships.teams.some(team => team.$id === UMRAH_GROUP_TEAM_ID)) {
            return 'umrah_group';
        }
        return 'client';
    } catch (error) {
        console.error('Get user role error:', error);
        return null;
    }
};

export const hasPermission = async (requiredRole: 'admin' | 'agency' | 'umrah_group' | 'client') => {
    const role = await getUserRole();
    
    switch (requiredRole) {
        case 'admin':
            return role === 'admin';
        case 'agency':
            return role === 'admin' || role === 'agency';
        case 'umrah_group':
            return role === 'admin' || role === 'umrah_group';
        case 'client':
            return true; // Everyone has client permissions
        default:
            return false;
    }
};

export const createUser = async (userData: {
    email: string;
    password: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    agencyName?: string;
    groupName?: string;
    leaderName?: string;
    organizationName?: string;
    phoneNumber?: string;
    licenseNumber?: string;
    address?: string;
    city?: string;
    country?: string;
    description?: string;
}) => {
    try {
        const name = userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}`
            : userData.agencyName 
                ? userData.agencyName
                : userData.groupName 
                    ? userData.groupName
                    : userData.email.split('@')[0];

        const user = await createAccount(
            userData.email,
            userData.password,
            name,
            userData.role
        );

        // Store additional user data in preferences or a separate database collection if needed
        const preferences: { [key: string]: any } = {};
        
        if (userData.firstName) preferences.firstName = userData.firstName;
        if (userData.lastName) preferences.lastName = userData.lastName;
        if (userData.agencyName) preferences.agencyName = userData.agencyName;
        if (userData.groupName) preferences.groupName = userData.groupName;
        if (userData.leaderName) preferences.leaderName = userData.leaderName;
        if (userData.organizationName) preferences.organizationName = userData.organizationName;
        if (userData.phoneNumber) preferences.phoneNumber = userData.phoneNumber;
        if (userData.licenseNumber) preferences.licenseNumber = userData.licenseNumber;
        if (userData.address) preferences.address = userData.address;
        if (userData.city) preferences.city = userData.city;
        if (userData.country) preferences.country = userData.country;
        if (userData.description) preferences.description = userData.description;

        if (Object.keys(preferences).length > 0) {
            await account.updatePrefs(preferences);
        }

        return user;
    } catch (error) {
        console.error('Create user error:', error);
        throw error;
    }
}; 
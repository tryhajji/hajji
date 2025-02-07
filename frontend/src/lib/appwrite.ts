import { Client, Account, Teams, Databases } from 'appwrite';


// Team IDs
export const ADMIN_TEAM_ID = 'admin';
export const AGENCY_TEAM_ID = 'agency';
export const UMRAH_GROUP_TEAM_ID = 'umrah_group';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || '')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const teams = new Teams(client);
export const databases = new Databases(client);

// Role checking functions
export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        return user;
    } catch {
        return null;
    }
};

export const getUserRole = async () => {
    try {
        const user = await getCurrentUser();
        if (!user) return null;

        // Get user's team memberships
        const memberships = await teams.list();
        console.log('Team memberships:', memberships); // Debug log
        
        // Check team memberships in order of priority
        if (memberships.teams.some(team => team.$id === ADMIN_TEAM_ID)) {
            console.log('User is admin'); // Debug log
            return 'admin';
        }
        if (memberships.teams.some(team => team.$id === AGENCY_TEAM_ID)) {
            console.log('User is agency'); // Debug log
            return 'agency';
        }
        if (memberships.teams.some(team => team.$id === UMRAH_GROUP_TEAM_ID)) {
            console.log('User is umrah_group'); // Debug log
            return 'umrah_group';
        }
        
        console.log('User is regular user'); // Debug log
        return 'user';
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
};

export const hasPermission = async (requiredRole: string): Promise<boolean> => {
    const role = await getUserRole();
    if (!role) return false;

    switch (requiredRole) {
        case 'admin':
            return role === 'admin';
        case 'agency':
            return role === 'admin' || role === 'agency';
        case 'umrah_group':
            return role === 'admin' || role === 'umrah_group';
        default:
            return true;
    }
}; 
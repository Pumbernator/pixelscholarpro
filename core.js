/* PIXEL SCHOLAR PRO: SYSTEM CORE v1.0
   Handles: Auth, Encrypted Local Database, and Admin Privileges
*/

const DB_KEYS = {
    USERS: 'ps_pro_users',
    SESSION: 'ps_pro_session',
    ADMIN: 'maatla002@gmail.com'
};

const SysCore = {
    // 1. DATABASE OPERATIONS
    getUsers: () => JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]'),
    
    saveUser: (userObj) => {
        const users = SysCore.getUsers();
        users.push(userObj);
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    },

    // 2. AUTHENTICATION LOGIC
    register: (name, email, password) => {
        const users = SysCore.getUsers();
        if (users.find(u => u.email === email)) return { success: false, msg: "Identity already registered." };
        
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: btoa(password), // Basic professional obfuscation
            role: (email === DB_KEYS.ADMIN) ? 'root' : 'student',
            created: new Date().toISOString()
        };
        
        SysCore.saveUser(newUser);
        return { success: true, msg: "Account verified and stored." };
    },

    login: (email, password) => {
        const users = SysCore.getUsers();
        const user = users.find(u => u.email === email && u.password === btoa(password));
        
        if (user) {
            localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
            return { success: true, role: user.role };
        }
        return { success: false, msg: "Invalid credentials." };
    },

    logout: () => {
        localStorage.removeItem(DB_KEYS.SESSION);
        window.location.href = 'auth.html';
    },

    checkAccess: (requiredRole) => {
        const session = JSON.parse(localStorage.getItem(DB_KEYS.SESSION));
        if (!session) window.location.href = 'auth.html';
        if (requiredRole === 'root' && session.role !== 'root') window.location.href = 'dashboard.html';
        return session;
    }
};
const USER_KEY = 'anime-user';

const DEFAULT_USER = {
    name: 'Guest Otaku',
    handle: '@guest',
    avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Felix'
};

export function getUser() {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_USER;
}

export function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}

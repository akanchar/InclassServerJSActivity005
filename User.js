class User {
    static BASE_API_URL = 'https://randomuser.me/api/';
    static BASE_PICTURE_URL = 'https://randomuser.me/api/portraits/';

    constructor(gender, name) {
        this.name = name;
        this.id = User.generateRandomId();
        this.gender = gender;
    }

    static generateRandomId() {
        return Math.floor(Math.random() * 100);
    }

    static formatGender(gender) {
        return gender === 'male' ? 'men' : 'women';
    }

    getProfilePictureUrl() {
        return `${User.BASE_PICTURE_URL}${this.gender}/${this.id}.jpg`;
    }

    static async fetchUserData(gender) {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`${User.BASE_API_URL}?inc=gender,name&gender=${gender}&nat=US`);
        const data = await response.json();
        return data.results ? data.results[0] : null;
    }

    static async createRandomUser() {
        const gender = Math.random() < 0.5 ? 'male' : 'female';
        try {
            const userData = await User.fetchUserData(gender);
            if (userData && userData.name && userData.name.first) {
                return new User(User.formatGender(gender), userData.name.first);
            } else {
                throw new Error('Invalid user data from API');
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            return new User(User.formatGender(gender), 'Guest');
        }
    }

    toJSON() {
        return {
            name: this.name,
            id: this.id,
            gender: this.gender,
            profilePictureUrl: this.getProfilePictureUrl(),
        };
    }
}

module.exports = User;
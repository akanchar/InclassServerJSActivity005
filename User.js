class User {
    constructor(gender, name) {
        this.name = name;
        this.id = Math.floor(Math.random() * 100);
        this.gender = gender === 'male' ? 'men' : 'women';
    }

    getProfilePictureUrl() {
        return https://randomuser.me/api/portraits/${this.gender}/${this.id}.jpg;
    }

    static async createRandomUser() {
        const gender = Math.random() < 0.5 ? 'male' : 'female';
        try {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch(https://randomuser.me/api/?inc=gender,name,nat&gender=${gender}&nat=US);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const userName = data.results[0]?.name?.first;
                if (!userName) {
                    throw new Error('Could not retrieve user name from API');
                }
                return new User(gender, userName);
            } else {
                throw new Error('No user data returned from the API');
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            return new User(gender, 'Guest');
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
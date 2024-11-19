class User {
    constructor(name) {
        this.name = name;
        this.randomNumber = Math.floor(Math.random() * 100) + 1;
        this.profilePic = this.randomNumber % 2 === 0
            ? `https://randomuser.me/api/portraits/men/${this.randomNumber}.jpg`
            : `https://randomuser.me/api/portraits/women/${this.randomNumber}.jpg`;
    }
}

module.exports = User;
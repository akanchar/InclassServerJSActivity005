class User {
    constructor(name) {
        this.name = name;
        this.randomNumber = Math.floor(Math.random() * 100) + 1;
        
        if (this.randomNumber % 2 === 0) {
            this.profilePic = `https://randomuser.me/api/portraits/men/${this.randomNumber}.jpg`;
        } else {
            this.profilePic = `https://randomuser.me/api/portraits/women/${this.randomNumber}.jpg`;
        }
    }
}

module.exports = User; 
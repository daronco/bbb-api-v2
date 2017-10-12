class User {
    constructor(params) {
        this.userId = params.userId;
        this.uniqueMeetingId = params.uniqueMeetingId;
        this.fullName = params.fullName;
        this.role = params.role;
        this.isPresenter = false;
        this.isListeningOnly = false;
        this.hasJoinedVoice = false;
        this.hasVideo = false;
        this.uniqueUserId = `${this.userId}-${new Date().getTime()}`;
        console.log("Creating the user:", this);
    }

    static all() {
        return Object.values(allUsers);
    }

    static find(uniqueUserId) {
        return allUsers[uniqueUserId];
    }
}

var allUsers = [1, 2, 3, 4, 5].map(
    i => new User({userId: `user-${i}`, fullName: `User ${i}`, uniqueMeetingId: require('./meeting').any().uniqueMeetingId})
).reduce((acc, item, _) => {
    acc[item.uniqueUserId] = item;
    return acc;
}, {});

module.exports = User;

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

var allUsers = [];

module.exports = User;

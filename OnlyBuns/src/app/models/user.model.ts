
export class User {
    id: number;
    firstname: String;
    lastname: String;
    email: String;
    numberOfPosts: String;
    numberOfFollowedAccounts: String;
    username: String;

    constructor(
        id: number,
        firstname: String,
        lastname: String,
        email: String,
        numberOfPosts: String,
        numberOfFollowedAccounts: String,
        username: String
    ) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.numberOfFollowedAccounts = numberOfFollowedAccounts;
        this.numberOfPosts = numberOfPosts;
        this.username=username;
    }
}

export class User {
    id: number;
    firstname: String;
    lastname: String;
    email: String;
    numberOfPosts: String;
    followingCount: String;
    username: String;
    userFollowedByMe:boolean = false;
    constructor(
        id: number,
        firstname: String,
        lastname: String,
        email: String,
        numberOfPosts: String,
        followingCount: String,
        username: String,
        userFollowedByMe:boolean
    ) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.followingCount = followingCount;
        this.numberOfPosts = numberOfPosts;
        this.username=username;
        this.userFollowedByMe=userFollowedByMe;
    }
}
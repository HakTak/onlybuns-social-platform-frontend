
export class User {
    id: number;
    firstname: String;
    lastname: String;
    email: String;
    numberOfPosts: String;
    followingCount: String;
    username: String;
    isUserFollowedByMe:boolean = false;
    constructor(
        id: number,
        firstname: String,
        lastname: String,
        email: String,
        numberOfPosts: String,
        followingCount: String,
        username: String,
        isUserFollowedByMe:boolean
    ) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.followingCount = followingCount;
        this.numberOfPosts = numberOfPosts;
        this.username=username;
        this.isUserFollowedByMe=isUserFollowedByMe;
    }
}
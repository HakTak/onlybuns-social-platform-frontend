
export class User {
    id: number;
    firstname: String;
    lastname: String;
    email: String;
    numberOfPosts: String;
    username: String;
    userFollowedByMe:boolean = false;
    followersCount:number;
    followingCount:number;
    constructor(
        id: number,
        firstname: String,
        lastname: String,
        email: String,
        numberOfPosts: String,
        username: String,
        userFollowedByMe:boolean,
        followersCount:number,
        followingCount:number,
    ) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.followingCount = followingCount;
        this.numberOfPosts = numberOfPosts;
        this.username=username;
        this.userFollowedByMe=userFollowedByMe;
        this.followersCount=followersCount;
    }
}
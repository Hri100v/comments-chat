import { makeRequest } from "./makeReqest";

export function getPosts() {
    console.log("getPosts()");
    // debugger;
    return makeRequest("/posts");
};
import {
  SIMPLE_ACTION,
  POST_REQUEST,
  PUT_REQUEST,
  DELETE_REQUEST
} from "./actionTypes";
import { get, post, put, deleteReq } from "../../http";

export function simpleAction() {
  return async dispatch => {
    let payload = "SOMETHING";
    try {
      payload = await get("https://jsonplaceholder.typicode.com/todos/1");
      console.log(payload);
    } catch (error) {
      payload = error;
    }
    dispatch({ type: SIMPLE_ACTION, payload: payload });
  };
}

export function postRequest() {
  return async dispatch => {
    let payload = "SOMETHING";
    try {
      payload = await post("https://jsonplaceholder.typicode.com/posts", {
        title: "foo",
        body: "bar",
        userId: 1
      });
      console.log(payload);
    } catch (error) {
      payload = error;
    }
    dispatch({ type: POST_REQUEST, payload: payload });
  };
}

export function putRequest() {
  return async dispatch => {
    let payload = "SOMETHING";
    try {
      payload = await put("https://jsonplaceholder.typicode.com/posts/1", {
        id: 1,
        title: "foo",
        body: "bar",
        userId: 1
      });
      console.log(payload);
    } catch (error) {
      payload = error;
    }
    dispatch({ type: PUT_REQUEST, payload: payload });
  };
}

export function deleteRequest() {
  return async dispatch => {
    let payload = "SOMETHING";
    try {
      payload = await deleteReq("https://jsonplaceholder.typicode.com/posts/1");
      console.log(payload);
    } catch (error) {
      payload = error;
    }
    dispatch({ type: DELETE_REQUEST, payload: payload });
  };
}
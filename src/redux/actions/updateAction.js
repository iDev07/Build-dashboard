import api from "../../utility/api";
import { getAction } from "./readAction";
import { GET_NEWS } from "./types";

export const updateAction =
  (path, actionType, id, data) => async (dispatch) => {
    try {
      const res = await api.put(`${path}/${id}`, data);

      dispatch({
        type: actionType,
        payload: res.data,
      });
      if (path === "news") {
        dispatch(getAction("news", GET_NEWS));
      }
    } catch (err) {
      console.log(err);
    }
  };

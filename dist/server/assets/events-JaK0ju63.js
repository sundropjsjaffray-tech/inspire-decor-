import { u as useStore } from "./index-DpiVUCS0.js";
import { d as delay } from "./util-D5Y4JTPp.js";
async function getEvents() {
  await delay();
  return useStore.getState().events;
}
export {
  getEvents as g
};

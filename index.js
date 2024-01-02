// import "./node_modules/data-layer-helper/dist/data-layer-helper.js";
// for more info about this package see https://www.npmjs.com/package/data-layer-helper
import { DataLayerHelper } from "./customHelper.js";
const publish = (event) => {
  console.log(event);
  const data = event === null || event === void 0 ? void 0 : event.eventData;
  if ((data === null || data === void 0 ? void 0 : data.action) === "start") {
    console.log(
      "starting: ",
      data === null || data === void 0 ? void 0 : data.name
    );
  } else if (
    (data === null || data === void 0 ? void 0 : data.action) === "stop"
  ) {
    console.log(
      "stopping: ",
      data === null || data === void 0 ? void 0 : data.name
    );
  }
};
const dataLayer = window["dataLayer"];
dataLayer.push({ eventData: { name: "exp0-past", action: "start" } });
function listener(message) {
  const messageWithType = Object.assign(Object.assign({}, message), {
    type: "onDataLayerEvent",
  });
  publish(messageWithType);
}
const helper = new DataLayerHelper(dataLayer, listener);
dataLayer.push(
  { eventData: { name: "exp1", action: "start" } },
  { eventData: { name: "exp2", action: "start" } }
);
dataLayer.push(
  { eventData: { name: "exp1", action: "stop" } },
  { eventData: { name: "exp3", action: "start" } }
);
dataLayer.push(
  { eventData: { name: "exp2", action: "stop" } },
  { eventData: { name: "exp3", action: "stop" } }
);
dataLayer.push({ eventData: { name: "exp4", action: "stop" } });

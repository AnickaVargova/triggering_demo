// @ts-nocheck
import "./node_modules/data-layer-helper/dist/data-layer-helper.js";
const publish = (event) => {
    console.log(event);
    const data = event === null || event === void 0 ? void 0 : event.eventData;
    if ((data === null || data === void 0 ? void 0 : data.action) === 'start') {
        console.log('starting: ', data === null || data === void 0 ? void 0 : data.name);
    }
    else if ((data === null || data === void 0 ? void 0 : data.action) === 'stop') {
        console.log('stopping: ', data === null || data === void 0 ? void 0 : data.name);
    }
};
const dispatchTriggeringEvent = (event) => {
    publish(event);
};
dataLayer.push({ eventData: { name: "exp4", action: "start" } });
function listener(model, message) {
    const messageWithType = Object.assign(Object.assign({}, message), { type: 'onDataLayerEvent' });
    dispatchTriggeringEvent(messageWithType);
}
// last argument is set to true if we want to listen to past events as well
const helper = new DataLayerHelper(dataLayer, listener, true);
dataLayer.push({ eventData: { name: "exp1", action: "start" } }, { eventData: { name: "exp2", action: "start" } });
dataLayer.push({ eventData: { name: "exp1", action: "stop" } }, { eventData: { name: "exp3", action: "start" } });
dataLayer.push({ eventData: { name: "exp2", action: "stop" } }, { eventData: { name: "exp3", action: "stop" } });
dataLayer.push({ eventData: { name: "exp4", action: "stop" } }); // multiple or single events can be pushed

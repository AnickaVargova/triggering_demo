// @ts-nocheck
import "./node_modules/data-layer-helper/dist/data-layer-helper.js";
const experiments = [
    {
        id: "exp1",
        start: "event0-already happened",
        stop: "event2",
    },
    {
        id: "exp2",
        start: "event1",
        stop: "event2",
    },
    {
        id: "exp3",
        start: "event2",
        stop: "event1",
    },
    {
        id: "exp4",
        start: "event2",
        stop: "event1",
    },
];
const checkTriggering = (event) => {
    const shouldStart = experiments.filter((item) => item.start === event.name);
    const shouldStop = experiments.filter((item) => item.stop === event.name);
    return [shouldStart, shouldStop];
};
const startExperiments = (shouldStart) => {
    for (let exp of shouldStart) {
        // applying experiment
        console.log("starting", exp.id);
    }
};
const stopExperiments = (shouldStop) => {
    for (let exp of shouldStop) {
        //reverting experiment
        console.log("stopping", exp.id);
    }
};
const dispatchTriggeringEvent = (event) => {
    console.log(event);
    if (event.type === "onDataLayerEvent") {
        const [shouldStart, shouldStop] = checkTriggering(event);
        startExperiments(shouldStart);
        stopExperiments(shouldStop);
    }
};
dataLayer.push({ name: "event0-already happened", type: "onDataLayerEvent" });
function listener(model, message) {
    dispatchTriggeringEvent(message);
}
// last argument is set to true if we want to listen to past events as well
const helper = new DataLayerHelper(dataLayer, listener, true);
dataLayer.push({ name: "event1", type: "onDataLayerEvent" }, { name: "event2", type: "onDataLayerEvent" }); // multiple or single events can be pushed

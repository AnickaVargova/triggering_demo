// @ts-nocheck

interface TriggerEvent {
  type: "onPageLoad" | "onUrlChange" | "onDataLayerEvent";
  name: string;
}

interface Experiment {
  id: string;
  start: string;
  stop: string;
}

// to be replaced by real experiments with actual properties
const experiments = [
  {
    id: "exp1",
    start: "event1",
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

const checkTriggering = (event: TriggerEvent) => {
  const shouldStart = experiments.filter((item) => item.start === event.name);
  const shouldStop = experiments.filter((item) => item.stop === event.name);
  return [shouldStart, shouldStop];
};

const startExperiments = (shouldStart: Experiment[]) => {
  for (let exp of shouldStart) {
    // applying experiment
    console.log("starting", exp.id);
  }
};

const stopExperiments = (shouldStop: Experiment[]) => {
  for (let exp of shouldStop) {
    //reverting experiment
    console.log("stopping", exp.id);
  }
};

if (!window.dataLayer) {
  window.dataLayer = [];
}

// for nodemon only
// const dataLayer = [];

const decorateDataLayer = () => {
  dataLayer.push = function () {

    Array.prototype.push.apply(this, arguments);

    // todo: process only relevant events, not all arguments to push; after being processed the argument should be removed from the datalayer 
    for (let arg of arguments) {
      dispatchTriggeringEvent({ ...arg, type: "onDataLayerEvent" });
    }
  };
};

decorateDataLayer();

const dispatchTriggeringEvent = (event: TriggerEvent) => {
  console.log(event);

  if (event.type === "onDataLayerEvent") {
    const [shouldStart, shouldStop] = checkTriggering(event);
    startExperiments(shouldStart);
    stopExperiments(shouldStop);
  }
};

dataLayer.push({ name: "event1" }, { name: "event4" }); // multiple events can be pushed
dataLayer.push({ name: "event2" });
dataLayer.push({ name: "event3" });

console.log(dataLayer);

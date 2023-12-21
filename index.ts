// @ts-nocheck
import "./node_modules/data-layer-helper/dist/data-layer-helper.js";
// for more info about this package see https://www.npmjs.com/package/data-layer-helper

interface TriggerEvent {
  eventType: "onPageLoad" | "onUrlChange" | "onDataLayerEvent";
  eventData: any;
}

const publish = (event: TriggerEvent) => {
  console.log(event);
  const data = event?.eventData;
  if(data?.action === 'start') {
    console.log('starting: ', data?.name);
  }
  else if(data?.action === 'stop') {
    console.log('stopping: ', data?.name);
  }
}

const dispatchTriggeringEvent = (event: TriggerEvent) => {
  publish(event);
};

dataLayer.push({ eventData: { name: "exp4", action: "start" } }); 

function listener(model, message) {
  const messageWithType = {...message, type: 'onDataLayerEvent'};
  dispatchTriggeringEvent(messageWithType);
}

// last argument is set to true if we want to listen to past events as well
const helper = new DataLayerHelper(dataLayer, listener, true);

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
dataLayer.push({ eventData: { name: "exp4", action: "stop" } }); // multiple or single events can be pushed



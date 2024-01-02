import { DataLayerHelper } from "./customHelper.js";

interface TriggerEvent {
  eventType: "onPageLoad" | "onUrlChange" | "onDataLayerEvent";
  eventData: any;
}

const publish = (event: TriggerEvent) => {
  console.log(event);
  const data = event?.eventData;
  if (data?.action === "start") {
    console.log("starting: ", data?.name);
  } else if (data?.action === "stop") {
    console.log("stopping: ", data?.name);
  }
};

const dataLayer = (window as { [key: string]: any })["dataLayer"];

dataLayer.push({ eventData: { name: "exp0-past", action: "start" } });

function listener(message: any) {
  const messageWithType = { ...message, type: "onDataLayerEvent" };
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

import { ServerRespond } from "./DataStreamer";

export interface Row {
  timestamp: Date;
  price_abc: number;
  price_def: number;
  ratio: number;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    const priceABC =
      (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF =
      (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = priceDEF > 0 ? priceABC / priceDEF : 0;
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    // get the most recent timetamp
    const timestamp =
      serverResponds[0].timestamp > serverResponds[1].timestamp
        ? serverResponds[0].timestamp
        : serverResponds[1].timestamp;
    const triggerAlert =
      ratio > upperBound || ratio < lowerBound ? ratio : undefined;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio: ratio,
      timestamp: timestamp,
      lower_bound: lowerBound,
      upper_bound: upperBound,
      trigger_alert: triggerAlert,
    };
  }
}

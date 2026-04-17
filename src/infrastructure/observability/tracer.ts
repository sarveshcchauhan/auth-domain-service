import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { ENV } from "../../config/env";

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: `${ENV.OPEN_TELEMETRY}/v1/traces`,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

export const startTracing = async () => {
  await sdk.start();
  console.log("Tracing started");
};
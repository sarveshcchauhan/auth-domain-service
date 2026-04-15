import { ENV } from "../../config/env";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: `${ENV.OPEN_TELEMETRY}/v1/traces`,
  }),
  instrumentations: [getNodeAutoInstrumentations()], // ✅ MAGIC
});

export const startTracing = async () => {
  await sdk.start();
  console.log("📊 Tracing started");
};
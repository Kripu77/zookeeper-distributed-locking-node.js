import winston from "winston";
import { format, transports } from "winston";
const { combine, errors, json } = format;

export const initLogging = () => {
  winston.configure({
    level: "debug",
    format: combine(errors({ stack: true }), json()),
    defaultMeta: { service: "microservice", env: "dev" },
    transports: [new transports.Console()],
  });
};

export const logger = winston;

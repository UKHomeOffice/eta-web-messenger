import config from '../../config';
const logApiEndpoint = config.logApiEndpoint;

/**
 * Logs data to the logging API endpoint in production, or to the console in non-production environments.
 *
 * In non-production environments, the logging API may not be available or configured. 
 * To avoid errors and simplify, this function logs messages to the console instead.
 */
export default async function logData({ level, message, metadata }) {
  if(process.env.NODE_ENV === 'production') {
    await logToService(level, message, metadata);
  } else {
    console.log(message);
  }
}

export async function logToService(level, message, metadata) {

  const service = `${config.service.name}`;

  const payload = {
    timestamp: new Date().toISOString(),
    service,
    level,
    message
  };

  if (metadata) {
    payload.metadata = metadata;
  }

  await fetch(logApiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

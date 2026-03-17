// Store the environment config in a variable for access via the getEnv function.
let envConfig = {};

/**
 * Asyncronously load the environment config from the 'env.json' file.
 * This file will be copied into the dist folder during the build phase,
 * the contents of the file will be updated from environment variables
 * so we can load those into the app at runtime.
 * @param {function} onSuccess callback function to execute on success.
 */
export async function loadEnvironmentConfig(onSuccess) {
  const res = await fetch('env.json');
  if (!res.ok) {
    throw new Error('Failed to load environment config');
  }
  envConfig = await res.json();
  if (onSuccess) {
    onSuccess();
  }
}

/**
 * Accessor function to retrieve environment config values.
 * @param {string} key - config key to retrieve the value for.
 * @returns {any} - the config value for the specified key.
 */
export function getEnvValueByKey(key) {  
  return envConfig[key];
}

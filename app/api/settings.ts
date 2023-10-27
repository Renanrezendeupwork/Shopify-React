/**
 * settings api (could probably put in admin, but leaving here for now)
 */
import type {ProcessEnv} from '~/lib/type';

import {SETTINGS_DATA} from './settingsData';

const ID = `settings:cache:full`;
const getSettings = async (env: ProcessEnv) => {
  try {
    const headers = new Headers();
    headers.append(
      'Authorization',
      `Basic ${btoa(
        `${env.SHOPIFY_ADMIN_USERNAME}:${env.SHOPIFY_ADMIN_PASSWORD}`,
      )}`,
    );

    const FETCH_URL = `${env?.PUBLIC_STORE_DOMAIN}/admin/api/${env.SHOPIFY_ADMIN_API_VERSION}/themes/${env.SHOPIFY_THEME_ID}/assets.json?asset[key]=config/settings_data.json`;
    const settings = await fetch(FETCH_URL, {headers})
      .then((r) => r.text())
      .then((t) => JSON.parse(t));

    const {value} = settings.asset;
    return JSON.parse(value);
  } catch (error) {
    throw Error(`Error fetching settings.`);
  }
};

async function handler(env: ProcessEnv) {
  try {
    const value = await getSettings(env);
    return value;
  } catch (error) {
    return SETTINGS_DATA;
  }
}

export default handler;

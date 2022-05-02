import axios from "axios";
import { writable } from "svelte/store";
import { useAuth0 } from "./auth0";

export const AccessControlLevel = {
  PUBLIC: "public",
  PROTECTED: "requires-authentication",
  RBAC: "requires-role-permission",
  CORS: "requires-cors-allowed-method",
};

const apiServerUrl = process.env.API_SERVER_URL;

export const selectedAccessControlLevel = writable("");
export const apiEndpoint = writable("");
export const apiResponse = writable("Click a button to make an API request...");

const { getAccessToken } = useAuth0;

const makeRequest = async (options) => {
  try {
    if (options.authenticated) {
      const token = await getAccessToken();

      options.config.headers = {
        ...options.config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await axios(options.config);

    const { data } = response;

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }

    return error.message;
  }
};

export const getPublicResource = async () => {
  selectedAccessControlLevel.set(AccessControlLevel.PUBLIC);

  apiEndpoint.set("GET /api/messages/public");

  const config = {
    url: `${apiServerUrl}/api/messages/public`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  };

  const data = await makeRequest({ config });

  apiResponse.set(JSON.stringify(data, null, 2));
};

export const getProtectedResource = async () => {
  selectedAccessControlLevel.set(AccessControlLevel.PROTECTED);

  apiEndpoint.set("GET /api/messages/protected");

  const config = {
    url: `${apiServerUrl}/api/messages/protected`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  };

  const data = await makeRequest({ config, authenticated: true });

  apiResponse.set(JSON.stringify(data, null, 2));
};

export const getRbacResource = async () => {
  selectedAccessControlLevel.set(AccessControlLevel.RBAC);

  apiEndpoint.set("GET /api/messages/admin");

  const config = {
    url: `${apiServerUrl}/api/messages/admin`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  };

  const data = await makeRequest({ config, authenticated: true });

  apiResponse.set(JSON.stringify(data, null, 2));
};

export const checkCorsAllowedMethod = async () => {
  selectedAccessControlLevel.set(AccessControlLevel.CORS);

  apiEndpoint.set("DELETE /api/messages/public");

  const config = {
    url: `${apiServerUrl}/api/messages/public`,
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  };

  const data = await makeRequest({ config, authenticated: true });

  apiResponse.set(JSON.stringify(data, null, 2));
};

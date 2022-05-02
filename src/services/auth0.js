import auth0 from "@auth0/auth0-spa-js";
import { get, writable } from "svelte/store";

const _useAuth0 = () => {
  const auth0Client = writable(null);
  const isAuthenticated = writable(false);
  const isLoading = writable(true);
  const user = writable(null);
  const error = writable(null);

  const createAuth0Client = async (config) => {
    auth0Client.set(await auth0(config));
  };

  const handleAuth0RedirectCallback = async (onRedirectCallback) => {
    const params = new URLSearchParams(window.location.search);
    const hasError = params.has("error");
    const hasCode = params.has("code");
    const hasState = params.has("state");

    if (hasError) {
      error.set(
        new Error(
          params.get("error_description") || "error completing login process"
        )
      );

      return;
    }

    if (hasCode && hasState) {
      const { appState } = await get(auth0Client).handleRedirectCallback();

      onRedirectCallback(appState);
    }
  };

  const initializeAuth0 = async (config = {}) => {
    await createAuth0Client({
      domain: 'dev-qni6mx5z.us.auth0.com', //import.meta.env.AUTH0_DOMAIN,
      client_id: '39JaK3uwi2frHRhlZpTxQ4dJjofdeElu', //import.meta.env.AUTH0_CLIENT_ID,
      audience: 'https://caritas2022.devme.fun', //import.meta.env.AUTH0_AUDIENCE,
      redirect_uri: window.location.origin,
    });

    if (!config.onRedirectCallback) {
      config.onRedirectCallback = () =>
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
    }
    try {
      await handleAuth0RedirectCallback(config.onRedirectCallback);
    } catch (err) {
      error.set(err);
    } finally {
      isAuthenticated.set(await get(auth0Client).isAuthenticated());
      user.set((await get(auth0Client).getUser()) || null);
      isLoading.set(false);
    }
  };

  const login = async (options) => {
    if (!auth0Client) {
      return;
    }

    await get(auth0Client).loginWithRedirect(options);
  };

  const logout = async (options) => {
    get(auth0Client).logout(options);
  };

  const getAccessToken = async (options) => {
    return await get(auth0Client).getTokenSilently(options);
  };

  return {
    isAuthenticated,
    isLoading,
    user,

    createAuth0Client,
    initializeAuth0,
    login,
    logout,
    getAccessToken,
  };
};

export const useAuth0 = _useAuth0();

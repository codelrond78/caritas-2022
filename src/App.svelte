<script lang="ts">
  import { onMount } from "svelte";
  import { Router } from '@roxi/routify'
  import { routes } from '../.routify/routes'
  import ReloadPrompt from './lib/ReloadPrompt.svelte'
  import { useAuth0 } from "./services/auth0"
  import AuthenticationButton from "./lib/buttons/authentication-button.svelte"

  let {
    //auth0Client,
    isLoading,
    //isAuthenticated,
    //user,
    //login,
    initializeAuth0,
    //createAuth0Client,
  } = useAuth0;

  const onRedirectCallback = (appState) => {
    window.history.replaceState(
      {},
      document.title,
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  };

  onMount(async () => {
    await initializeAuth0({ onRedirectCallback });
  });
</script>

{#if $isLoading}
  <div>
    Loading auth0...
  </div>
{/if}

{#if !$isLoading}
  <AuthenticationButton />
  <Router {routes} />
{/if}

<ReloadPrompt />


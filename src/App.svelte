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
    getAccessToken,
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

  async function handleToken(){
    const token = await getAccessToken()
    console.log("***", token)
  }

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
  <button class="btn btn-warning" on:click="{handleToken}">handle tocken</button>
  <AuthenticationButton />
  <Router {routes} />
{/if}

<ReloadPrompt />


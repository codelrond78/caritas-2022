<script lang="ts">
  import { onMount } from "svelte";
  import { Router } from '@roxi/routify'
  import { routes } from '../.routify/routes'
  import ReloadPrompt from './lib/ReloadPrompt.svelte'
  import { useAuth0 } from "./services/auth0"  
  import { makeRequest } from './services/external-api-service'
  
  let {
    //auth0Client,
    isLoading,
    isAuthenticated,
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

  async function handleRequest(){
      //const token = await getAccessToken()
      //console.log(token)
      const config = {
        url: `/api/g`,
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      };

      const data = await makeRequest({ config, authenticated: true });
      console.log(data)
  }

  onMount(async () => {
    await initializeAuth0({ onRedirectCallback });
  });

  console.log(import.meta.env.VITE_API_SERVER_URL + '')

</script>

{#if $isLoading}
  <div>
    Loading auth0...
  </div>
{/if}

{#if !$isLoading}
  <!--<button class="btn btn-warning" on:click="{handleRequest}">handle tocken</button>-->  
  <Router {routes} />
{/if}

<ReloadPrompt />


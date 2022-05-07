<script>
  import { useAuth0 } from "../../services/auth0";
  import LoginButton from "./login-button.svelte";
  import LogoutButton from "./logout-button.svelte";
  import { logToken } from '$src/services/external-api-service';

  let { isAuthenticated } = useAuth0;
</script>

<button on:click={logToken} class="btn btn-error">Log token</button>

{#if $isAuthenticated}
  <LogoutButton />
{:else}
  <LoginButton />
{/if}

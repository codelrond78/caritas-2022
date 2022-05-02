<script>
  import { useAuth0 } from "../../services/auth0";
  import LoginButton from "./login-button.svelte";
  import LogoutButton from "./logout-button.svelte";

  let { isAuthenticated } = useAuth0;
</script>

{#if $isAuthenticated}
  <LogoutButton />
{:else}
  <LoginButton />
{/if}

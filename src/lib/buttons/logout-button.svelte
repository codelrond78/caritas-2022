<script>
  import { useAuth0 } from "../../services/auth0";

  const { logout } = useAuth0;
</script>

<button
  class="btn btn-error"
  on:click={() =>
    logout({
      returnTo: window.location.origin,
    })}
>
  Log Out
</button>

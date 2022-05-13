<script>
  import { useAuth0 } from "../../services/auth0";

  const { login } = useAuth0;
</script>

<button class="btn btn-warning" on:click={() => login()}>
  Log In
</button>

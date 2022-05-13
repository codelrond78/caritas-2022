<script>
    import { goto } from '@roxi/routify'
    import { useAuth0 } from "$src/services/auth0"  
    import AuthenticationButton from "$lib/buttons/authentication-button.svelte"
    
    let {        
        isAuthenticated,
    } = useAuth0;
</script>
  
{#if $isAuthenticated}
    {$goto('/')}
{:else}
    <img src="/loginimage.jpg" alt="Acceder a la app" width="100" />
    <AuthenticationButton />
{/if}
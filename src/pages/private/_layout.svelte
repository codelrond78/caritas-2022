<script>
    import { goto } from '@roxi/routify'
    import { useAuth0 } from "$src/services/auth0"  
    
    let {        
        isAuthenticated,
    } = useAuth0;

</script>
  
{#if $isAuthenticated}
    <slot />
{:else}
    {$goto('/login')}
{/if}
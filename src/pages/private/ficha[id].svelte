<script>
    import Ficha from '$lib/fichaform.svelte';
    import { makeRequest } from '$src/services/external-api-service';
    import { useQuery } from '@sveltestack/svelte-query';
    export let id;

    const config = {
          url: `/api/ficha/${id}`,
          method: 'get'          
    };
        
    const queryResult = useQuery(['ficha', id], ()=>makeRequest({ config, authenticated: true }));   
</script>

{#if $queryResult.isLoading}
    <span>Loading...</span>
{:else if $queryResult.isError}
    <span>Error: {JSON.stringify($queryResult.error)}</span>
{:else}
    <Ficha {id} details={$queryResult.data} />
{/if}

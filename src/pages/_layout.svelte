<script lang="ts">
    import Alert from '../lib/alert.svelte'
    import AuthenticationButton from "../lib/buttons/authentication-button.svelte"
    // replaced dyanmicaly
    const date = '__DATE__'
</script>

<main>
  <!--<img src="/favicon.svg" alt="PWA Logo" width="60" height="60"/>-->
  <Alert />
  <img class="float-left" src="/pwa-192x192.png" alt="Acogida Vélez Rubio" width="60" height="60"/>
  <a class="text-sm float-left" href='https://www.freepik.es/vectores/libre-derechos'>pikisuperstar - www.freepik.es</a>
  <span class="float-right"><AuthenticationButton /></span>  
  <h1>Acogida Vélez Rubio!</h1>

  <slot />

</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4rem;
        font-weight: 100;
        line-height: 1.1;
        margin: 2rem auto;
        max-width: 14rem;
    }

    @media (min-width: 480px) {
        h1 {
            max-width: none;
        }

    }


</style>

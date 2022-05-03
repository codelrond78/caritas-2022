<script lang="ts">
import { createForm } from 'felte';
import {error, success} from '../store'

const { form } = createForm({
  onSubmit: (values) => {
    // ...
  },
})

let apiError = false;
let apiSuccess = false;

$: {
  if(apiError) error.timeout("Hay un error")
  apiError = false
}
$: {
  if(apiSuccess) success.timeout("Éxito!!!")
  apiSuccess = false
}

</script>
<!--
<a href="/ficha" class="link link-accent">Ir a ficha</a>

<form use:form>
    <input type="password" placeholder="Contraseña" name="password" class="input input-bordered w-full max-w-xs">
    <button class="btn btn-active btn-accent">Conectar</button>
</form>
-->

<button class="btn btn-active btn-accent" on:click={() => apiError=true}>Set error!</button>
<button class="btn btn-active btn-accent" on:click={() => apiSuccess=true}>Set success!</button>
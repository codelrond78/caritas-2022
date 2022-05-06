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

<a class="link" href="/private/ficha">Ir a ficha</a>

<!--
<button class="btn btn-active btn-accent" on:click={() => apiError=true}>Set error!</button>
<button class="btn btn-active btn-accent" on:click={() => apiSuccess=true}>Set success!</button>
-->
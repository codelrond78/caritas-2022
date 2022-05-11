<script lang="ts">
import { createForm } from 'felte';
import {error, success} from '../store'

import Cat from '../lib/catForm.svelte'

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
<a class="link" href="/private/ficha/001">Ir a ficha 001</a>

<Cat />
<script lang="ts">
import { createForm } from 'felte';

const { form } = createForm({
  onSubmit: (values) => {
    // ...
  },
})
</script>

<a href="/ficha" class="link link-accent">Ir a ficha</a>

<form use:form>
    <input type="password" placeholder="Contraseña" name="password" class="input input-bordered w-full max-w-xs">
    <button class="btn btn-active btn-accent">Conectar</button>
</form>
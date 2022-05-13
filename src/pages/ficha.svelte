<script>
  import { createForm } from 'felte';

  const { form } = createForm({
    onSubmit: (values) => {
      // ...
    },
  })
</script>

<form use:form>
    
    <button class="btn btn-active btn-accent">Conectar</button>
</form>
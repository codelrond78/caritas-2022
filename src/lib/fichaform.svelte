<script>
    import { createForm } from 'felte';
    import { cleave } from 'svelte-cleavejs';
    import { makeRequest } from '../services/external-api-service';
    import { useMutation } from '@sveltestack/svelte-query';
 
    let config;
    const mutation = useMutation( () => makeRequest({ config, authenticated: true }), {onSuccess: (data) => id = data.id})

    export let id;
    export let details;

    let options = {
		  date: true,
      datePattern: ['d', 'm', 'Y'],
		  delimiter: '/'
	  }

    const { form, data, addField, unsetField } = createForm({
      onSubmit: (values) => {
        config = {
          url: id ? `/api/ficha/${id}`:'/api/ficha',
          method: id ? "put":"post",
          data: values,
          headers: {
            "content-type": "application/json",
          },
        };
        $mutation.mutate()
      },
      initialValues: {
        id,
        ...details
      },
    });
  
    $: members = $data.members;
  
    function removeMember(index) {
      return () => unsetField(`members.${index}`);
    }
  
    function addMember(index) {
      return () => addField(`members`, { name: '', dateOfBirth: '' }, index);
    }
  </script>
  
  <form use:form>
    <input type="text" placeholder="Dirección" name="address" class="input input-bordered w-full max-w-xs">
    {#each members as member, index}
      <div>
        <input type="text" placeholder="Nombre" name="members.{index}.name" class="input input-bordered w-full max-w-xs">
        <input use:cleave={options} type="text" placeholder="Fecha de nacimiento" name="members.{index}.dateOfBirth" class="input input-bordered w-full max-w-xs">
        <button class="btn btn-error" type="button" on:click="{removeMember(index)}">
          Borrar miembro
        </button>
      </div>
    {/each}
    <button class="btn btn-primary" type="button" on:click="{addMember(members.length)}">
        Añadir miembro
    </button>
  </form>
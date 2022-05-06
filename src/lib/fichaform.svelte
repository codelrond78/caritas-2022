<script>
    import { createForm } from 'felte';
    import { cleave } from 'svelte-cleavejs';
    export let id;
    export let details;

    let options = {
		date: true,
        datePattern: ['d', 'm', 'Y'],
		delimiter: '-'
	}
  
    const { form, data, addField, unsetField } = createForm({
      initialValues: {
        id,
        ...details
      },
    });
  
    let members;
    $: {
      //console.log($data)
      members = $data.members;
    }
  
    function removeMember(index) {
      return () => unsetField(`interests.${index}`);
    }
  
    function addMember(index) {
      return () => addField(`interests`, { name: '', year: '' }, index);
    }
  </script>
  
  <form use:form>
    {#each members as member, index}
      <div>
        <input type="text" placeholder="Nombre" name="members.{index}.name" class="input input-bordered w-full max-w-xs">
        <input use:cleave={options} type="text" placeholder="Fecha de nacimiento" name="members.{index}.dateOfBirth" class="input input-bordered w-full max-w-xs">
        <button type="button" on:click="{removeMember(index)}">
          Borrar miembro
        </button>
      </div>
    {/each}
    <button type="button" on:click="{addMember(members.length)}">
        Añadir miembro
    </button>
  </form>
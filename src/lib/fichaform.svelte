<script>
    import { createForm } from 'felte';
    export let id;
    export let interests;
  
    const { form, data, addField, unsetField } = createForm({
      initialValues: {
        id,
        interests//: [{ value: '' }],
      },
    });
  
    $: interests = $data.interests;
  
    function removeInterest(index) {
      return () => unsetField(`interests.${index}`);
    }
  
    function addInterest(index) {
      return () => addField(`interests`, { value: '' }, index);
    }
  </script>
  
  <form use:form>
    {#each interests as interest, index}
      <div>
        <input name="interests.{index}.value" />
        <button type="button" on:click="{addInterest(index + 1)}">
          Add Interest
        </button>
        <button type="button" on:click="{removeInterest(index)}">
          Remove Interest
        </button>
      </div>
    {/each}
  </form>
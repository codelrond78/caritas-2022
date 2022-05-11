<script>
import streamFn from './save-form'

const {stream, status, pauser} = streamFn({id: "0x1a483f4330", setId: (data) => data.addCat.cat[0].catID})

let item = {name: 'fuffy', age: '7'};

$: stream.next(item)

</script>
  
<form>
    <input type="text" bind:value={item.name} class="input input-bordered w-full max-w-xs" />
    <input type="number" bind:value={item.age} class="input input-bordered w-full max-w-xs" />  
</form>
{$status}
<button class="btn btn-active btn-accent" on:click={()=>pauser.next(false)}>pauser false</button>

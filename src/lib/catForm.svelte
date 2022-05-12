<script>
import streamFn from './save-form'

const {stream, status} = streamFn({id: "0x1a483f4330", setId: (data) => data.addCat.cat[0].catID})

let item = {name: 'fuffy', age: '7'};

let colors = {
    initial: 'gray',
    saving: 'orange',
    error: 'rose',
    done: 'indigo'
}
$: stream.next(item)
$: color = colors[$status]

</script>
  
<form>
    <div class={`border-solid border-2 border-${color}-600`}>
        <input type="text" bind:value={item.name} class="input input-bordered w-full max-w-xs" />
        <input type="number" bind:value={item.age} class="input input-bordered w-full max-w-xs" />  
    </div>
</form>
{$status}
<!--<button class="btn btn-active btn-accent" on:click={()=>pauser.next(false)}>pauser false</button>
-->

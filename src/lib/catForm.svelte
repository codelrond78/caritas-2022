<script>
import streamFn from './save-form'
import { gql } from 'graphql-request'

const postQuery = gql`
mutation MyMutation($input: [AddCatInput!]!) {
  addCat(input: $input) {
    numUids
    cat {
      catID
      name
      age
    }
  }
}
`

const putQuery = gql`
mutation MyMutation2($input: UpdateCatInput!) {
  updateCat(input: $input) {
    cat {
      age
      catID
      name
    }
  }
}
`
//id: "0x1a483f4330", 
const { saveImmediately, save, status} = streamFn({id: null, putQuery, postQuery, setId: (data) => data.addCat.cat[0].catID})

let item = {name: 'fuffy', age: 7};

let colors = {
    initial: 'gray',
    saving: 'amber',
    error: 'red',
    done: 'blue'
}
$: save(item)
$: color = colors[$status]

</script>
  
<form>
    <div class={`border-solid border-2 border-${color}-600`}>
        <input type="text" bind:value={item.name} class="input input-bordered w-full max-w-xs" />
        <input type="number" bind:value={item.age} class="input input-bordered w-full max-w-xs" />  
    </div>
</form>

{$status}
{color}

{#if $status === 'error'}
    <button on:click={()=>saveImmediately(item)} class="btn btn-active btn-accent">Guardar inmediatamente</button>
{/if}

<!--<button class="btn btn-active btn-accent" on:click={()=>pauser.next(false)}>pauser false</button>
-->

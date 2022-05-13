<script>
import streamFn, {Client} from './save-form'
import { gql } from 'graphql-request'
import { create, test, enforce } from 'vest';
import { useAuth0 } from "$src/services/auth0";

const { getAccessToken } = useAuth0;

const suite = create((data = {}) => {
  test('name', 'Username is required', () => {
    enforce(data.name).isNotBlank();
  });

  test('age', 'Age is required', () => {
    enforce(data.name).isNotBlank();
  });

  test('age', 'Age is a number', () => {
    enforce(data.name).isNumeric();
  });

});

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL + "";

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
const client = Client({apiServerUrl, token: null})
const { saveImmediately, save, status} = streamFn({client, id: null, putQuery, postQuery, setId: (data) => data.addCat.cat[0].catID})

let item = {name: null, age: null};

function isValid(item){
    console.log(suite(item))
    return suite(item).isValid()
}

$: if(isValid(item)) save(item)

</script>
  
<form>
    <div>
        <input type="text" bind:value={item.name} class="input input-bordered w-full max-w-xs" />
        <input type="number" bind:value={item.age} class="input input-bordered w-full max-w-xs" />  
    </div>
</form>

{$status}

{#if $status === 'error' && isValid(item)}
    <button on:click={()=>saveImmediately(item)} class="btn btn-active btn-accent">Guardar inmediatamente</button>
{/if}

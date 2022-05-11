import { writable } from 'svelte/store';
import { buffer, switchMap, from, interval, NEVER, Subject, debounceTime } from 'rxjs';
import { onDestroy } from 'svelte';
import { GraphQLClient, gql  } from 'graphql-request'
import { useAuth0 } from "$src/services/auth0";

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

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL + "";

const { getAccessToken } = useAuth0;

export default function({id, setId}){

    const status = writable('initial')
        
    function pausableInterval(pauser) {
        const source = interval(500);

        //return pauser.pipe(switchMap(x=>interval(500)), tap(x=>console.log(x)))
     
        return pauser.pipe(switchMap((paused) => {
          console.log('valor de paused en pausable es', paused)
          if(paused){
            console.log('paused')
            return NEVER
          }else{
            console.log('not paused')
            return interval(500)
          }
        }
      )
    )}
    
    async function handle(x){
        console.log('init handle(x)', x)
        pauser.next(true)
        status.set("saving")
        console.log('done')
        pauser.next(false)
        status.set("done")
        return
        try{
            const token = await getAccessToken();
            console.log(token)
            //const client = new GraphQLClient(apiServerUrl, { headers: {Authorization: `Bearer ${token}`} })
            const client = new GraphQLClient(apiServerUrl)
            let response;
            let values = x.at(-1);
            if(id){
              const variables = {
                "input": {
                  "filter": {"catID": "0x1a483f4330"},
                  "set": values
                }
              } 
              response = await client.request(putQuery, variables)
            }else{
              const variables = {
                "input": [
                  values
                ]
              }
              response = await client.request(postQuery, variables)
            }            
            status.set("done")	
            const { data } = response;
            if(!id){
              id = setId(data);
            }
            return data;            
        } catch(err){
            status.set("error")
            return {error: ''}
        }finally {
            pauser.next(false)
        }
    }

    const pauser = new Subject()
    const stream = new Subject()
    
    const subscription = stream.pipe(
      debounceTime(500),
      buffer(pausableInterval(pauser)),
      switchMap((x) => {
        if(x.length > 0) return from(handle(x))
        console.log('skiping')
        return NEVER  
      })
    ).subscribe({
      next: (v) => console.log(`observer: ${JSON.stringify(v)}`),
      complete: (v) => console.log('complete'),
      error: (err) => console.log(err)
    });	

    onDestroy(() => subscription.unsubscribe());
    
    const subscription2 = pauser.subscribe({
      next: (v) => console.log(`pauser: ${JSON.stringify(v)}`),
      complete: (v) => console.log('complete'),
      error: (err) => console.log(err)
    });	

    onDestroy(() => subscription2.unsubscribe());
    pauser.next(false)

    return {
        status,
        pauser,
        stream
    }
}
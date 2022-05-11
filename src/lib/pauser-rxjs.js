import { writable } from 'svelte/store';
import { from, interval, concatMap, NEVER, Subject, debounce, bufferWhen } from 'rxjs';
import { onDestroy } from 'svelte';
import { GraphQLClient  } from 'graphql-request'
import { useAuth0 } from "$src/services/auth0";

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL + '';

const { getAccessToken } = useAuth0;

export default function({id, putQuery, postQuery, extractId, cb}){

    const status = writable('initial')
        
    function pausableInterval(pauser) {
        const source = interval(500);
     
        return pauser.pipe(concatMap((paused) => {
          if(paused){
            console.log('paused')
            return NEVER
          }else{
            console.log('not paused')
            return source
          }
        }
      )
    )}
    
    async function handle(x){
        pauser.next(true)
        status.set("saving")
        try{
            const token = await getAccessToken();
            console.log(token)
            const client = new GraphQLClient(apiServerUrl, { headers: {Authorization: `Bearer ${token}`} })
            let response;
            let variables = x.at(-1);
            if(id){
              response = await client.request(putQuery, variables)
            }else{
              response = await client.request(postQuery, variables)
            }            
            status.set("done")	
            const { data } = response;
            if(!id){
              id = extractId(data);
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
    pauser.next(false)
    const stream = new Subject()
    stream.pipe(
      debounce(500),
      bufferWhen(pausableInterval(pauser)),
      concatMap((x)=>{
        if(x.length > 0) return from(handle(x))
        return NEVER  
      })
    )
    const subscription = stream.subscribe({
      next: (v) => console.log(`observer: ${v}`),
    });	

    onDestroy(() => subscription.unsubscribe());

    return {
        status,
        stream
    }
}
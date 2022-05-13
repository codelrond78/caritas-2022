import { writable } from 'svelte/store';
import { buffer, switchMap, from, interval, NEVER, Subject, debounceTime, skip } from 'rxjs';
import { onDestroy } from 'svelte';
import { GraphQLClient } from 'graphql-request'
import { useAuth0 } from "$src/services/auth0";
import {error, success} from '$src/store';

const T = 2000;

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL + "";

const { getAccessToken } = useAuth0;

export default function({id, setId, putQuery, postQuery}){

    const status = writable('initial')
        
    function pausableInterval(pauser) {    
        return pauser.pipe(switchMap((paused) => {
          console.log('valor de paused en pausable es', paused)
          if(paused){
            console.log('paused')
            return NEVER
          }else{
            console.log('not paused')
            return interval(T)
          }
        }
      )
    )}
    
    async function handle(x){
        try{
            status.set("saving")	
            //const token = await getAccessToken();
            //console.log(token)
            //const client = new GraphQLClient(apiServerUrl, { headers: {Authorization: `Bearer ${token}`} })
            const client = new GraphQLClient(apiServerUrl)
            let response;
            let values = x.at(-1);
            if(id){
              const variables = {
                "input": {
                  "filter": {"catID": id},
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
            status.set("saved")	
            console.log('%c done! ', 'background: #222; color: #bada55');
            success.timeout("Éxito!!!")
            //const { data } = response;
            if(!id){
              console.log('my response', response)
              id = setId(response);
            }
            return response;            
        } catch(err){
            console.log('%c error! ', 'background: #222; color: #e62558');
            console.log(err)
            status.set("error")
            error.timeout("Hay un error")
            return {error: err}
        }finally {
            pauser.next(false)
        }
    }

    const pauser = new Subject()
    const stream = new Subject()
    
    const subscription = stream.pipe(
      skip(1),
      debounceTime(T),
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
    pauser.next(false)

    return {
        status,
        save: (item) => stream.next(item),
        saveImmediately: (x) => handle([x])
    }
}

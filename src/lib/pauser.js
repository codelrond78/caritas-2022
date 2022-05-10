import { writable } from 'svelte/store';
import Kefir from 'kefir';
import { onDestroy } from 'svelte';
import { GraphQLClient  } from 'graphql-request'
import { useAuth0 } from "$src/services/auth0";

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL + '';

const { getAccessToken } = useAuth0;

export default function({id, putQuery, postQuery, extractId, cb}){

    const status = writable('initial')
        
    function pausableInterval(pauser) {
        const source = Kefir.interval(500, 1);
     
        return pauser.flatMapLatest(
            paused => {
              if(paused){
                console.log('paused')
                return Kefir.never()
              }else{
                console.log('not paused')
                return source
              }
            }
        );
    }
    
    async function handle(x){
        p.emit(true)
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
            p.emit(false)
        }
    }

    let p;
    let e;
    const bar = Kefir.stream(ex => {p = ex; p.emit(false)})
    let foo = Kefir.stream(ex => {e = ex; cb('ready')}).debounce(500).bufferBy(pausableInterval(bar)).flatMapLatest((x)=>{
        if(x.length > 0) return Kefir.fromPromise(handle(x))
        return Kefir.never()
    })
    
    const subscription = foo.observe({
      value(value) {
        console.log('value:', value);
      },
      error(error) {
        console.log('error:', error);
      },
      end() {
        console.log('end');
      },
    });	

    onDestroy(()=>subscription.unsubscribe());

    function emit(x){
      e.emit(x)
    }

    return {
        status,
        emit
    }
}
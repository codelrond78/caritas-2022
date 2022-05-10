import { writable } from 'svelte/store';
import Kefir from 'kefir';
import { onDestroy } from 'svelte';

export default function({id}){

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
            await sleep(2000)
            status.set("done")	
        } catch(err){
            status.set("error")
        }finally {
            p.emit(false)
        }
        return x.at(-1)
    }

    let p;
    let e;
    const bar = Kefir.stream(ex => {p = ex; p.emit(false)})
    let foo = Kefir.stream(ex => e = ex).debounce(500).bufferBy(pausableInterval(bar)).flatMapLatest((x)=>{
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

    return {
        status,
        emit: e.emit
    }
}
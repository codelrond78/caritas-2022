<script>
    import Kefir from 'kefir'
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }	
        
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
    
    let p;
    let e;
    const bar = Kefir.stream(ex => {p = ex; p.emit(false)})
    let foo = Kefir.stream(ex => e = ex).debounce(500)
    
    async function handle(x){
        p.emit(true)
        try{
            await sleep(2000)	
        } catch(err){
            
        }finally {
            p.emit(false)
        }
        return x.at(-1)
    }
    
    var result = foo.bufferBy(pausableInterval(bar)).flatMapLatest((x)=>{
        if(x.length > 0) return Kefir.fromPromise(handle(x))
        return Kefir.never()
    })
    
    const subscription = result.observe({
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
        
    let v;
    let toggle = true;
    $: e.emit(v)
        
    </script>
    
    <input bind:value={v} />
    <button on:click={()=>{p.emit(toggle); toggle = !toggle}}>{!toggle}</button>
    <button on:click={()=>subscription.unsubscribe()}>
        unsubscribe
    </button>
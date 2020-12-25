import { store } from './store';

export class eegWorkerUtil {

    constructor(nThreads=1) {

        this.workers;
        this.threads = nThreads;
        this.threadRotation = 0;

        try {
            this.workers = [];
                for(var i = 0; i < this.threads; i++){
                    this.workers.push(new Worker('./js/eegworker.js'));
                    this.workers[i].onmessage = (e) => {
                        var msg = e.data; //Returned string
                        //console.log(msg)
                        this.receivedMsg(msg);
                    };
                }
                console.log("worker threads: ", this.threads)
            
            }
        catch (err) {
            this.workers = undefined;
            console.error("Worker error: ", err);
        }
    }

    //Sends info to eegworker.js threads for execution based on defined function "foo"
    postToWorker = (foo,input,workeridx = null) => {
        if(workeridx === null) {
            this.workers[this.threadRotation].postMessage({foo:foo, input:input});
            if(this.threads > 1){
                this.threadRotation++;
                if(this.threadRotation >= this.threads){
                    this.threadRotation = 0;
                }
            }
        }
        else{
            this.workers[workeridx].postMessage({foo:foo, input:input});
        }
    }

    //Callback when message data is received, expects eegworker.js formatted stuff
    receivedMsg = (msg) => {
        if(msg.foo === "multidftbandpass") {
          //console.log(msg)
          session.posFFTList = [...msg.output[1]];
          //session.posFFTList.forEach((row,i) => {
          //  row.map( x => x * session.stepsPeruV);
          //});
      
          //processFFTs();
          
        }
        if(msg.foo === "coherence") {
          
          store.setState({ [posFFTList]: [...msg.output[1]] });
          store.setState({ [coherenceResults]: [...msg.output[2]] });

          //session.posFFTList.forEach((row,i) => {
          //  row.map( x => x * session.stepsPeruV);
          //}); s
          //processFFTs();
          //mapCoherenceData();
        }
        store.setState({ [newMsg]: true })
        session.newMsg = true;
      }
}


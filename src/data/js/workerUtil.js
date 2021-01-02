export class WorkerUtil {

    constructor(nThreads=1, workerSrc = './js/eegworker.js', onReceivedMsg = this.onReceivedMsg) {
        // this.onReceivedMsg = onReceivedMsg || this.onReceivedMsg

        // if(!receivedMsg) { this.onReceivedMsg = onReceivedMsg; }
        this.workers;
        this.threads = nThreads;
        this.threadRotation = 0;

        try {
            this.workers = [];
                for(var i = 0; i < this.threads; i++){
                    this.workers.push(new Worker(workerSrc));
                    this.workers[i].onmessage = (e) => {
                        var msg = e.data; //Returned string
                        //console.log(msg)
                        this.onReceivedMsg(msg);
                    };
                }
                console.log("worker threads: ", this.threads)

            }
        catch (err) {
            this.workers = undefined;
            console.error("Worker error: ", err);
        }
    }

    //Sends info to worker threads for execution based on defined function "foo"
    postToWorker = (input,workeridx = null) => {
        if(workeridx === null) {
            this.workers[this.threadRotation].postMessage(input);
            if(this.threads > 1){
                this.threadRotation++;
                if(this.threadRotation >= this.threads){
                    this.threadRotation = 0;
                }
            }
        }
        else{
            this.workers[workeridx].postMessage(input);
        }
    }

    //Callback when message data is received, expects eegworker.js formatted stuff
    onReceivedMsg = (msg) => {
        console.log(msg);
    }
}


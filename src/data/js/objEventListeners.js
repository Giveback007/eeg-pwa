
/*
let events = new ObjectListener();
let x = { y: 1, z: { w: 2 }}


events.addListener("y",x,"y");
events.addListener("z",x,"z");

x.z.w = 3;
x.y = 2;
//See console

*/


//Create instance and then call instance.addListener(listenerName,objectToListenTo,propToListenTo,onchange,interval).
//name, propToListenTo, onchange, and interval are optional (leave or set as undefined). Onchange is a custom callback just like for other event listeners. Set a name to make it easier to start and stop or edit each listener.
export class ObjectListener {
    constructor() {
        this.listeners = [];
    }

    addListener(listenerName=null,objectToListenTo,propToListenTo=undefined,onchange=undefined,interval=undefined) {
        if(objectToListenTo === undefined) {
            console.error("You must assign an object");
            return;
        }

        var name = listenerName;
        if(name === null) {
            name = Math.floor(Math.random()*100000);
        }
        var listener = {name:name, listener: new ObjectListenerInstance(objectToListenTo,propToListenTo,onchange,interval)};
        this.listeners.push(listener);
    }

    stop(name=null) {
        if(name === null) {
            this.listeners.forEach((obj,i) => {
                obj.listener.stop();
            });
        }
        else {
            var found = this.listeners.find((o,i) => {
                if(o.name === name){
                    obj.listener.stop();
                }
            });
        }
    }

    start(name=null) {
        if(name === null) {
            this.listeners.forEach((obj,i) => {
                obj.listener.start();
            });
        }
        else {
            var found = this.listeners.find((o,i) => {
                if(o.name === name){
                    obj.listener.start();
                }
            });
        }
    }
}

export class ObjectListenerInstance {
    constructor(object,propName="__ANY__",onchange=this.onchange,interval="FRAMERATE") {

        if(propName !== "__ANY__") {
            if(typeof object[propName] === "function") {
                console.log("Warning: changes inside functions will not be detected");
            }
            if(typeof object[propName] === 'object') {
                for(var propName in object[propName]){
                    if(typeof object[propName] === "function"){
                        console.log("Warning: changes inside functions will not be detected");
                    }
                }
            }
        }

        this.onchange = onchange;

        this.object = object; //Objects are always passed by reference
        this.propName = propName;
        this.propOld = undefined;
        this.setListenerRef(propName);

        this.running = true;

        if(interval <= 0) {
            this.interval = 1; console.log("Min recommended interval set: 1ms");}
        else {
            this.interval = interval;
        }
        this.checker = requestAnimationFrame(this.check);

    }

    onchange = () => {
        console.log(this.propName," changed from: ", this.propOld," to: ", this.object[this.propName]);
    }

    setListenerRef = (propName) => {
        if(propName === "__ANY__") {
            this.propOld = JSON.parse(JSON.stringify(this.object));
        }
        else if(typeof this.object[propName] === "object"){
            this.propOld = JSON.parse(JSON.stringify(this.object[propName]));
        }
        else if(typeof this.object[propName] === "function"){
            console.error("Cannot listen to class or function instance");
        }
        else{
            this.propOld = this.object[propName] //usually a number;
        }
    }

    check = () => {

        if(this.propName === "__ANY__"){
            if(JSON.stringify(this.propOld) !== JSON.stringify(this.object)){
                this.onchange();
                this.setListenerRef(this.propName);
            }
        }
        else if(typeof this.object[this.propName] === "object") {
            if(JSON.stringify(this.propOld) !== JSON.stringify(this.object[this.propName])){
                this.onchange();
                this.setListenerRef(this.propName);
            }
        }
        else if(this.object[this.propName] !== this.propOld) {
            this.onchange();
            this.setListenerRef(this.propName);
        }
        if(this.running === true) {
            if(this.interval === "FRAMERATE"){
                this.checker = requestAnimationFrame(this.check);
            }
            else {
                setTimeout(()=>{this.checker = requestAnimationFrame(this.check)},this.interval);
            }
        };
    }

    start() {
        this.running = true;
        this.checker = requestAnimationFrame(this.check);
    }

    stop() {
        this.running = false;
        cancelAnimationFrame(this.checker);
    }

}


export function sortObjectByValue(object) { //Sorts number and string objects by numeric value. Strings have charcodes summed for comparison. Objects and functions are stringified.
    var sortable = [];
    for(var prop in object) {
        sortable.push([prop, object[prop]]);
    }

    sortable.sort(function(a,b) {
        var prop1 = a;
        var prop2 = b;
        if(typeof prop1[1] === "function"){
            prop1[1] = prop1[1].toString();
        }
        if(typeof prop2[1] === "function"){
            prop2[1] = prop2[1].toString();
        }
        if(typeof prop1[1] === "object"){
            prop1[1] = JSON.stringify(prop1[1]);
        }
        if(typeof prop2[1] === "object"){
            prop2[1] = JSON.stringify(prop2[1]);
        }
        if(typeof prop1[1] === "string") {
            var temp = 0;
            prop1.forEach((char,i) => {
                temp += prop1.charCodeAt(i);
            });
            prop1 = temp;
        }
        if(typeof prop2[1] === "string") {
            var temp = 0;
            prop2.forEach((char,i) => {
                temp += prop2.charCodeAt(i);
            });
            prop2 = temp;
        }
        return prop1[1]-prop2[1];
    });

    var sorted = {};

    sortable.forEach((item) => {
       sorted[item[0]]=item[1];
    });

    return sorted;

}

export function sortObjectByPropName(object) {

    var sortable = [];

    for(var prop in object) {
        sortable.push([prop, object[prop]]);
    }

    sortable.sort(function(a,b) {
        return a[0] > b[0];
    });

    var sorted = {};

    sortable.forEach((item) => {
        sorted[item[0]]=item[1];
    });

    return sorted;

}


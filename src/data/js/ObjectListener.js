
/*
//Example:
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

    //add a new object listener with specified props (or none to watch the whole object), and onchange functions, with optional interval
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

    onchange(newCallback=null,name=null){
        if(name === null) {
            this.listeners.forEach((obj,i) => {
                obj.listener.onchange = newCallback;
            });
        }
        else {
            var found = this.listeners.find((o,i) => {
                if(o.name === name) {
                    o.listener.onchange = newCallback;
                }
            });
        }
    }

    //Add extra onchange functions
    addFunc = (newCallback=null,name=null) => {
        if(name === null) {
            this.listeners.forEach((obj,i) => {
                obj.listener.onchangeFuncs.push(newCallback);
            });
        }
        else {
            var found = this.listeners.find((o,i) => {
                if(o.name === name) {
                    o.listener.onchangeFuncs.push(newCallback);
                }
            });
        }
    }

    //Remove extra onchange functions
    removeFuncs = (name = null, idx = null) => {
        if(name === null) {
            this.listeners.forEach((obj,i) => {
                obj.listener.removeFuncs(idx);
            });
        }
        else {
            var found = this.listeners.find((o,i) => {
                if(o.name === name) {
                    o.listener.removeFuncs(idx);
                }
            });
        }
    }

    //Stop all or named listeners
    stop(name=null) {
        if(name === null) {
            this.listeners.forEach((obj,i) => {
                obj.listener.stop();
            });
        }
        else {
            var found = this.listeners.find((o,i) => {
                if(o.name === name) {
                    o.listener.stop();
                }
            });
        }
    }

    //Restart all or named listeners
    start(name=null) {
        if(name === null) {
            this.listeners.forEach((obj,i) => {
                obj.listener.start();
            });
        }
        else {
            var found = this.listeners.find((o,i) => {
                if(o.name === name) {
                    o.listener.start();
                }
            });
        }
    }
}

//Instance of an object listener. This will subscribe to object properties (or whole objects) and run attached functions when a change is detected.
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

        this.onchange = onchange; //Main onchange function
        this.onchangeFuncs = []; //Execute extra functions pushed to this array

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

    //Main onchange execution
    onchange = () => {
        console.log(this.propName," changed from: ", this.propOld," to: ", this.object[this.propName]);
    }

    //Add extra onchange functions for execution
    addFunc = (onchange) => {
        this.onchangeFuncs.push(onchange);
    }

    //Remove extra onchange functions
    removeFuncs(idx = null) {
        if(idx === null) {
            this.onchangeFuncs = [];
        }
        else if(this.onchangeFuncs[idx] !== undefined) {
            this.onchangeFuncs.splice(idx,1);
        }
    }

    //Execute extra onchange functions
    onchangeMulti = () => {
        this.onchangeFuncs.forEach((func,i) => {
            func();
        });
    }

    //Update listener reference copy.
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
                if(this.onchangeFuncs.length > 0) { this.onchangeMulti(); }
                this.setListenerRef(this.propName);
            }
        }
        else if(typeof this.object[this.propName] === "object") {
            if(JSON.stringify(this.propOld) !== JSON.stringify(this.object[this.propName])){
                this.onchange();
                if(this.onchangeFuncs.length > 0) { this.onchangeMulti(); }
                this.setListenerRef(this.propName);
            }
        }
        else if(this.object[this.propName] !== this.propOld) {
            this.onchange();
            if(this.onchangeFuncs.length > 0) { this.onchangeMulti(); }
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


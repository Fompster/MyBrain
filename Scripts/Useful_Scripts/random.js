// Gives a uniform random number 
// return a random number between min-max inclusive
export function randomU(min, max) {return Math.floor(Math.random()*(max - min + 1) + min);}

// return a random number between min-max inclusive
// best v is 4
export function randomG(min, max, v){ 
    var r = 0;
    for(var i = v; i > 0; i --){
        r += Math.random();
    }
    var dist = r / v;
    var value = dist*(max - min + 1) + min;
    return value;
}
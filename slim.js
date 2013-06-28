/**
 * User: flying
 * Date: 13-6-26
 * Time: PM4:53
 */


// static functions
var Functions =
{
  Identity: function (x) { return x; },
  True: function () { return true; },
  Blank: function () { }
}

// static const
var Types =
{
  Boolean: typeof true,
  Number: typeof 0,
  String: typeof "",
  Object: typeof {},
  Undefined: typeof undefined,
  Function: typeof function () { }
}

// static utility methods
var Utils =
{
  // Create anonymous function from lambda expression string
  CreateLambda: function (expression)
  {
    if (expression == null) return Functions.Identity;
    if (typeof expression == Types.String)
    {
      if (expression == "")
      {
        return Functions.Identity;
      }
      else if (expression.indexOf("=>") == -1)
      {
        return new Function("$,$$,$$$,$$$$", "return " + expression);
      }
      else
      {
        var expr = expression.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/);
        return new Function(expr[1], "return " + expr[2]);
      }
    }
    return expression;
  },

  Compare: function (a, b)
  {
    return (a === b) ? 0
      : (a > b) ? 1
      : -1;
  },

  Dispose: function (obj)
  {
    if (obj != null) obj.Dispose();
  }
}

/**
 * log a object
 */
Object.prototype.sLog = function(){
  if(console){
    console.log(this);
  }
}


/**
 * for node.js, dumps an object to file
 * @param filename
 */
Object.prototype.sDump = function(filename){
  if(require){
    var fs = require('fs');
    fs.writeFileSync(filename, JSON.stringify(this))
  }
}

/**
 * filter an array
 * @param fun
 * @returns {Array}
 */
Array.prototype.sFilter = function(fun /*, thisp */)
{
  "use strict";

  if (this == null)
    throw new TypeError();

  var t = Object(this);
  var len = t.length >>> 0;
  if(typeof  fun === Types.String){
    fun = Utils.CreateLambda(fun)
  }
  if (typeof fun != Types.Function)
    throw new TypeError();

  var res = [];
  var thisp = arguments[1];
  for (var i = 0; i < len; i++)
  {
    if (i in t)
    {
      var val = t[i]; // in case fun mutates this
      if (fun.call(thisp, val, i, t))
        res.push(val);
    }
  }

  return res;
};


/**
 * traverse an array
 * @param callback
 * @param thisArg
 */
Array.prototype.sForEach = function forEach( callback, thisArg ) {

  var T, k;

  if ( this == null ) {
    throw new TypeError( "this is null or not defined" );
  }

  // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
  var O = Object(this);

  // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
  // 3. Let len be ToUint32(lenValue).
  var len = O.length >>> 0; // Hack to convert O.length to a UInt32

  // 4. If IsCallable(callback) is false, throw a TypeError exception.
  // See: http://es5.github.com/#x9.11
  if(typeof callback === Types.String){
    callback = Utils.CreateLambda(callback)
  }
  if (typeof callback != Types.Function)
    throw new TypeError();

  // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
  if ( thisArg ) {
    T = thisArg;
  }

  // 6. Let k be 0
  k = 0;

  // 7. Repeat, while k < len
  while( k < len ) {

    var kValue;

    // a. Let Pk be ToString(k).
    //   This is implicit for LHS operands of the in operator
    // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
    //   This step can be combined with c
    // c. If kPresent is true, then
    if ( Object.prototype.hasOwnProperty.call(O, k) ) {

      // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
      kValue = O[ k ];

      // ii. Call the Call internal method of callback with T as the this value and
      // argument list containing kValue, k, and O.
      callback.call( T, kValue, k, O );
    }
    // d. Increase k by 1.
    k++;
  }
  // 8. return undefined
};


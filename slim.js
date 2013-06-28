/**
 * Author: FlyingShang
 * Date: 13-6-26
 * Time: PM4:53
 */

(function (){

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

  var FS = require?require('fs'):Types.Undefined;

  var Utils =
  {
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
    }
  }

  var ProcessPara = function(para){
    if(typeof para === Types.String){
      return Utils.CreateLambda(para);
    }else if(typeof para === Types.Function ){
      return para;
    }else{
      throw new TypeError()
    }
  }

  /**
   * log object
   */
  Object.prototype.sLog = function(lambda){
    if(console){
      console.log(this);
    }
    return this;
  }


  /**
   * if node.js, dumps an object to file
   * else dumps string to console
   * @param filename
   */
  Object.prototype.sDumps = function(filename){
    if(FS){
      FS.writeFileSync(filename, JSON.stringify(this))
    }else{
      if(console){
        console.log(JSON.stringify(this))
      }
    }
    return this;
  }


  /**
   * node.js only, loads an object from file
   * @param filename
   */
  Object.prototype.sLoads= function(filename){
    var rtn;
    if(FS){
      rtn = JSON.parse(FS.readFileSync(filename));
    }
    return rtn;
  }

  /**
   * filter array
   * @param lambda
   * @returns {Array}
   */
  Array.prototype.sFilter = function(lambda /*, thisp */)
  {
    "use strict";
    if (this == null)
      throw new TypeError();
    var t = Object(this);
    var len = t.length >>> 0;
    lambda = ProcessPara(lambda);
    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i]; // in case lambda mutates this
        if (lambda.call(thisp, val, i, t))
          res.push(val);
      }
    }
    return res;
  };


  /**
   * do something with the elements of the array
   * @param lambda
   */
  Array.prototype.sMap = function(lambda) {
    return this.map(ProcessPara(lambda));
  };
  
  Array.prototype.sReduce = function(lambda){
    lambda = ProcessPara(lambda)
    return this.reduce(lambda);
  }

  /**
   * Diffuse the array, Make it longer
   * @param lambda
   * @param thisArg
   */
  Array.prototype.sDiffuse = function(lambda) {

    var T, k;

    if ( this == null ) {
      throw new TypeError( "this is null or not defined" );
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    lambda = ProcessPara(lambda);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0; // Hack to convert O.length to a UInt32

    // 4. If IsCallable(lambda) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11

    var res = [];
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

        // ii. Call the Call internal method of lambda with T as the this value and
        // argument list containing kValue, k, and O.
        lambda.call( T, kValue, k, O );
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };

})();

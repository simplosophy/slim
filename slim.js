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
  Object.prototype.sLog = function(){
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

  Array.prototype.sSort = function(lambda){
    lambda = ProcessPara(lambda)
    return this.sort(lambda);
  }
  /**
   * Branch the array, Make it longer
   * @param lambda
   * @param thisArg
   */
  Array.prototype.sBranch = function(lambda) {
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
        var v = lambda.call(thisp, val, i, t)
        for(var j=0; j< v.length; j++){
          res.push(v[j])
        }
      }
    }
    return res;
  };

})();

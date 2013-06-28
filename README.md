slim
====

my handy javascript lib, which may help writing single-line code.  **warning Array and Object namespace would be polluted (`slim` members' name start with `s` and an upper case character follows).**
*****************************
**KEEP AN ARRAY IN YOUR MIND**
*****************************

#Object Methods
## 1.sLog
log the object to console, eg.

```
[1,2,{a:1}].sLog();
```
## 2.sDumps
if in node.js, serialize the invoking object string to file, 
otherwise, dumps string to console.
eg.

```
[1,2,3].sDumps('a.json');//a 'a.json' file would be created in node.js
```
## 3.sLoads
**node.js only**, load js object from file.
eg.

```
Object.sLoads('a.json');
```

#Array Methods
##1. sFilter
filtering an array for given condition(Lambda string or Funtion object),eg.

```
[1,2,3].sFilter('$>1&&$<3');//result is [2]
[{a:1},{a:2},{a:3}].sFilter('$.a>1');//result is [{a:2},{a:3}]
[1,2,3].sFilter(function(e){return e>1});//result is [2,3]
```
##2. sMap
do something with each element of the array, and return a new one(Lambda string or Funtion object),eg.

```
[1,2,{a:1}].sMap('$,i=>{"index":i,"value":$}');//result is :
	[ { index: 0, value: 1 },
	  { index: 1, value: 2 },
	  { index: 2, value: { a: 1 } } ]
[1,2,3].sFilter(function(e){return e+1});//result is [2,3,4]
```
##2. sReduce
reduce an array, and return one object(Lambda string or Funtion object),eg.

```
[1,2,3].sReduce('a,b=>a+b'); //result is : 6
```
slim
====

my handy javascript lib, which may help writing "chain" statement. you'll find it useful when dealing with some statistics issues.

**warning Array and Object's namespace would be polluted (slim.js members' name start with `s` followed by an upper case character, eg. 'Array.sFilter' ).**
*****************************
***KEEP AN ARRAY IN YOUR MIND***
*****************************

#Object Methods
## 1.sLog
log the object to console, eg.

```javascript
[1,2,{a:1}].sLog();
```
## 2.sDumps
if in node.js, serialize the invoking object string to file, 
otherwise, dumps string to console.
eg.

```javascript
[1,2,3].sDumps('a.json');//'a.json' file will be created in node.js
```
## 3.sLoads
**node.js only**, load js object from file.
eg.

```javascript
Object.sLoads('a.json');
```

#Array Methods
##1. sFilter
filtering an array for given condition(Lambda string or Funtion object),eg.

```javascript
[1,2,3].sFilter('$>1&&$<3');//result is [2]
[{a:1},{a:2},{a:3}].sFilter('$.a>1');//result is [{a:2},{a:3}]
[1,2,3].sFilter(function(e){return e>1});//result is [2,3]
```
##2. sMap
do something with each element of the array, and return a new one(Lambda string or Funtion object),eg.

```javascript
[1,2,{a:1}].sMap('$,i=>{"index":i,"value":$}');//result is :
	[ { index: 0, value: 1 },
	  { index: 1, value: 2 },
	  { index: 2, value: { a: 1 } } ]
[1,2,3].sMap('$*2');//result is [2,4,6]
```
##3. sReduce
reduce an array, and return one object(Lambda string or Funtion object),eg.

```javascript
[1,2,3].sReduce('a,b=>a+b'); //result is : 6
```
##4. sSort
sort an array, and returns sorted array, eg.

```javascript
[1,2,3,4].sMap('$,i=>{"i":i,"v":$}').sSort('a,b=>b.v-a.v') 
//result is : 
[ { i: 3, v: 4 },
  { i: 2, v: 3 },
  { i: 1, v: 2 },
  { i: 0, v: 1 } ]
```
##3. sBranch
branch each element of an array, and return a new array(Lambda string or Funtion object),eg.

```javascript
[1,2,3,4].sMap('$,i=>{"i":i,"v":$}').sBranch('$=>[$.i,$.v]').sLog() //result is :
[ 0, 1, 1, 2, 2, 3, 3, 4 ]
```

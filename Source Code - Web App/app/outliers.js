var isArray=Array.isArray;function outliers(r){if(isArray(r))return calc(r);var n=null,i="string"==typeof r&&r;return function(r,t,e){return n||(n=calc(e,i)),r=i?r[i]:r,!~n.indexOf(r)}}function calc(r,n){r=r.slice(0),n&&(r=r.map(function(r){return r[n]}));for(var i=(r=r.sort(function(r,n){return r-n})).length,t=median(r),e=iqr(r),a=[],u=0;u<i;u++)Math.abs(r[u]-t)>e&&a.push(r[u]);return a}function median(r){var n=r.length,i=~~(n/2);return n%2?r[i]:(r[i-1]+r[i])/2}function iqr(r){var n=r.length,i=median(r.slice(0,~~(n/2)));return 1.5*(median(r.slice(Math.ceil(n/2)))-i)}
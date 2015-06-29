# Demo

---

## Normal usage


````html
<div class="chosen-city"></div>
````


````html
<div class="open">OPEN</div>

````


````javascript
var appCity = require('seedit-city');
var $ = require('jquery');
var city = new appCity({
  eleName:'.chosen-city',
  city:function(ele){
    console.log('当前城市'+ele.text()+'ID:'+ele.attr('data-city'))
     //Code...
  },
  province:function(ele){
    console.log('当前省份'+ele.text()+'ID:'+ele.attr('data-province'))
   //Code...
  }
});

$('.open').click(function(){
  city.openFun()
});

````



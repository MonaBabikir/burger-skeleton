<template>
  <div id="ordering" class="container">
    
    <button v-on:click="switchLang()">{{ uiLabels.language }}</button>
    <h1 id="head-line">Crafty Burger AB</h1>
    
    <img class="example-panel" src="@/assets/exampleImage.jpg">
    
    <h1>{{ uiLabels.ingredients }}</h1>

    <div class="ing-grid">
    <Ingredient
      ref="ingredient"
      v-for="item in ingredients"
      v-on:increment="addToOrder(item)"
      v-on:decrement="removeFromOrder(item)"
      :item="item" 
      :lang="lang"
      :key="item.ingredient_id">
    </Ingredient>
    </div>

    <h1>{{ uiLabels.order }}</h1>
    {{ chosenIngredients.map(item => item["ingredient_"+lang]).join(', ') }}, {{ price }} kr
    <button v-on:click="placeOrder()">{{ uiLabels.placeOrder }}</button>
    <button v-on:click="addToCart()">add to cart</button>

    {{ordertocart}}
    <h1>  {{"your order number is: " +orderNumber}}</h1>

    <h1>{{ uiLabels.ordersInQueue }}</h1>
    <div>
      <OrderItem 
        v-for="(order, key) in orders"
        v-if="order.status !== 'done'"
        :order-id="key"
        :order="order"
        :ui-labels="uiLabels"
        :lang="lang"
        :key="key">
      </OrderItem>
    </div>
  </div>
</template>
<script>

//import the components that are used in the template, the name that you
//use for importing will be used in the template above and also below in
//components
import Ingredient from '@/components/Ingredient.vue'
import OrderItem from '@/components/OrderItem.vue'

//import methods and data that are shared between ordering and kitchen views
import sharedVueStuff from '@/components/sharedVueStuff.js'


/* instead of defining a Vue instance, export default allows the only 
necessary Vue instance (found in main.js) to import your data and methods */

export default {
  name: 'Ordering',
  components: {
    Ingredient,
    OrderItem,
  },
  mixins: [sharedVueStuff], // include stuff that is used in both
                        // the ordering system and the kitchen
  data: function() { //Not that data is a function!
    return {
      chosenIngredients: [],
      price: 0,
      orderNumber: "",
      ordertocart:''
    }
  },
  // props:{
  //   ordertocart: String
  // },
  created: function () {
    this.$store.state.socket.on('orderNumber', function (data) {
      this.orderNumber = data;
    }.bind(this));
  },
  methods: {
    addToOrder: function (item) {
      if(item.stock >= 1){
        this.chosenIngredients.push(item);
        this.price += +item.selling_price;
      }
      else{
        alert("Sorry, this ingredient not available in the stock :(");
      }
    },

    removeFromOrder:function (item) {
        if( this.chosenIngredients.indexOf(item) !== -1 ){
          this.chosenIngredients.splice( this.chosenIngredients.indexOf(item), 1 );
          // this.chosenIngredients.pop(item);
          this.price -= +item.selling_price;
        }
    },
    placeOrder: function () {
      var i,
      //Wrap the order in an object
        order = {
          ingredients: this.chosenIngredients,
          price: this.price
        };
      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      this.$store.state.socket.emit('order', {order: order});
      //set all counters to 0. Notice the use of $refs
      for (i = 0; i < this.$refs.ingredient.length; i += 1) {
        this.$refs.ingredient[i].resetCounter();
      }
      this.price = 0;
      this.chosenIngredients = [];
    },

    addToCart: function(){
        var i,
            //Wrap the order in an object
            order = {
                ingredients: this.chosenIngredients,
                price: this.price
            };
        // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
        this.$store.state.socket.emit('addItem', {order: order});
        // io.emit('addItem', 'second');
        // this.$store.commit('changeHello', 'second');
        console.log("ana honaaaa fi al ordering");
        // this.ordertocart = this.$store.getters.getHello;
        //set all counters to 0. Notice the use of $refs
        for (i = 0; i < this.$refs.ingredient.length; i += 1) {
            this.$refs.ingredient[i].resetCounter();
        }
        this.price = 0;
        this.chosenIngredients = [];
    },
  }
}


</script>
<style scoped>
/* scoped in the style tag means that these rules will only apply to elements, classes and ids in this template and no other templates. */
#ordering {
  margin:auto;
  max-width: 40em;
}

.example-panel {
  position: fixed;
  left:0;
  top:0;
  z-index: -2;
}
.ingredient {
  border: 1px solid #ccd;
  padding: 5px;
  width: 7em;
  height: 7em;
  background-image: url('~@/assets/exampleImage.jpg');
  color: white;
}

#head-line {
	padding: 0px 150px 40px;
	font-size: 24pt;
}

.ing-grid{
  display: grid;
  grid-gab: 1em;
  grid-template-columns: repeat(auto-fit, calc(7em + 10px));
}
</style>
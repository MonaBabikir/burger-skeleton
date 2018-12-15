<template>
    <div> Cart
        <h1> Your Cart items</h1>

        <!--<div>{{ordertocart}}</div>-->
        <!--<ul>-->
            <!--<li v-for="item in ordertocart" :key="item">-->
                <!--{{item.order.ingredients[0].ingredient_en}} - {{item.order.price}}-->
            <!--</li>-->
        <!--</ul>-->

        <div v-for="(item) in ordertocart" :key="item">
            {{"Burger " +item.id}} : {{item.data.order}}
        </div>

    </div>
</template>

<script>
    export default {
        name: "Cart",
        data: function () {
            return{
                ordertocart:[]
            }

        },
        created: function (){
            this.$store.state.socket.on('addItem2', function (data) {
                var id =this.ordertocart.length;
                this.ordertocart.push({id ,data});
                console.log("ana honaaaa fi al cart");
                console.log(data);
                // if (typeof data.ingredients !== 'undefined') {
                //     this.ingredients = data.ingredients;
                // }
            }.bind(this));
        }

    }
</script>

<style scoped>

</style>
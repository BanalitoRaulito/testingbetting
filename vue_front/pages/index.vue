<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      hello
      <Player v-for="(s, i) in this.$store.searching" :key="i"/>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Player from "../components/Player.vue";

export default {
  name: "Todos",
  components: {Player},

  head() {
    return {
      script: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.js' }
      ],
    }
  },

  data(){
    return {
      //socket: io.connect(window.location.hostname +':'+ myPort, {secure: true})
    }
  },

  create(){
    this.socket = io.connect(window.location.hostname +':'+ 3001, {secure: true})
    this.socket.on("sendInfo", data => console.log(data))
  },

  methods: {
    saved(){
      this.$store.commit('increment', 2)
    }
  }
};
</script>

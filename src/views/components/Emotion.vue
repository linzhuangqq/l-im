<template>
  <div class="chat-emotion-wrap">
    <table class="table" v-if="emoji && emoji.icons.length > 0">
      <tr v-for="r in (Math.ceil(emoji.icons.length/col))">
        <td v-for="c in col">
          <img class="chat-emotion-picture" v-on:click="selected(emoji.icons[(((r-1)*col)+ c)])"
               v-if="emoji.icons.length-1>=(((r-1)*col)+ c)" v-bind:title="emoji.icons[(((r-1)*col)+ c)].content"
               v-bind:alt="emoji.icons[(((r-1)*col)+ c)].content"
               v-on:mouseenter="mouseenter(emoji.icons[(((r-1)*col)+ c)],$event)"
               v-on:mouseleave="mouseleave(emoji.icons[(((r-1)*col)+ c)],$event)"
               v-bind:src="path+emoji.icons[(((r-1)*col)+ c)].thumb"/>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
  export default {
    actions: [],
    getters: [
      'emoji'
    ],
    data () {
      return {
        col: 10, // 列
        path: 'js/'
      }
    },
    methods: {
      selected: function (icon) {
        this.$emit('sendemotion', icon)
      },
      mouseenter: function (icon, event) {
        event.target.src = this.path + icon.url
      },
      mouseleave: function (icon, event) {
        event.target.src = this.path + icon.thumb
      }
    }
  }
</script>

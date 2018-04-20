<template>
  <div class="talk-contents">
    <div class="talk-inner" v-if="currentTopicId != 0">
      <div class="talk-nav">
        <div class="talk-title">
          聊天
        </div>
      </div>
      <div class="content">
         <div v-for="msgObj in currentMessages">
          <div  class="talk-space self-talk" 
                v-if="msgObj.send == userInfo.name"
                >
            <div class="talk-content">
              <div class="talk-word talk-word-self">
              <template v-if="msgObj.t == 'text'">
                <el-tooltip class="item" effect="dark" :content="format(msgObj.tm)" placement="top-start">
                  <p>{{ msgObj.content }}<i class="swip"></i></p>
                </el-tooltip>
              </template>
              <template v-if="msgObj.t == 'image'">
                <el-tooltip class="item" effect="dark" :content="format(msgObj.tm)" placement="top-start">
                  <a target="_blank" :href="msgObj.content"><img :src="msgObj.content" style="max-height: 300px;max-height:300px;" /><i class="swip"></i></a>
                </el-tooltip>
              </template>
              <template v-if="msgObj.t=='emoji'">
                <el-tooltip class="item" effect="dark" :content="format(msgObj.tm)" placement="top-start">
                  <img class="chat-custom-photo chat-custom-emotion" v-bind:src="getEmotionPath(msgObj.content)" />
                </el-tooltip>
              </template>
            </div>
          </div>
          </div>
          <div  class="talk-space user-talk" v-else >
            <div class="talk-all">{{ msgObj.send }}</div>
            <div class="talk-content">
              <div class="talk-word talk-word-user">
                <template v-if="msgObj.t == 'text'">
                  <el-tooltip class="item" effect="dark" :content="format(msgObj.tm)" placement="top-start">
                    <p>{{ msgObj.content }}<i class="swip-user"></i></p>
                  </el-tooltip>
                </template>
                <template v-if="msgObj.t == 'image'">
                  <el-tooltip class="item" effect="dark" :content="format(msgObj.tm)" placement="top-start">
                    <a target="_blank" :href="msgObj.content"><img :src="msgObj.content"  style="max-height: 300px;max-height:300px;" /><i class="swip"></i></a>
                  </el-tooltip>
                </template>
                <template v-if="msgObj.t=='emoji'">
                  <el-tooltip class="item" effect="dark" :content="format(msgObj.tm)" placement="top-start">
                    <img class="chat-custom-photo chat-custom-emotion" v-bind:src="getEmotionPath(msgObj.content)" />
                  </el-tooltip>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="talker" :class="{'focus':hotArea}">
        <div class="talker-toolbar">
          <a class="talker-face"></a>
        </div>
        <textarea ref="message"
                  class="talker-input" type="text"
                  @focus="hotArea = true"
                  @blur="hotArea = false"
                  placeholder="请输入消息内容"
                  v-on:keyup.capture="sendChatKeyup"
                  v-on:paste.stop.capture="autoUploadHandler($event)"
                  v-on:drop.stop.capture="autoUploadHandler($event)"
                  maxlength="200"></textarea>
        <div class="action">
          <span class="talker-tip">按ENTER发送，SHIFT+ENTER换行</span>
          <a class="talker-tip talker-emoji" @click="selectUpload">上传图片
            <form class="upload-imgform" name="imgform" ref="form" style="display: inline;">
              <input type="file" ref="upload" style="cursor:pointer; display: none" v-on:change="changeUpload" accept="image/jpeg,image/png,image/jpg,image/gif" class="img-input" name="file">
            </form>
          </a>
          <a class="talker-tip talker-emoji" style="position: relative" @click="toggleEmotion">
            表情
            <emotion ref="emotion" @sendemotion="sendChat" v-if="emotionVisible"></emotion>
          </a>
          <span class="talker-send" @click="send">发送</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    actions: [
      'sendMessage',
      'uploadPicture'
    ],
    getters: [
      'currentTopicId',
      'messages',
      'userInfo',
      'currentMessages'
    ],
    data () {
      return {
        hotArea: false,
        emotionVisible: false
      }
    },
    methods: {
      send () {
        this.sendMessage({topic: this.currentTopicId, message: this.$refs.message.value, t: 'text'}).then(() => {
          this.$refs.message.value = ''
        })
      },
      changeUpload (e) {
        var that=this
        if(e.target.files.length==0)return
        var file=e.target.files[0]
        that.$refs.form.reset()
        if(window.FileReader) {
          var fr = new FileReader()
          fr.onloadend = function(e) {
            that.url = e.target.result
          };
          fr.readAsDataURL(file)
        }
        this.uploadPicture({file: file}).then(function(data){
          let src = 'http://owvn3fgw6.bkt.clouddn.com/' + data.key + '?imageView2' // 原图
          let thumbSrc = src + '/2/w/800/h/600' // 缩略图
          that.sendChatImg(thumbSrc)
        })
      },
      selectUpload () {
        this.$refs.upload.click()
      },
      getEmotionPath: function (url) {
        return 'js/' + url
      },
      sendChat (data) {
        this.sendMessage({
          t: 'emoji',
          message: data.url,
          topic: this.currentTopicId
        })
      },
      toggleEmotion () {
        this.emotionVisible = !this.emotionVisible
      },
      sendChatKeyup: function (e) {
        e.preventDefault()
        if (e.keyCode !== 13) {
          return
        }
        if (e.altKey || e.shiftKey || e.ctrlKey) {
          // 换行
          if (e.shiftKey) return
          this.$refs.message.value = this.$refs.message.value + '\n'
        } else {
          // 发送
          this.send()
        }
      },
      sendAndInsertImage: function (file) {
        var that = this
        this.uploadPicture({file: file}).then(function (data) {
          let src = 'http://owvn3fgw6.bkt.clouddn.com/' + data.key + '?imageView2' // 原图
          let thumbSrc = src + '/2/w/800/h/600' // 缩略图
          that.sendChatImg(thumbSrc)
        })
      },
      sendChatImg: function (url) {
        this.sendMessage({topic: this.currentTopicId, message: url, t: 'image'}).then(() => {
          this.$refs.message.value = ''
        })
      },
      autoUploadHandler: function (e) {
        var hasImg = false
        let items
        // 获取粘贴板文件列表或者拖放文件列表
        items = e.type === 'paste' ? getPasteImage(e) : getDropImage(e)
        if (items) {
          e.preventDefault()
          let len = items.length
          let file
          while (len--) {
            file = items[len]
            if (file.getAsFile) file = file.getAsFile()
            if (file && file.size > 0 && /image\/\w+/i.test(file.type)) {
              this.sendAndInsertImage(file)
              hasImg = true
            }
          }
          if (hasImg) return false
        }
        // 粘贴拖拽上传图片
        function getPasteImage (e) {
          return e.clipboardData && e.clipboardData.items && e.clipboardData.items.length === 1 && /^image\//.test(e.clipboardData.items[0].type) ? e.clipboardData.items : null
        }

        function getDropImage (e) {
          return e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files : null
        }
      },
      format (date) {
          date = new Date(date)
          let format = 'yyyy-MM-dd hh:mm:ss:S'
        
          var o = {
              "M+": date.getMonth() + 1,  //month
              "d+": date.getDate(),     //day
              "h+": date.getHours(),    //hour
              "m+": date.getMinutes(),  //minute
              "s+": date.getSeconds(), //second
              "q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
              "S": date.getMilliseconds() //millisecond
          }
          if (typeof date == "string") { return date; }
          if (format == null || format == "undefined") { format = "yyyy-MM-dd"; }

          if (/(y+)/.test(format)) {
              format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
          }

          for (var k in o) {
              if (new RegExp("(" + k + ")").test(format)) {
                  format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
              }
          }
          return format;
      }
    }
  }
</script>

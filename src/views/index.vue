<template>
  <div id="app">
    <topics></topics>
    <messages></messages>
  </div>
</template>
<script>
  export default {
    actions: [
      'register',
      'proxy',
      'isLogin'
    ],
    getters: [
      'messages'
    ],
    data () {
      return {

      }
    },
    methods: {
      login () {
        this.$prompt('请输入用户名', '登录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: false
        }).then(({ value }) => {
          this.register({name: value})
        }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            })
          })
      },
      loginSuccess () {
        this.$message({
          type: 'success',
          message: '登录成功'
        })
      },
      loginError () {
        this.$message({
          type: 'error',
          message: '用户名重复'
        })
        setTimeout(() => {this.login()}, 3000)
      },
      proxySelf () {
        this.proxy(this)
      },
      error (t) {
        this.$message({
          type: 'error',
          message: t
        })
      },
      success (t) {
         this.$message({
          type: 'success',
          message: t
        })
      }
    },
    mounted () {
      this.proxySelf()
      this.isLogin()
    },
    created () {
//      if (!localStorage.getItem('userInfo')) {
//        let text = prompt('用户名', '请输入非中文非特殊字符的用户名')
//        if (text && text.length > 0) {
//          this.register(text)
//        }
//      }
    }
  }
</script>

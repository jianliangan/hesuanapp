<template>
  <el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large" @keyup.enter="login">
    <el-form-item prop="userName">
      <el-input v-model="form.userName" prefix-icon="el-icon-user" clearable :placeholder="$t('login.userPlaceholder')">
      </el-input>
    </el-form-item>
    <el-form-item prop="passWord">
      <el-input v-model="form.passWord" prefix-icon="el-icon-lock" clearable show-password
        :placeholder="$t('login.PWPlaceholder')"></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 10px"> </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 100%" :loading="islogin" round @click="login">{{ $t("login.signIn") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ApiToken } from "@/api/model/system/users.ts";
import { ApiSystemMenu } from "@/api/model/system/author.ts";
export default {
  data() {
    return {
      userType: "",
      form: {
        userName: "",
        passWord: "",
        autologin: false,
      },
      rules: {
        userName: [
          {
            required: true,
            message: this.$t("login.userError"),
            trigger: "blur",
          },
        ],
        passWord: [
          {
            required: true,
            message: this.$t("login.PWError"),
            trigger: "blur",
          },
        ],
      },
      islogin: false,
    };
  },

  mounted() { },
  methods: {
    async login() {
      var validate = await this.$refs.loginForm.validate().catch(() => { });
      if (!validate) {
        this.islogin = false;
        return false;
      }

      //this.$TOOL.crypto.MD5(this.form.password),
      this.islogin = true;
      var data = {
        userName: this.form.userName,
        passWord: this.form.passWord,
      };
      //获取token
      console.log("111", data);
      let resdata = await ApiToken(data).catch(err => {
      });


      if (!resdata) {
        this.islogin = false;
        return false;
      }
      this.$TOOL.cookie.set("TOKEN", resdata.token, {
        expires: this.form.autologin ? 24 * 60 * 60 : 0,
      });
      this.$TOOL.data.set("USER_INFO", resdata.userInfo);

      //获取菜单
      var menu = null;

      //menu = await this.$API.system.menu.myMenus.get()
      resdata = await ApiSystemMenu().catch(err => {
      });
      menu = resdata;

      this.islogin = false;
      if (menu.menu.length == 0) {
        this.$alert("当前用户无任何菜单权限，请联系系统管理员", "无权限访问", {
          type: "error",
          center: true,
        });
        return false;
      }
      this.$TOOL.data.set("MENU", menu.menu);
      this.$TOOL.data.set("PERMISSIONS", menu.permissions);

      this.$router.replace({
        path: "/",
      });
      ElMessage.success("登录成功！");
    },
  },
};
</script>

<style>

</style>

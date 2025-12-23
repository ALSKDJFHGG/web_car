<script lang="ts" setup>
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'

// 定义一个状态来控制当前显示的表单
const isLogin = ref(true);

// 表单数据
const loginForm = ref({ username: '', password: '' });
const registerForm = ref({ username: '', password: '', confirmPassword: '' });

// 错误信息
const loginErrors = ref({ username: '', password: '' });
const registerErrors = ref({ username: '', password: '', confirmPassword: '' });

// 切换表单显示
const toggleForm = () => {
  isLogin.value = !isLogin.value;
};

// 验证规则
const validateUsername = (username: string) => {
  const usernameRegex = /^[a-zA-Z0-9]{5,16}$/;
  return usernameRegex.test(username) ? '' : '用户名必须是5-16位的字母或数字';
};

const validatePassword = (password: string) => {
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{5,16}$/;
  return passwordRegex.test(password) ? '' : '密码必须是5-16位的字母、数字或特殊字符';
};

const validateConfirmPassword = (password: string, confirmPassword: string) => {
  return password === confirmPassword ? '' : '两次输入的密码不一致';
};

const rules = reactive<FormRules<typeof loginForm>>({
  username: [{ required: true, trigger: 'blur' }],
  password: [{ required: true, trigger: 'blur' }],
})

// 实时验证函数
const validateLoginUsername = () => {
  loginErrors.value.username = validateUsername(loginForm.value.username);
};

const validateLoginPassword = () => {
  loginErrors.value.password = validatePassword(loginForm.value.password);
};

const validateRegisterUsername = () => {
  registerErrors.value.username = validateUsername(registerForm.value.username);
};

const validateRegisterPassword = () => {
  registerErrors.value.password = validatePassword(registerForm.value.password);
};

const validateRegisterConfirmPassword = () => {
  registerErrors.value.confirmPassword = validateConfirmPassword(
    registerForm.value.password,
    registerForm.value.confirmPassword
  );
};

const submitLogin = () => {
  if (!loginErrors.value.username && !loginErrors.value.password) {
    alert('登录成功');
  }
};

const submitRegister = () => {
  if (
    !registerErrors.value.username &&
    !registerErrors.value.password &&
    !registerErrors.value.confirmPassword
  ) {
    alert('注册成功');
  }
};

import { userRegisterService } from '@/api/user.js'
const register = async() => {
  let result = await userRegisterService(registerForm);
  if(result.data.code === 0){
    alert(result.data.msg ? result.data.msg : '注册成功');
  }else{
    alert("注册失败");
  }
}
</script>

<template>
  <div class="form-container">
    <!-- 登录表单 -->
    <div v-if="isLogin" class="form-box">
      <h2>登录</h2>
      <!-- <form @submit.prevent="submitLogin">
        <div class="form-group">
          <label for="login-username">用户名</label>
            <el-input v-model="loginForm.username" style="width: 100%" @input="validateLoginUsername" placeholder="请输入用户名" />
          <p class="error" v-if="loginErrors.username">{{ loginErrors.username }}</p>
        </div>
        <div class="form-group">
          <label for="login-password">密码</label>
          <el-input v-model="loginForm.password" style="width: 100%" type="password" @input="validateLoginPassword" placeholder="请输入密码" show-password />
          <p class="error" v-if="loginErrors.password">{{ loginErrors.password }}</p>
        </div>
        <button type="submit" class="btn">登录</button>
      </form> -->
      <form @submit.prevent="submitLogin">
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username" label-position="top">
            <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" label-position="top">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item label-width="100px" class="center-button-item">
            <el-button type="primary" @click="submitLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </form>
      <p>还没有账号？<button class="link-btn" @click="toggleForm">注册</button></p>
    </div>

    <!-- 注册表单 -->
    <div v-else class="form-box">
      <h2>注册</h2>
      <form @submit.prevent="submitRegister">
        <div class="form-group">
          <label for="register-username">用户名</label>
          <el-input v-model="registerForm.username" style="width: 100%" @input="validateRegisterUsername"
            placeholder="请输入用户名" />
          <p class="error" v-if="registerErrors.username">{{ registerErrors.username }}</p>
        </div>
        <div class="form-group">
          <label for="register-password">密码</label>
          <el-input v-model="registerForm.password" style="width: 100%" type="password"
            @input="validateRegisterPassword" placeholder="请输入密码" show-password />
          <p class="error" v-if="registerErrors.password">{{ registerErrors.password }}</p>
        </div>
        <div class="form-group">
          <label for="register-confirm-password">确认密码</label>
          <el-input v-model="registerForm.confirmPassword" style="width: 100%" type="password"
            @input="validateRegisterConfirmPassword" placeholder="请再次输入密码" show-password />
          <p class="error" v-if="registerErrors.confirmPassword">{{ registerErrors.confirmPassword }}</p>
        </div>
        <button type="submit" class="btn" @click="register">注册</button>
      </form>
      <p>已有账号？<button class="link-btn" @click="toggleForm">登录</button></p>
    </div>
  </div>
</template>

<style scoped>
@import './css/Login.css';
</style>
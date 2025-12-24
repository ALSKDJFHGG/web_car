<script lang="ts" setup>
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'

// 定义一个状态来控制当前显示的表单
const isLogin = ref(true);

// 表单数据
const loginForm = ref({ phone: '', password: '' });
const registerForm = ref({ phone: '', password: '', confirmPassword: '' });

// 错误信息
const loginErrors = ref({ phone: '', password: '' });
const registerErrors = ref({ phone: '', password: '', confirmPassword: '' });

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
  phone: [{ required: true, trigger: 'blur' }],
  password: [{ required: true, trigger: 'blur' }],
})

// 实时验证函数
const validateLoginPhone = () => {
  loginErrors.value.phone = validateUsername(loginForm.value.phone);
};

const validateLoginPassword = () => {
  loginErrors.value.password = validatePassword(loginForm.value.password);
};

const validateRegisterPhone = () => {
  registerErrors.value.phone = validateUsername(registerForm.value.phone);
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

const submitRegister = () => {
  if (
    !registerErrors.value.phone &&
    !registerErrors.value.password &&
    !registerErrors.value.confirmPassword
  ) {
    alert('注册成功');
  }
};

// 调用注册接口
import { userRegisterService } from '@/api/user.js'
import { userLoginService } from '@/api/user.js';
const register = async() => {
  let result = await userRegisterService(registerForm);
  if(result.data.code === 0){
    alert(result.data.msg ? result.data.msg : '注册成功');
  }else{
    alert("注册失败");
  }
};

const submitLogin = async() => {
      // 准备登录数据
      const loginData = {
        phone: loginForm.value.phone,
        password: loginForm.value.password
      };
      
      // 调用登录接口
      const response = await userLoginService(loginData);
      
      // 登录成功处理
      alert('登录成功');
      console.log('登录响应:', response);   
};
</script>

<template>
  <div class="form-container">
    <!-- 登录表单 -->
    <div v-if="isLogin" class="form-box">
      <h2>登录</h2>
      <form @submit.prevent="submitLogin">
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px" class="demo-ruleForm">
          <el-form-item label="手机号" prop="phone" label-position="top">
            <el-input v-model="loginForm.phone" placeholder="请输入手机号"></el-input>
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
          <label for="register-phone">手机号</label>
          <el-input v-model="registerForm.phone" style="width: 100%" @input="validateRegisterPhone"
            placeholder="请输入手机号" />
          <p class="error" v-if="registerErrors.phone">{{ registerErrors.phone }}</p>
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
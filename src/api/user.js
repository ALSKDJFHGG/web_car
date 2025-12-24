import request from '@/utils/request.js'

export const userRegisterService = (registerData)=>{
    const params = new URLSearchParams();
    for (let key in registerData) {
        params.append(key,registerData[key]);
    }
    return request.post('/admin/auth/register',params.values);

}

export const userLoginService = (loginData) => {
    // 方式1：直接传递对象，axios会自动序列化为JSON
    return request.post('/admin/auth/login', loginData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
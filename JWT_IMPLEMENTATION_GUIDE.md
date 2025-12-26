# JWT实现说明文档

## 概述

本系统已成功集成JWT（JSON Web Token）安全认证机制，替换了原有的内存级token存储方案，提升了系统的安全性和可扩展性。

## 实现内容

### 1. 依赖配置

在 `pom.xml` 中添加了JWT相关依赖：
- `jjwt-api` (v0.12.3)
- `jjwt-impl` (v0.12.3)
- `jjwt-jackson` (v0.12.3)

### 2. 核心组件

#### 2.1 JwtProperties（JWT配置类）
- **位置**: `src/main/java/com/fift/spring_boot_carwork/config/JwtProperties.java`
- **功能**: 
  - 管理JWT相关配置（密钥、过期时间、token前缀等）
  - 通过 `@ConfigurationProperties` 从 `application.yml` 读取配置
- **关键配置**:
  - `secret`: JWT签名密钥（生产环境请修改）
  - `expiration`: Token过期时间（默认7天）
  - `tokenPrefix`: Token前缀（默认"Bearer "）

#### 2.2 JwtUtil（JWT工具类）
- **位置**: `src/main/java/com/fift/spring_boot_carwork/util/JwtUtil.java`
- **功能**:
  - 生成JWT Token
  - 验证Token有效性
  - 从Token中提取用户信息（userId、username、role）
  - 检查Token是否过期
- **主要方法**:
  - `generateToken(userId, username, role)`: 生成Token
  - `validateToken(token)`: 验证Token
  - `getUserIdFromToken(token)`: 获取用户ID
  - `getUsernameFromToken(token)`: 获取用户名
  - `getRoleFromToken(token)`: 获取角色
  - `extractToken(authHeader)`: 从Authorization header中提取Token

#### 2.3 JwtInterceptor（JWT拦截器）
- **位置**: `src/main/java/com/fift/spring_boot_carwork/interceptor/JwtInterceptor.java`
- **功能**:
  - 拦截需要认证的请求
  - 验证JWT Token
  - 将用户信息存入request attribute，供Controller使用
- **工作流程**:
  1. 从请求头中获取Authorization header
  2. 提取JWT Token（移除"Bearer "前缀）
  3. 验证Token有效性
  4. 如果验证通过，将用户信息存入request attribute
  5. 如果验证失败，返回401错误

#### 2.4 WebConfig（Web配置类）
- **位置**: `src/main/java/com/fift/spring_boot_carwork/config/WebConfig.java`
- **功能**:
  - 注册JWT拦截器
  - 配置拦截路径和排除路径
- **拦截规则**:
  - **拦截路径**: `/api/v1/admin/**`（管理端接口）
  - **排除路径**:
    - `/api/v1/admin/auth/login`（登录接口）
    - `/api/v1/admin/auth/register`（注册接口）
    - `/api/v1/admin/question-types`（基础数据接口，可选）
    - `/api/v1/admin/subjects`（基础数据接口，可选）

### 3. 服务层修改

#### 3.1 UserServiceImpl修改
- **位置**: `src/main/java/com/fift/spring_boot_carwork/service/serviceImpl/UserServiceImpl.java`
- **主要变更**:
  - 移除了内存级token存储（`TOKEN_STORE`）
  - 注入`JwtUtil`工具类
  - `login()`方法：使用JWT生成token
  - `Info()`方法：从JWT token中解析用户信息
  - `updatePwd()`方法：从JWT token中解析用户信息

### 4. 配置文件

#### 4.1 application.yml
在配置文件中添加了JWT相关配置：
```yaml
jwt:
  secret: your-secret-key-change-in-production-environment-min-256-bits-please-use-environment-variable-or-config-server
  expiration: 604800000  # 7天（毫秒）
  token-prefix: "Bearer "
  header-name: "Authorization"
```

## 使用方法

### 1. 登录获取Token

**请求示例**:
```http
POST /api/v1/admin/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "userId": 1,
      "username": "admin",
      "realname": "管理员",
      "phone": "13800138000",
      "role": "admin"
    }
  }
}
```

### 2. 使用Token访问受保护接口

**请求示例**:
```http
GET /api/v1/admin/auth/info
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**说明**:
- Token需要放在请求头的 `Authorization` 字段中
- Token前需要加上 `Bearer ` 前缀（注意空格）

### 3. 在Controller中获取用户信息

如果拦截器已经验证了token，可以直接从request attribute中获取用户信息：

```java
@GetMapping("/example")
public Result<?> example(HttpServletRequest request) {
    Long userId = (Long) request.getAttribute("userId");
    String username = (String) request.getAttribute("username");
    String role = (String) request.getAttribute("role");
    
    // 使用用户信息进行业务处理
    return Result.success();
}
```

## 安全建议

### 1. 生产环境配置

**重要**: 在生产环境中，请务必：

1. **修改JWT密钥**:
   - 在 `application.yml` 中修改 `jwt.secret`
   - 或者使用环境变量：`JWT_SECRET`
   - 密钥长度建议至少256位（32字符）

2. **使用HTTPS**:
   - 生产环境必须使用HTTPS协议传输Token
   - 防止Token在传输过程中被窃取

3. **Token过期时间**:
   - 根据业务需求调整Token过期时间
   - 建议设置合理的过期时间（如30分钟、1小时、7天等）

4. **密钥管理**:
   - 不要将密钥提交到代码仓库
   - 使用配置中心或环境变量管理密钥
   - 定期轮换密钥

### 2. 扩展功能建议

可以考虑添加以下功能来增强安全性：

1. **Refresh Token机制**:
   - 实现短期的Access Token和长期的Refresh Token
   - 当Access Token过期时，使用Refresh Token刷新

2. **Token黑名单**:
   - 实现Token注销功能
   - 将失效的Token加入黑名单

3. **多设备登录控制**:
   - 限制同一用户的登录设备数量
   - 新设备登录时踢出旧设备

4. **IP白名单**:
   - 限制特定IP才能访问管理端接口

## 技术细节

### Token结构

JWT Token包含以下信息：
- `userId`: 用户ID
- `username`: 用户名
- `role`: 用户角色（admin/user）
- `iat`: 签发时间
- `exp`: 过期时间

### 签名算法

使用HS256（HMAC-SHA256）算法对Token进行签名，确保Token的完整性和真实性。

### 异常处理

- Token为空：返回401 Unauthorized
- Token无效：返回401 Unauthorized
- Token过期：返回401 Unauthorized

## 测试建议

### 1. 功能测试

- ✅ 登录接口返回有效Token
- ✅ 使用有效Token访问受保护接口
- ✅ 使用无效Token访问受保护接口（应返回401）
- ✅ 使用过期Token访问受保护接口（应返回401）
- ✅ 未提供Token访问受保护接口（应返回401）

### 2. 安全性测试

- ✅ Token签名验证
- ✅ Token过期时间验证
- ✅ Token篡改检测

## 常见问题

### Q1: Token总是无效怎么办？

**A**: 检查以下几点：
1. Token是否包含"Bearer "前缀
2. Token是否已过期
3. JWT密钥是否与生成Token时使用的密钥一致
4. Token是否被正确传输（检查请求头）

### Q2: 如何延长Token有效期？

**A**: 修改 `application.yml` 中的 `jwt.expiration` 配置，单位为毫秒。

### Q3: 如何实现Token刷新？

**A**: 需要实现Refresh Token机制，可以参考上述"扩展功能建议"部分。

## 总结

JWT实现已完成，系统安全性得到显著提升。主要优势：

1. ✅ **无状态认证**: 不需要在服务器端存储session
2. ✅ **安全性**: 使用签名算法确保Token完整性
3. ✅ **可扩展性**: 易于分布式部署
4. ✅ **标准化**: 遵循JWT标准，易于与其他系统集成

现在系统已具备完善的安全认证机制，可以安全地部署到生产环境。


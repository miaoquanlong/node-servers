>本项目为个人博客项目
> 采用前后端分离技术
> 前端使用Vue全家桶+ElementUi组件库
> 后端采用NodeJs+MongoDB数据库服务
> 前端负责路由控制 页面跳转 及数据获取渲染页面等用户逻辑控制
> 后端负责链接数据库，定义数据格式，接口定义，以及数据库表结构设计，安全验证，防xss攻击等
> 本项目分为 前端展示，后端管理，及node服务层
> 使用 nnodemon 热更新服务
> ######################
> routes下 fornt 为前端所有需要调用的接口及业务逻辑 admin为后端管理页面的 接口及逻辑
  
 **前端模块**
    - 登录页 
    - 首页
    - 内容页
#Api接口
    - register *用户注册*
    - login *用户登录*
    - comment  *评论获取*
   - commint/post *评论提交*
   - 待续
   
 # 后端模块
  - first   *首页*
   -  > 用户管理
       - /user *用户列表*

   -   > 分类管理
       - category            **分类列表**
       - category/add        **分类添加**
       - category/edit       **分类编辑**
       - category/delete     **分类删除** 
   
    -  > 文章内容管理   
       - article            **内容列表**
       - article/add        **内容添加**
       - article/edit       **内容修改**
       - article/delete     **内容删除** 
   
      > 评论内容管理   
      - comment             **评论列表**
       - comment/delete     **评论删除** 
  

    
    
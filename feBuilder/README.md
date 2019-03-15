### 安装依赖
>node版本号 v10.3.0
 npm版本号  v6.1.0

### 使用说明

1、安装node&npm (版本参考上面说明)

2、cnpm install


3、项目打包

   1）本地编译
      A) 本地服务器调试
         npm run start --project=平台/项目名
      B) test 环境
         npm run test --project=平台/项目名
      C) box 环境
         npm run box  --project=平台/项目名
      D) online 环境
         npm run online  --project=平台/项目名
      E) test环境实时编译
         npm run test:watch  --project=平台/项目名
      F) test环境打包依赖分析
         npm run test:analysis  --project=平台/项目名
      G) 针对单独一个页面打包
                       --page=平台/项目名/页面名

   2）服务器远程编译 （功能已移除）
      A) test 环境
         npm run test_remote --project=平台/项目名
      B) test2 环境
         npm run test2_remote --project=平台/项目名
      C) test3 环境
         npm run test3_remote --project=平台/项目名
      D) box 环境
         npm run box_remote  --project=平台/项目名
      E) online 环境
         npm run online_remote  --project=平台/项目名



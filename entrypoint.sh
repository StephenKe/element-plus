#!/bin/bash
cat >/etc/nginx/conf.d/default.conf<<EOF
server {
    listen       80;
    server_name  localhost;
    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;
    add_header X-Frame-Options SAMEORIGIN;

    # 开启压缩传输功能
    gzip  on;
    # 优先使用静态.gz文件
    gzip_static on;
    # 大于1K的文件才压缩
    gzip_min_length 1k; #大于1K的文件才压缩
    gzip_buffers 4 16k;
    gzip_http_version 1.0;
    # 压缩等级， 1-9，等级越高压缩得越慢
    gzip_comp_level 6;
    # 匹配请求的contentType，这些contentType类型的内容会进行gzip压缩
    gzip_types  application/javascript text/plain application/json application/x-www-form-urlencoded text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    # ie6以下的浏览器不使用gzip功能
    gzip_disable "MSIE [1-6]\.";
    # 添加vary响应头,验证缓存
    gzip_vary on;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    error_page   404  /static/nginx404.html;
}
EOF
cp -rf /usr/share/nginx/www_temp/* /usr/share/nginx/html
nginx -g "daemon off;"

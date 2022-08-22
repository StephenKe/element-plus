FROM harbor-vip.pcloud.localdomain/pt00057_prd1/nginx:1.16.1
RUN mkdir -p /usr/share/nginx/www_temp/
RUN chmod 777 /usr/share/nginx/www_temp -R
COPY /docs/.vitepress/dist/ /usr/share/nginx/www_temp/
RUN chmod 777 /usr/share/nginx/html -R
# COPY docker/conf/default.conf /etc/nginx/conf.d/default.conf
ENV DIST_ENV=""
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
# replace the following COPY with this when building non-localized app
# COPY dist/pythia-shell/browser/en-US .
COPY dist/pythia-shell/browser/it/ .

EXPOSE 80


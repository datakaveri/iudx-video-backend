
FROM ubuntu

ENV DEBIAN_FRONTEND noninteractive
ENV PATH $PATH:/usr/local/nginx/sbin

RUN mkdir -p /src /config /logs /data /opt/nginx/html /record

RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get clean && \
  apt-get install -y --no-install-recommends build-essential \
  wget software-properties-common && \
  apt-get install -y --no-install-recommends ffmpeg && \
  apt-get install -y --no-install-recommends libpcre3-dev stunnel git \
  zlib1g-dev libssl-dev wget && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /src
RUN wget http://nginx.org/download/nginx-1.21.0.tar.gz && \
  tar zxf nginx-1.21.0.tar.gz && \
  rm nginx-1.21.0.tar.gz

RUN git clone https://github.com/sergey-dryabzhinsky/nginx-rtmp-module

WORKDIR /src/nginx-1.21.0
RUN ./configure --add-module=/src/nginx-rtmp-module \
  --with-http_ssl_module \
  --conf-path=/config/nginx.conf \
  --error-log-path=/logs/error.log \
  --http-log-path=/logs/access.log && \
  make && \
  make install

ADD nginx.conf /config/nginx.conf
ADD stat.xsl /opt/nginx/html/stat.xsl
EXPOSE 1935
EXPOSE 8080
EXPOSE 6060

WORKDIR /
CMD ["nginx", "-g", "daemon off;"]

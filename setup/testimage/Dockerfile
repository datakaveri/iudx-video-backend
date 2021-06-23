FROM ubuntu

RUN apt-get update 
RUN DEBIAN_FRONTEND="noninteractive" apt-get install -y vlc wget vlc-bin

RUN useradd -m vlcuser

COPY simulate_stream.sh /tmp/
RUN wget -c https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4 -O /tmp/sample.mp4
ENTRYPOINT ["/tmp/simulate_stream.sh"]
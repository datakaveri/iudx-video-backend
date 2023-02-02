#!/bin/bash
SCRIPTPATH=$( cd $(dirname $0) ; pwd -P );
name=$SCRIPTPATH"/sample.mp4";
sdp="rtsp://:8554/stream1";
sout="#transcode{acodec=none}:gather:rtp{sdp="$sdp"}";
su vlcuser -c "cvlc --loop -vvv $name --sout '$sout' :network-caching=1500 :sout-all :sout-keep"
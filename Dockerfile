FROM ubuntu:latest
LABEL authors="ttavera"

ENTRYPOINT ["top", "-b"]
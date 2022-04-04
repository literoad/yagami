#!/usr/bin/env bash

docker build -t cr.yandex/crprasudad2h8egspgoc/yagami-consumer:latest -f Dockerfile.consumer .
docker build -t cr.yandex/crprasudad2h8egspgoc/yagami-listener:latest -f Dockerfile.listener .
docker build -t cr.yandex/crprasudad2h8egspgoc/yagami-producer:latest -f Dockerfile.producer .

docker push cr.yandex/crprasudad2h8egspgoc/yagami-consumer:latest
docker push cr.yandex/crprasudad2h8egspgoc/yagami-listener:latest
docker push cr.yandex/crprasudad2h8egspgoc/yagami-producer:latest

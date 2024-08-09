#!/bin/bash

# Verificamos si se proporcionó un parámetro
if [ $# -ne 1 ]; then
    echo "Uso: $0 <opción>"
    exit 1
fi

# Verificamos si el parámetro es "-bs" o "-pf"
if [ "$1" = "-pf" ]; then
    # Desactivamos el servicio correspondiente a "-bs" y activamos el servicio correspondiente a "-pf"
    echo "Desactivando servicio-bs..."
    sudo systemctl stop colbits_basic_station.service
    sudo systemctl start sx1302_pkt_fwd.service
    sudo systemctl disable colbits_basic_station.service
    sudo systemctl enable sx1302_pkt_fwd.service
    rm /home/pi/.local/share/cockpit/plugin-bs
    ln -snf /opt/GUI/plugin-pf /home/pi/.local/share/cockpit/plugin-pf
    echo "servicio-bs desactivado y Servicio-pf activado."
elif [ "$1" = "-bs" ]; then
    # Desactivamos el servicio correspondiente a "-pf" y activamos el servicio correspondiente a "-bs"
    echo "Desactivando servicio-pf..."
    sudo systemctl stop sx1302_pkt_fwd.service
    sudo systemctl start colbits_basic_station.service
    sudo systemctl disable sx1302_pkt_fwd.service
    sudo systemctl enable colbits_basic_station.service
    rm /home/pi/.local/share/cockpit/plugin-pf
    ln -snf /opt/GUI/plugin-bs /home/pi/.local/share/cockpit/plugin-bs
    echo "Servicio-pf desactivado y servicio-bs activado."
else
    echo "Opción inválida. Debe ser '-bs' o '-pf'."
    exit 1
fi

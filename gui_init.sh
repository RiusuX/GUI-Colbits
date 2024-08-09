#!/bin/bash

#cambios login
sudo rm -rf /usr/share/cockpit/branding/debian
sudo mv /opt/GUI-Colbits/Gui_login/debian /usr/share/cockpit/branding/
sudo rm -rf /usr/share/cockpit/branding/default
sudo mv /opt/GUI-Colbits/Gui_login/default /usr/share/cockpit/branding/
sudo mv /opt/GUI-Colbits/Gui_login/shell/images/logo.png /usr/share/cockpit/shell/images/
sudo rm -f /usr/share/cockpit/shell/index.html
sudo mv /opt/GUI-Colbits/Gui_login/shell/index.html /usr/share/cockpit/shell/
sudo rm -f /usr/share/cockpit/static/login.css
sudo mv /opt/GUI-Colbits/Gui_login/static/login.css /usr/share/cockpit/static/
sudo rm -f /usr/share/cockpit/static/login.html
sudo mv /opt/GUI-Colbits/Gui_login/static/login.html /usr/share/cockpit/static/

sudo cp /opt/semtech/sx1302_hal/packet_forwarder/global_conf.json /home/pi/default_config.json
sudo cp /opt/semtech/sx1302_hal/packet_forwarder/global_conf.json /opt/GUI-Colbits/GUI/plugin-pf/src/Custom/default_config.json

sudo mkdir -p ~/.local/share/cockpit
# Función para verificar la conexión LTE
verificar_conexion_lte() {
    while true; do
        read -p "¿Tiene conexión LTE? (y/n): " conexion_lte
        case "$conexion_lte" in
            y|Y)
                # Crear enlace simbólico para plugin-lte
                sudo ln -snf /opt/GUI-Colbits/GUI/plugin-lte ~/.local/share/cockpit/plugin-lte
                echo "Enlace simbólico para plugin-lte creado."
                break
                ;;
            n|N)
                echo "No se tiene conexión LTE. No se creará el enlace simbólico para plugin-lte."
                break
                ;;
            *)
                echo "Ingreso incorrecto. Por favor, ingrese 's' para sí o 'n' para no."
                ;;
        esac
    done
}

# Función para preguntar sobre el tipo de plugin
preguntar_tipo_plugin() {
    while true; do
        read -p "¿Desea instalar 'pf' o 'bs'? (pf/bs): " tipo_plugin
        case "$tipo_plugin" in
            pf)
                sudo ln -snf /opt/GUI-Colbits/GUI/plugin-pf ~/.local/share/cockpit/plugin-pf
                echo "Enlace simbólico para plugin-pf creado."
                break
                ;;
            bs)
                sudo ln -snf /opt/GUI-Colbits/GUI/plugin-bs ~/.local/share/cockpit/plugin-bs
                echo "Enlace simbólico para plugin-bs creado."
                break
                ;;
            *)
                echo "Ingreso incorrecto. Por favor, ingrese 'pf' o 'bs'."
                ;;
        esac
    done
}

# Llamar a las funciones en el orden correcto
verificar_conexion_lte
preguntar_tipo_plugin

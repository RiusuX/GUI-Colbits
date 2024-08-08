//                                script for general view
//Declaracion de variables
var fileJSON = cockpit.file("/home/pi/packet_forwarder/global_conf.json", { syntax: JSON });
var fileDefault = cockpit.file("/home/pi/packet_forwarder/default_config.json", { syntax: JSON });
var sp_id = document.getElementById('gw_id'),
    sp_eui = document.getElementById('s_eui'),
    sp_type = document.getElementById('s_type'),
    sp_server = document.getElementById('s_server'),
    i_server = document.getElementById('a_server'),
    sp_pup = document.getElementById('s_pup'),
    i_pup = document.getElementById('a_pup'),
    sp_pdown = document.getElementById('s_pdown'),
    i_pdown = document.getElementById('a_pdown'),
    sp_id2 = document.getElementById('sid'),
    checkbox = document.getElementById('checkbox_1');

var scriptContent = `
#!/bin/bash
echo "Reiniciando el servicio"
# Comando para reiniciar el GW
sudo systemctl restart sx1302_pkt_fwd.service
`;
var scriptContent_2 = `
#!/bin/bash
# Obtener la dirección MAC de la interfaz Ethernet (eth0)
direccion_mac=$(ifconfig eth0 | grep -o -E '([0-9a-fA-F]{2}:){5}([0-9a-fA-F]{2})')
# Imprimir solo la dirección MAC (sin mensaje adicional)
echo "$direccion_mac"
`;

//                Declariacion de funciones
//span
function cambiarFormatoMac(mac) {
    // Dividir la dirección MAC en partes
    const partes = mac.split(':');

    // Convertir cada parte a mayúsculas y asegurarse de que cada parte tenga dos caracteres
    const nuevasPartes = partes.map(parte => parte.toUpperCase().padStart(2, '0'));

    // Agregar dos partes nuevas con el contenido "FF" al final
    nuevasPartes.push('FF', 'FF');

    // Obtener las dos últimas partes
    const ultimasPartes = nuevasPartes.slice(-2);

    // Eliminar las dos últimas partes del array original
    nuevasPartes.splice(-2);

    // Insertar las dos últimas partes en la mitad del array
    const mitad = Math.floor(nuevasPartes.length / 2);
    nuevasPartes.splice(mitad, 0, ...ultimasPartes);

    // Unir las partes con "-"
    const nuevaMac = nuevasPartes.join('-');

    return nuevaMac;
}

function obtener_mac(){
    cockpit.script(scriptContent_2, [], { superuser: "try" }).then((data, message) => {
        //console.log("d",data);
        sp_eui.textContent=cambiarFormatoMac(data);
    })
    .catch((exception, data) => {
        console.error("Error al ejecutar el script");
    });
}

function obtenerSubdominio(direccion) {
    // Dividir la cadena por puntos
    var partes = direccion.split('.');
    // Tomar la segunda parte resultante
    if (partes.length >= 2) {
        return partes[1];
    } else {
        return null; // Manejar el caso en el que la cadena no tenga suficientes partes
    }
}
function s_general(fileData){
    obtener_mac();
    sp_id.value = fileData.gateway_conf.gateway_ID;
    sp_id2.textContent = fileData.gateway_conf.gateway_ID;
    type = fileData.gateway_conf.server_address;
    sp_type.textContent = obtenerSubdominio(type);
    sp_server.textContent = fileData.gateway_conf.server_address;
    i_server.value = fileData.gateway_conf.server_address;
    sp_pup.textContent = fileData.gateway_conf.serv_port_up;
    i_pup.value = fileData.gateway_conf.serv_port_up;
    sp_pdown.textContent = fileData.gateway_conf.serv_port_down;
    i_pdown.value = fileData.gateway_conf.serv_port_down;
}
function span(){
    fileJSON.read()
    .then((content) => {
      // Si data es nulo, significa que el archivo no existe
      if (content === null) {
        console.log('File does not exist, check your WSBRD configuration');
      } else {
        var fileData = JSON.parse(JSON.stringify(content));
        s_general(fileData);
      }
    });
}
//pop up
function exit_togglePopup(){
    var overlay = document.getElementById('overlay'),
        popup = document.getElementById('popup');
    overlay.classList.remove('active');
    popup.classList.remove('active');
    overlay.style.display = 'none';
}
function edit_togglePopup() {
    var overlay = document.getElementById('overlay'),
        popup = document.getElementById('popup');
    overlay.classList.toggle('active');
    popup.classList.toggle('active');
    overlay.style.display = overlay.classList.contains('active') ? 'block' : 'none';
}
function add_togglePopup() {
    var overlay = document.getElementById('overlay'),
        popup = document.getElementById('popup');

    var i_server = document.getElementById('a_server'),
        i_pup = document.getElementById('a_pup'),
        i_pdown = document.getElementById('a_pdown');
    i_server.value = "";
    i_pup.value = "";
    i_pdown.value = "";
    overlay.classList.toggle('active');
    popup.classList.toggle('active');
    overlay.style.display = overlay.classList.contains('active') ? 'block' : 'none';
}
function eliminarFila(boton) {
    var b_add = document.getElementById('button_add');
    var fila = boton.parentNode.parentNode;
    var confirmacion = window.confirm("¿Está seguro de que desea eliminar esta fila?");
    if (confirmacion) {
        b_add.classList.remove('hidden');
        fila.classList.add('hidden');
    } else {
    }
}
//save and apply
function guardar_popup(){
            console.log("guardando");
            var boton = document.getElementById('button_edit'),
                b_add = document.getElementById('button_add');
            var fila = boton.parentNode.parentNode;
            fileJSON.read()
                .then((content) => {
                // Si data es nulo, significa que el archivo no existe
                if (content === null) {
                    console.log('File does not exist, check your WSBRD configuration');
                } else {
                    var fileData = JSON.parse(JSON.stringify(content));
                    fileData.gateway_conf.server_address = i_server.value;
                    fileData.gateway_conf.serv_port_up = parseInt(i_pup.value);
                    fileData.gateway_conf.serv_port_down = parseInt(i_pdown.value);
                    s_general(fileData);   
                    exit_togglePopup();
                    fila.classList.remove('hidden');
                    b_add.classList.add('hidden');
                    console.log("finish");
                }
                });
        }
function guardarInformacion() {
    console.log('Guardando dato')
    fileJSON.read()
        .then((content) => {
        // Si data es nulo, significa que el archivo no existe
        if (content === null) {
            console.log('File does not exist, check your WSBRD configuration');
        } else {
            var fileData = JSON.parse(JSON.stringify(content));
            //cambio de valores
            fileData.gateway_conf.server_address = i_server.value;
            fileData.gateway_conf.serv_port_up = parseInt(i_pup.value);
            fileData.gateway_conf.serv_port_down = parseInt(i_pdown.value);
            fileData.gateway_conf.gateway_ID = sp_id.value;
            //modificacion de .json
            fileData = JSON.stringify(fileData, null, 2)
            //fileJSON.replace(fileData);
            fileJSON.replace(JSON.parse(fileData));
            //fileJSON.replace("perra");
            //console.log(fileData);
            alert("Información guardada con éxito.");
            cockpit.script(scriptContent, [], { superuser: "try" }).then((data, message) => {
                console.log("Script ejecutado exitosamente");
                console.log('cambios aplicados');
            })
            .catch((exception, data) => {
                console.error("Error al ejecutar el script");
            });
            s_general(fileData);
        }
        });
}

function se_default() {
    fileDefault.read().then((content) => {
        // Si content es null, significa que el archivo no existe
        if (content === null) {
            console.log('File does not exist, check your WSBRD configuration');
        } else {
            try {
                //filedata = JSON.parse(content);
                filedata = content;
                console.log(filedata);
                fileJSON.replace(filedata).then(() => {
                    span();
                    alert("Información guardada con éxito.");
                    cockpit.script(scriptContent, [], { superuser: "try" }).then(() => {
                        console.log("Script ejecutado exitosamente");
                    }).catch((exception) => {
                        console.error("Error al ejecutar el script: ", exception);
                    });
                    console.log('cambios aplicados');
                }).catch((error) => {
                    console.error("Error al reemplazar el archivo: ", error);
                });
            } catch (error) {
                console.error("Error al parsear el contenido del archivo: ", error);
            }
        }
    }).catch((error) => {
        console.error("Error al leer el archivo: ", error);
    });
}

//code
checkbox.checked = false;
checkbox.addEventListener('change', function() {
    // Invertir las clases hidden en el evento change del checkbox
    sp_id.classList.toggle('hidden', !checkbox.checked);
    sp_id2.classList.toggle('hidden', checkbox.checked);
});
checkbox.dispatchEvent(new Event('change'));
span();
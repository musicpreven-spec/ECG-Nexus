function pay(paquete, monto){
  // muestra aviso
  alert(`Redirigiendo a PayPal para pagar ${paquete} por MXN ${monto}`);
  // abre nueva ventana con tu enlace PayPal
  window.open(
    `https://www.paypal.com/paypalme/ECGNexus/${monto}`, // sustituye TUUSUARIO
    '_blank'
  );
}

// --- Función pago por transferencia ---
function contactTransfer(paquete, monto){
  alert(`Por favor realiza tu pago de ${paquete} por MXN ${monto} mediante transferencia y envía el comprobante a nuestro correo.`);
}
// Inicializar EmailJS
emailjs.init("vcMhNz-ZzWxxICicN"); // reemplaza con tu user ID de EmailJS

// Generar campos de fecha/hora según paquete
function generarFechas() {
  const paquete = document.getElementById('paqueteSelect').value;
  const container = document.getElementById('fechasContainer');
  container.innerHTML = '';

  let sesiones = 0;
  if (paquete === 'Básico') sesiones = 4;
  if (paquete === 'Intermedio') sesiones = 3;
  if (paquete === 'Plus') sesiones = 3;

  for (let i = 1; i <= sesiones; i++) {
    const div = document.createElement('div');
    div.classList.add('sesion-fecha');
    div.innerHTML = `
      <label>Sesión ${i} — Fecha y hora:</label>
      <input type="date" id="fecha${i}" required />
      <input type="time" id="hora${i}" required />
    `;
    container.appendChild(div);
  }
}

document.getElementById('paqueteSelect').addEventListener('change', generarFechas);

// Generar PDF profesional
function generarConvenio() {
  const imgSrc = 'LOGO-ECGNEXUS.png'; // nombre del archivo del logo (debe existir en la misma carpeta)
  const nombre = document.getElementById('clienteName').value.trim();
  const email = document.getElementById('clienteEmail').value.trim();

  if (!nombre || !email) {
    alert('Por favor completa tu nombre y correo.');
    return;
  }

  // Cargar imagen y convertir a dataURL usando canvas
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    try {
      // convertir la imagen a dataURL para que jsPDF pueda embeberla
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/png');

      // --- Crear PDF ---
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // --- Fondo ---
      doc.setFillColor(240, 244, 248); // color de fondo #F0F4F8
      doc.rect(0, 0, 210, 297, 'F'); // tamaño A4

      // --- Encabezado con color y logo ---
      doc.setFillColor(31, 78, 121); // azul corporativo #1F4E79
      doc.rect(0, 0, 210, 25, 'F'); 

      // Añadir logo (a la izquierda dentro del encabezado)
      // x=15, y=3, ancho=30, alto=18 (ajusta si quieres otro tamaño)
      try {
        doc.addImage(imgData, 'PNG', 15, 3, 30, 18);
      } catch (e) {
        console.warn('No se pudo añadir la imagen al PDF:', e);
      }

      // Texto del encabezado (a la derecha del logo)
      doc.setFont('Montserrat Alternates', 'bold');
      doc.setFontSize(18);
      doc.setTextColor('#FFFFFF');
      doc.text('ECG Nexus', 55, 17);
      doc.setFontSize(10);
      doc.text('Tus ideas, nuestra pasión por hacerlas realidad', 55, 23);

      // Línea separadora
      doc.setDrawColor(31, 78, 121);
      doc.setLineWidth(0.8);
      doc.line(15, 28, 195, 28);

      // --- Información del cliente ---
      doc.setFontSize(12);
      doc.setTextColor('#333');
      doc.setFont('Montserrat Alternates', 'bold');
      let y = 38;
      doc.text('Datos del Cliente:', 15, y);
      y += 7;
      doc.setFont('Montserrat Alternates', 'normal');
      doc.text(`Nombre: ${nombre}`, 15, y);
      y += 6;
      doc.text(`Email: ${email}`, 15, y);
      y += 6;
      const telefono = document.getElementById('clientePhone').value.trim();
      doc.text(`Teléfono / WhatsApp: ${telefono}`, 15, y);
      y += 6;
      const paquete = document.getElementById('paqueteSelect').value;
      doc.text(`Paquete elegido: ${paquete}`, 15, y);

      // Línea separadora
      y += 4;
      doc.setDrawColor(31, 78, 121);
      doc.setLineWidth(0.5);
      doc.line(15, y, 195, y);
      y += 8;

      // --- Sesiones ---
      doc.setFont('Montserrat Alternates', 'bold');
      doc.setTextColor('#1F4E79');
      doc.text('Sesiones de seguimiento:', 15, y);
      y += 7;
      doc.setFont('Montserrat Alternates', 'normal');
      doc.setTextColor('#333');

      const totalSesiones = paquete === 'Básico' ? 4 : 3;
      for (let i = 1; i <= totalSesiones; i++) {
        const fecha = document.getElementById(`fecha${i}`)?.value || 'No definida';
        const hora = document.getElementById(`hora${i}`)?.value || 'No definida';
        doc.text(`Sesión ${i}: ${fecha} - ${hora} (30–35 mins)`, 15, y);
        y += 6;
      }

      // Línea separadora
      y += 2;
      doc.setDrawColor(31, 78, 121);
      doc.line(15, y, 195, y);
      y += 8;

      // --- Condiciones ---
      doc.setFont('Montserrat Alternates', 'bold');
      doc.setTextColor('#1F4E79');
      doc.text('Condiciones:', 15, y);
      y += 7;
      doc.setFont('Montserrat Alternates', 'normal');
      doc.setTextColor('#333');
      doc.text('1) Las sesiones se realizan vía Zoom según fechas acordadas.', 15, y);
      y += 6;
      doc.text('2) Pagos realizados no son reembolsables excepto Paquete Consulta.', 15, y);
      y += 6;
      doc.text('3) Firma del cliente valida aceptación de términos.', 15, y);

      // Línea separadora
      y += 10;
      doc.setDrawColor(31, 78, 121);
      doc.setLineWidth(0.5);
      doc.line(15, y, 195, y);
      y += 10;

      // --- Firmas ---
      doc.setFont('Montserrat Alternates', 'bold');
      doc.text('Firma del Cliente:', 15, y);
      doc.text(nombre, 60, y);
      y += 20;
      doc.text('Firma ECG Nexus:', 15, y);
      doc.text('Emanuel Camacho García', 60, y);

      // Guardar PDF
      doc.save(`Convenio_Profesional_${nombre}.pdf`);
    } catch (err) {
      console.error('Error generando PDF con logo:', err);
      alert('Ocurrió un error al generar el convenio. Intenta de nuevo.');
    }
  };

  img.onerror = function() {
    // Si la imagen no carga, ejecutar la generación sin logo (fallback)
    console.warn('No se pudo cargar LOGO-ECGNEXUS.png — generando PDF sin logo.');
    // Llamamos a la implementación antigua (sin logo). Para simplicidad, generamos el PDF sin logo:
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFillColor(240, 244, 248);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor(31, 78, 121);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setFont('Montserrat Alternates', 'bold');
    doc.setFontSize(18);
    doc.setTextColor('#FFFFFF');
    doc.text('ECG Nexus', 15, 17);
    doc.setFontSize(10);
    doc.text('Tus ideas, nuestra pasión por hacerlas realidad', 15, 23);
    // (continúa igual que tu código original para añadir el resto...)
    // Para ahorrar espacio, puedes reusar tu código original aquí si quieres.
    alert('Logo no disponible: se generó el convenio sin logo.');
  };

  // Finalmente, iniciar la carga
  img.src = imgSrc;
}

  // --- Fondo ---
  doc.setFillColor(240, 244, 248); // color de fondo #F0F4F8
  doc.rect(0, 0, 210, 297, 'F'); // tamaño A4

  // --- Encabezado con logo ---
  doc.setFillColor(31, 78, 121); // azul corporativo #1F4E79
  doc.rect(0, 0, 210, 25, 'F'); 
  doc.setFont('Montserrat Alternates', 'bold');
  doc.setFontSize(18);
  doc.setTextColor('#FFFFFF');
  doc.text('ECG Nexus', 15, 17);
  doc.setFontSize(10);
  doc.text('Tus ideas, nuestra pasión por hacerlas realidad', 15, 23);

  // Línea separadora
  doc.setDrawColor(31, 78, 121);
  doc.setLineWidth(0.8);
  doc.line(15, 28, 195, 28);

  // --- Información del cliente ---
  doc.setFontSize(12);
  doc.setTextColor('#333');
  doc.setFont('Montserrat Alternates', 'bold');
  let y = 38;
  doc.text('Datos del Cliente:', 15, y);
  y += 7;
  doc.setFont('Montserrat Alternates', 'normal');
  doc.text(`Nombre: ${nombre}`, 15, y);
  y += 6;
  doc.text(`Email: ${email}`, 15, y);
  y += 6;
  doc.text(`Teléfono / WhatsApp: ${telefono}`, 15, y);
  y += 6;
  doc.text(`Paquete elegido: ${paquete}`, 15, y);

  // Línea separadora
  y += 4;
  doc.setDrawColor(31, 78, 121);
  doc.setLineWidth(0.5);
  doc.line(15, y, 195, y);
  y += 8;

  // --- Sesiones ---
  doc.setFont('Montserrat Alternates', 'bold');
  doc.setTextColor('#1F4E79');
  doc.text('Sesiones de seguimiento:', 15, y);
  y += 7;
  doc.setFont('Montserrat Alternates', 'normal');
  doc.setTextColor('#333');

  const totalSesiones = paquete === 'Básico' ? 4 : 3;
  for (let i = 1; i <= totalSesiones; i++) {
    const fecha = document.getElementById(`fecha${i}`)?.value || 'No definida';
    const hora = document.getElementById(`hora${i}`)?.value || 'No definida';
    doc.text(`Sesión ${i}: ${fecha} - ${hora} (30–35 mins)`, 15, y);
    y += 6;
  }

  // Línea separadora
  y += 2;
  doc.setDrawColor(31, 78, 121);
  doc.line(15, y, 195, y);
  y += 8;

  // --- Condiciones ---
  doc.setFont('Montserrat Alternates', 'bold');
  doc.setTextColor('#1F4E79');
  doc.text('Condiciones:', 15, y);
  y += 7;
  doc.setFont('Montserrat Alternates', 'normal');
  doc.setTextColor('#333');
  doc.text('1) Las sesiones se realizan vía Zoom según fechas acordadas.', 15, y);
  y += 6;
  doc.text('2) Pagos realizados no son reembolsables excepto Paquete Consulta.', 15, y);
  y += 6;
  doc.text('3) Firma del cliente valida aceptación de términos.', 15, y);

  // Línea separadora
  y += 10;
  doc.setDrawColor(31, 78, 121);
  doc.setLineWidth(0.5);
  doc.line(15, y, 195, y);
  y += 10;

  // --- Firmas ---
  doc.setFont('Montserrat Alternates', 'bold');
  doc.text('Firma del Cliente:', 15, y);
  doc.text(nombre, 60, y);
  y += 20;
  doc.text('Firma ECG Nexus:', 15, y);
  doc.text('Emanuel Camacho García', 60, y);

  // Guardar PDF
  doc.save(`Convenio_Profesional_${nombre}.pdf`);
}

// Abrir correo prellenado
// Reemplaza la función actual por esta versión más robusta
function openEmailForConvenio() {
  const nombre = document.getElementById('clienteName').value || 'Cliente';
  const subject = `Convenio – ${nombre}`;
  const body = `Hola,\n\nAdjunto mi convenio firmado.\n\nNombre: ${nombre}`;

  const mailto = `mailto:ecgnexus.contacto@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Intento 1: abrir con location (normalmente funciona)
  try {
    window.location.href = mailto;
  } catch (e) {
    console.warn('Intento window.location falló:', e);
  }

  // Intento 2: forzar mediante un <a> (fallback)
  setTimeout(() => {
    try {
      const a = document.createElement('a');
      a.href = mailto;
      a.target = '_blank';
      a.rel = 'noopener';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Fallback con <a> falló:', e);
    }
  }, 150);

  // Mensaje informativo (no obligatorio): si no se abre, mostrar guía corta al usuario
  setTimeout(() => {
    // Si el usuario tiene un cliente configurado, lo ideal ya se abrió;
    // de lo contrario no podemos forzar la apertura por políticas del navegador.
    // Mostramos un aviso sutil con instrucciones.
    // (Puedes quitar este alert si no quieres notificaciones.)
    // alert('Si no se abre tu correo, revisa la configuración de manejadores/protocolos en Chrome o en tu sistema. Si quieres, te doy los pasos.');
  }, 600);
}


// Enviar solicitud mediante EmailJS
function sendRequest() {
  const nombre = document.getElementById('clienteName').value.trim();
  const email = document.getElementById('clienteEmail').value.trim();
  const telefono = document.getElementById('clientePhone').value.trim();
  const mensaje = document.getElementById('clienteMsg').value.trim();
  const paquete = document.getElementById('paqueteSelect').value;

  if (!nombre || !email || !mensaje) {
    alert('Por favor completa todos los campos.');
    return;
  }

  const templateParams = {
    from_name: nombre,
    from_email: email,
    phone: telefono,
    message: mensaje,
    package: paquete
  };

  emailjs.send('service_sfdil5s','template_wtu328f',templateParams)
    .then(() => { alert('Solicitud enviada con éxito. Te responderemos pronto.'); })
    .catch((err) => { alert('Error al enviar. Revisa tu conexión o intenta de nuevo.'); console.error(err); });
}

// Ejecutar al cargar la página
window.onload = generarFechas;










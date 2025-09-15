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
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const nombre = document.getElementById('clienteName').value.trim();
  const email = document.getElementById('clienteEmail').value.trim();
  const telefono = document.getElementById('clientePhone').value.trim();
  const paquete = document.getElementById('paqueteSelect').value;

  if (!nombre || !email) {
    alert('Por favor completa tu nombre y correo.');
    return;
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
function openEmailForConvenio() {
  const nombre = document.getElementById('clienteName').value || 'Cliente';
  const subject = encodeURIComponent(`Convenio – ${nombre}`);
  const body = encodeURIComponent(`Hola,\n\nAdjunto mi convenio firmado.\n\nNombre: ${nombre}`);
  window.location.href = `mailto:ecgnexus.contacto@gmail.com?subject=${subject}&body=${body}`;
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





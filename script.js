// ==============================
// BOTONES DE PAGO
// ==============================
function pay(paquete, monto){
  alert(`Redirigiendo a PayPal para pagar ${paquete} por MXN ${monto}`);
  window.open(`https://www.paypal.me/ECGNexus/${monto}`, '_blank');
}

function contactTransfer(paquete, monto){
  alert("Contacta a Emanuel para solicitar los datos de transferencia.");
}

// ==============================
// Inicializar EmailJS
// ==============================
emailjs.init("vcMhNz-ZzWxxICicN"); // reemplaza con tu user ID de EmailJS

// ==============================
// Generar campos de fecha/hora según paquete
// ==============================
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

// Llamar a generarFechas al cambiar el select
document.getElementById('paqueteSelect').addEventListener('change', generarFechas);

// ==============================
// Generar PDF Convenio con logo
// ==============================
function generarConvenio() {
  const { jsPDF } = window.jspdf;
  const nombre = document.getElementById('clienteName').value.trim();
  const email = document.getElementById('clienteEmail').value.trim();
  const telefono = document.getElementById('clientePhone').value.trim();
  const paquete = document.getElementById('paqueteSelect').value;

  if (!nombre || !email) {
    alert('Por favor completa tu nombre y correo.');
    return;
  }

  const doc = new jsPDF();

  const img = new Image();
  img.src = 'LOGO-ECGNEXUS.png';
  img.crossOrigin = 'anonymous';

  img.onload = function() {
    try {
      // Convertir imagen a dataURL
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/png');

      // --- Fondo ---
      doc.setFillColor(240, 244, 248);
      doc.rect(0, 0, 210, 297, 'F'); // A4

      // --- Encabezado ---
      doc.setFillColor(31, 78, 121);
      doc.rect(0, 0, 210, 25, 'F');
      doc.addImage(imgData, 'PNG', 15, 3, 30, 18);
      doc.setFont('Montserrat Alternates', 'bold');
      doc.setFontSize(18);
      doc.setTextColor('#FFFFFF');
      doc.text('ECG Nexus', 55, 17);
      doc.setFontSize(10);
      doc.text('Tus ideas, nuestra pasión por hacerlas realidad', 55, 23);
      doc.setDrawColor(31, 78, 121);
      doc.setLineWidth(0.8);
      doc.line(15, 28, 195, 28);

      // --- Datos del cliente ---
      let y = 38;
      doc.setFontSize(12);
      doc.setFont('Montserrat Alternates', 'bold');
      doc.setTextColor('#333');
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

      // Condiciones
      y += 4;
      doc.setDrawColor(31, 78, 121);
      doc.line(15, y, 195, y);
      y += 8;
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

      // Firmas
      y += 10;
      doc.setDrawColor(31, 78, 121);
      doc.line(15, y, 195, y);
      y += 10;
      doc.setFont('Montserrat Alternates', 'bold');
      doc.text('Firma del Cliente:', 15, y);
      doc.text(nombre, 60, y);
      y += 20;
      doc.text('Firma ECG Nexus:', 15, y);
      doc.text('Emanuel Camacho García', 60, y);

      doc.save(`Convenio_Profesional_${nombre.replace(/\s/g,"_")}.pdf`);
    } catch (err) {
      console.error('Error generando PDF con logo:', err);
      alert('Ocurrió un error al generar el convenio con logo. Se generará sin logo.');
      generarConvenioSinLogo();
    }
  };

  img.onerror = function() {
    console.warn('No se pudo cargar LOGO-ECGNEXUS.png — generando PDF sin logo.');
    generarConvenioSinLogo();
  };
}

// Función fallback sin logo
function generarConvenioSinLogo() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const nombre = document.getElementById('clienteName').value.trim();
  const email = document.getElementById('clienteEmail').value.trim();
  const telefono = document.getElementById('clientePhone').value.trim();
  const paquete = document.getElementById('paqueteSelect').value;

  doc.setFontSize(16);
  doc.text("Convenio de Servicio — ECG Nexus", 20, 20);
  doc.setFontSize(12);
  doc.text(`Nombre: ${nombre}`, 20, 40);
  doc.text(`Email: ${email}`, 20, 50);
  doc.text(`Teléfono / WhatsApp: ${telefono}`, 20, 60);
  doc.text(`Paquete elegido: ${paquete}`, 20, 70);
  doc.text("Al firmar este convenio, aceptas los términos y condiciones del servicio.", 20, 90);
  doc.save(`Convenio_${nombre.replace(/\s/g,"_")}.pdf`);
}

// ==============================
// Abrir correo para enviar convenio
// ==============================
function openEmailForConvenio() {
  const nombre = document.getElementById('clienteName').value || 'Cliente';
  const subject = `Convenio – ${nombre}`;
  const body = `Hola,\n\nAdjunto mi convenio firmado.\n\nNombre: ${nombre}`;
  const mailto = `mailto:ecgnexus.contacto@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

// ==============================
// Enviar solicitud mediante EmailJS
// ==============================
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

  emailjs.send('service_sfdil5s','template_wtu328f',{
    from_name: nombre,
    from_email: email,
    phone: telefono,
    message: mensaje,
    package: paquete
  })
  .then(() => alert('Solicitud enviada con éxito. Te responderemos pronto.'))
  .catch((err) => { alert('Error al enviar. Intenta de nuevo.'); console.error(err); });
}

// ==============================
// Ejecutar al cargar la página
// ==============================
window.onload = generarFechas;

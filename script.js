const { jsPDF } = window.jspdf;

// genera inputs de fecha según paquete (se ejecuta al cargar porque <script> está al final del body)
document.getElementById('paqueteSelect').addEventListener('change', () => {
  const pkg = document.getElementById('paqueteSelect').value;
  const cont = document.getElementById('fechasContainer');
  cont.innerHTML = '';
  let n = 0;
  if (pkg === 'Básico') n = 4;
  if (pkg === 'Intermedio') n = 3;
  if (pkg === 'Plus') n = 3;
  if (pkg === 'Consulta') n = 1;
  for (let i = 1; i <= n; i++) {
    cont.innerHTML += `<label>Fecha/Hora revisión ${i}:</label>
    <input type="datetime-local" id="fecha${i}" required><br>`;
  }
});

// Generar y descargar el PDF (con nombre seguro)
function generarConvenio() {
  const name = document.getElementById('clienteName').value.trim();
  const email = document.getElementById('clienteEmail').value.trim();
  const pkg = document.getElementById('paqueteSelect').value;
  if (!name || !email) { alert('Nombre y email obligatorios.'); return; }

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text('ECG Nexus', 105, 20, { align: 'center' });
  doc.text('Convenio de Servicio', 105, 30, { align: 'center' });
  doc.setFontSize(11);

  doc.text(`Cliente: ${name}`, 20, 50);
  doc.text(`Email: ${email}`, 20, 57);
  doc.text(`Paquete contratado: ${pkg}`, 20, 64);

  let y = 80;
  doc.text('Fechas/Horas de revisión:', 20, y); y += 8;
  let n = 0;
  if (pkg === 'Básico') n = 4;
  if (pkg === 'Intermedio') n = 3;
  if (pkg === 'Plus') n = 3;
  if (pkg === 'Consulta') n = 1;
  for (let i = 1; i <= n; i++) {
    const f = document.getElementById(`fecha${i}`) ? document.getElementById(`fecha${i}`).value : '';
    doc.text(`${i}. ${f}`, 25, y); y += 6;
  }

  y += 10;
  if (pkg === 'Consulta') {
    doc.text('Política de devolución: Se devolverá únicamente el 25% del pago en caso de no quedar convencido con las opciones ofrecidas.', 20, y, { maxWidth: 170 });
  } else {
    doc.text('Política de devolución: No hay devoluciones una vez realizado el pago.', 20, y, { maxWidth: 170 });
  }

  y += 20;
  doc.text('Firma del cliente: ____________________________', 20, y);
  y += 15;
  doc.text('Firma de Emanuel Camacho García: ____________________________', 20, y);

  // Nombre seguro para archivo
  const safeName = name.replace(/[^\w\-]/g, '_').replace(/\s+/g, '_');
  const filename = `Convenio_${pkg}_${safeName}.pdf`;

  // Descarga PDF
  doc.save(filename);

  // Mensaje claro para el usuario (manzana)
  alert('Tu convenio se descargó en tu equipo como "' + filename + '".\n\nAhora abre tu correo y adjunta ese archivo en un mensaje a ecgnexus.contacto@gmail.com.\nPuedes usar el botón "Abrir correo para enviar convenio" para preparar el correo con el asunto y el cuerpo prellenados.');
}

// Abre el cliente de mail con asunto y cuerpo prellenado (pero recuerda: el cliente debe adjuntar el PDF manualmente)
function openEmailForConvenio() {
  const name = document.getElementById('clienteName').value.trim();
  const pkg = document.getElementById('paqueteSelect').value || 'Paquete';
  if (!name) {
    alert('Por favor escribe tu nombre en el campo "Tu nombre" antes de abrir el correo.');
    return;
  }
  const safeName = name.replace(/[^\w\-]/g, '_').replace(/\s+/g, '_');
  const subject = `Convenio - ${name}`;
  const bodyLines = [
    `Mi nombre es: ${name}`,
    `Paquete: ${pkg}`,
    '',
    `Adjunto el convenio firmado (archivo: Convenio_${pkg}_${safeName}.pdf).`,
    '',
    'Por favor confirmar la recepción. Gracias.'
  ];
  const body = encodeURIComponent(bodyLines.join('\n'));
  // Abre el cliente de correo por defecto con asunto y cuerpo
  window.location.href = `mailto:ecgnexus.contacto@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
}

// Función para enviar solicitud (mantengo la tuya)
function sendRequest() {
  const name = document.getElementById('clienteName').value.trim();
  const email = document.getElementById('clienteEmail').value.trim();
  const phone = document.getElementById('clientePhone').value.trim();
  const msg = document.getElementById('clienteMsg').value.trim();
  if(!name || !email) { alert('Por favor completa al menos tu nombre y email.'); return; }
  const subject = encodeURIComponent('Solicitud - ' + name);
  const body = encodeURIComponent('Nombre: ' + name + '\nEmail: ' + email + '\nTel: ' + phone + '\n\n' + msg);
  window.location.href = 'mailto:' + 'ecgnexus.contacto@gmail.com' + '?subject=' + subject + '&body=' + body;
}

// FAQ acordeón
document.querySelectorAll('.faq-item h3').forEach(item => {
  item.addEventListener('click', () => {
    const p = item.nextElementSibling;
    p.style.display = p.style.display === 'block' ? 'none' : 'block';
  });
});

// Rellenar número y año en footer si existen
if (document.getElementById('whatsapp')) document.getElementById('whatsapp').innerText = '5639543241';
if (document.getElementById('year')) document.getElementById('year').innerText = new Date().getFullYear();

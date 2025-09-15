const { jsPDF } = window.jspdf;

// genera inputs de fecha según paquete
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
    const f = document.getElementById(`fecha${i}`).value;
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

  // Descarga PDF
  doc.save(`Convenio_${pkg}_${name}.pdf`);

  // Para enviarte el PDF al correo ecgnexus.contacto@gmail.com necesitas un backend (PHP o Node)
  // que reciba el archivo y lo reenvíe por correo. Con solo HTML/JS en el front no se puede
  // enviar un PDF por email automáticamente.
}

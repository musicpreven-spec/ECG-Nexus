function enviarConvenio(paquete, btn){
  const card = btn.closest('.card');
  const fechas = Array.from(card.querySelectorAll('input[type="date"]'))
    .map((el,i)=> `${el.value} ${card.querySelectorAll('input[type="time"]')[i]?.value}`);
  const firma = card.querySelector('input[type="text"]').value;

  let bodyText = `Convenio de servicio\n\n` +
    `Paquete: ${paquete}\n` +
    `Fechas de revisión: ${fechas.join(', ')}\n` +
    `Firma del cliente: ${firma}\n\n` +
    `Proveedor: ECG Nexus - RFC CAGE890312-NZ5`;

  const subject = encodeURIComponent('Convenio firmado - ' + paquete);
  window.open(`mailto:${CONFIG.email}?subject=${subject}&body=${encodeURIComponent(bodyText)}`);
  window.open(`https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(bodyText)}`);
  alert('Convenio enviado a tu correo y WhatsApp.');
}

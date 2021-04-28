const monthNames = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const getMonthAndYear = () => {
  const since = new Date();
  let month = monthNames[since.getMonth()];
  const day = since.getDate();
  const hours = since.getHours();

  if (day >= 27 || (day >= 27 && hours >= 23)) {
    if (month !== 'Diciembre') {
      month = monthNames[since.getMonth() + 1];
    } else {
      // eslint-disable-next-line prefer-destructuring
      month = monthNames[0]; // Enero
    }
  }

  return { month, year: since.getFullYear() };
};

export default getMonthAndYear;

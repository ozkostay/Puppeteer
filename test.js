const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const formattedDate = yesterday.toISOString().split('T')[0];
console.log(formattedDate); // "2026-03-20"
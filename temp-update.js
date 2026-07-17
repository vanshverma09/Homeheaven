const fs = require('fs');
const file = fs.readFileSync('src/lib/properties-data.ts', 'utf8');

const furnishings = ['Furnished', 'Semi Furnished', 'Unfurnished'];
const statuses = ['Ready To Move', 'Under Construction'];

let counter = 0;
const regex = /createdAt: "([^"]+)",\n  \}/g;

const result = file.replace(regex, function(match, date) {
  counter++;
  const furn = furnishings[counter % 3];
  const status = statuses[counter % 2];
  const parking = counter % 3 !== 2;
  const garden = counter % 3 === 0;
  const lift = counter % 2 === 0;
  const gym = counter % 4 !== 0;
  const pool = counter % 5 === 1;
  
  return `createdAt: "${date}",
    furnishing: "${furn}",
    constructionStatus: "${status}",
    amenities: { parking: ${parking}, garden: ${garden}, lift: ${lift}, gym: ${gym}, swimmingPool: ${pool} },
  }`;
});

fs.writeFileSync('src/lib/properties-data.ts', result);
console.log('Updated ' + counter + ' entries');

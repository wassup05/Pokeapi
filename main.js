const argc = process.argv.length;

if (argc == 3) {
  const func = require('./src/function');
  func(process.argv[2].toLowerCase(),'images/sprite.png') // making the search case-insensitive
} else {
  console.log("Invalid arguments supplied!");
  process.exit(2);
}

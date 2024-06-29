const https = require('https');
const fs = require('fs');
const base_url = "https://pokeapi.co/api/v2/pokemon";

const reset = '\u001b[0m';
const red = '\u001b[31m';
const green = '\u001b[32m';
const dark_white = '\u001b[37;1m'

function print(key, value) {
  console.log(`${dark_white}${key}: ${reset}${value}`);
}

function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1)
}

function parseType(type) {
  let result = "";

  switch (type) {
    case "Flying":
    case "Fairy":
      result = "\u001b[45m" + type + reset
      break;
    case "Poison":
      result = "\u001b[45;1m" + type + reset
      break;
    case "Fighting":
    case "Fire":
      result = "\u001b[41m" + type + reset
      break;
    case "Psychic":
    case "Ground":
    case "Rock":
    case "Electric":
      result += "\u001b[43m" + type + reset
      break;
    case "Ice":
    case "Dragon":
      result = "\u001b[44m" + type + reset
      break;
    case "Water":
      result = "\u001b[46m" + type + reset
      break;
    case "Bug":
    case "Grass":
      result = "\u001b[42m" + type + reset
      break;
    case "Ghost":
      result = "\u001b[47m" + "\u001b[30;1m" + type + reset
      break;
    default:
      result = type
      break;
  }
  return result;
}

function printOutput(response) {

  let total_stat = 0;

  console.log("\n");

  print('Name', response.name);
  print('National Number', response.id);

  process.stdout.write(`${dark_white}Type: ${reset}`)
  response.types.forEach(type => {
    process.stdout.write(`${parseType(capitalize(type.type.name))} `)
  });

  console.log()

  process.stdout.write(`${dark_white}Abilities: ${reset}`)
  response.abilities.forEach(ability => {
    process.stdout.write(`${capitalize(ability.ability.name)} `)
  })

  console.log()
  print('Height (in m)', response.height / 10);
  print('Weight (in kg)', response.weight / 10);

  console.log();

  print('Base Stats', '\n');
  response.stats.forEach(stat => {
    total_stat += stat.base_stat;
    print(capitalize(stat.stat.name), stat.base_stat)
  })

  print('Total', total_stat);

  console.log()
}

function downloadImage(url, path) {
  const writeStream = fs.createWriteStream(path);

  https.get(url, res => {
    res.on('data', bit => {
      writeStream.write(bit)
    })

    res.on('end', () => {
      console.log(`${green}Image Downloaded in \`sprite.png\`${reset}`);
      console.log();
    })

    res.on('error', err => {
      console.log(`${red}Error occured while downloading the image!${reset}: ${dark_white}${err.message}`)
    })
  })
}

function call(pokemon_name, image_path) {
  https.get(`${base_url}/${pokemon_name}`, res => {
    let i = 0;
    let dots = ".";
    if (res.statusCode != 200) {
      console.log(`${red}Not a Pokemon!${reset}`);
      if (fs.existsSync(image_path)) {
        fs.unlink(image_path, () => { })
      }
      process.exit(1);
    }
    res.on('error', err => {
      console.log(`${red}Error occured while making a request!${reset}: ${dark_white}${err.message}`)
    })
    let response = '';
    res.on('data', data => {
      if (i > 2) {
        i = 0;
        dots = ".";
      }
      process.stdout.write("\u001b[100D");
      process.stdout.write(`\u001b[33mLoading${dots}`)
      response += data;
      i++;
      dots += ".";
    })

    res.on('end', () => {
      process.stdout.write("\u001b[2A\u001b[100D");
      response = JSON.parse(response);
      downloadImage(response.sprites.other['official-artwork'].front_default, image_path)
      printOutput(response);
    })
  })
}

module.exports = call;

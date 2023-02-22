const bcryptjs = require("bcryptjs");

async function verifyPassword(){
  const myPassword = 'admin123';
  const hash = '$2a$10$1b2EzeUgXW2venGURy8J8.3NNgmCHjbUluxoEuxmiFEUFwyG7ydjy';
  const isMatched = await bcryptjs.compare(myPassword, hash);
  console.log(isMatched);
}

verifyPassword();

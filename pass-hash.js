const bcryptjs = require("bcryptjs");

async function hashPassword(){
  const myPassword = 'admin123';
  const hash = await bcryptjs.hash(myPassword, 10);
  console.log(hash);
}

hashPassword();

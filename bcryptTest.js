const bcrypt = require('bcrypt');

async function testHashing() {
  const password = 'mySuperSecret123';

  const saltRounds = 12;

  const hash = await bcrypt.hash(password, saltRounds);

  console.log('Original:', password);
  console.log('Hashed:', hash);
}

async function testVerification() {
  const password = 'mySuperSecret123';

  const hash = await bcrypt.hash(password, 12);

  const isMatch = await bcrypt.compare('mySuperSecret123', hash);
  const isWrong = await bcrypt.compare('wrongPassword', hash);

  console.log('Correct password match:', isMatch);
  console.log('Wrong password match:', isWrong); 
  
  console.time('hash');
  await bcrypt.hash('password', 12);
  console.timeEnd('hash');
}

testHashing();

testVerification();
const bob = {
  name: 'Bob',
  token: '123abc'
};

function authenticateUser(token) {
  return new Promise((resolve, reject) => {
    if(token === bob.token) {
      resolve(bob); 
    } else {
      reject(new Error(`User with token '${token}' not found.`));
    }
  });
}


export function doAsAuthenticatedUser(userToken, cb) {
  return authenticateUser(userToken).then(
    user => cb(user)
  ).catch(
    err => {
      const extraMsg = err ? err.message : '';
      return Promise.reject(new Error(`Could not complete action. ${extraMsg}`.trim()))
    }
  );
}



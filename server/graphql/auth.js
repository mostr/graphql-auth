import {intersection} from 'lodash';

// token -> user
const users = {
  '123abc': { name: 'Alice', roles: ['read', 'write'] },
  '456def': { name: 'Bob', roles: ['read'] },
  '789ghi': { name: 'Noop', roles: [] }
}

function authenticateUser(token) {
  return new Promise((resolve, reject) => {
    if(users[token]) {
      resolve(users[token]); 
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

export function haltOnMissingRole(user, ...roles) {
  const allowed = intersection(roles, user.roles).length === roles.length;
  if(!allowed) throw new Error('User is not allowed to execute this action');
}
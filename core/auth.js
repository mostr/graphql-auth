import {intersection} from 'lodash';

// token -> user
const users = {
  '123abc': { name: 'Alice', roles: ['read', 'write'] },
  '456def': { name: 'Bob', roles: ['read'] },
  '789ghi': { name: 'Noop', roles: [] }
};

export function authenticateUser(token) {
  return users[token];
}

export function haltOnMissingRole(user, ...roles) {
  const allowed = intersection(roles, user.roles).length === roles.length;
  if(!allowed) throw new Error('User is not allowed to execute this action');
}
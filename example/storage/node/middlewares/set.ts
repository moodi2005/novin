import {user} from '../db_user.js';

console.time('set item');
for (let i =0; i < 10;i++) {
    user.set({
        firstName: 'Mohammad Mahdi',
        lastName: 'Moodi',
        userName: 'admin',
        email: 'mohammadmhaimoodi2005@gmail.com',
        profile: '',
        lastLogin: '',
    });
}
console.timeEnd('set item');

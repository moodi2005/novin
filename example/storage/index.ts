import {user} from './db_user.js';

console.time('set item');
for (let i =0; i < 100000;i++) {
    user.set({
        firstName: 'Mohammad Mahdi',
        lastName: 'Moodi',
        userName: 'admin',
        email: 'mohammadmhaimoodi2005@gmail.com',
        profile: '',
        lastLogin: '',
        _id: ''
    });
}
console.timeEnd('set item');

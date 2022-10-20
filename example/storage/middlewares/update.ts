import { user } from "../db_user.js";

// update item

const update = user.update({
    _id:'f2395652-76a3-4cc7-b81d-4330f9c1aa7c',
    firstName: 'Mohammad Mahdi',
    lastName: 'Moodi',
    userName: 'moodi',
    email: 'mohammadmhaimoodi2005@gmail.com',
    profile: '',
    lastLogin: '',
});

console.log(update);

// ture or false
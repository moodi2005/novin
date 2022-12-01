import { user } from "../db_user.js";

// get all record
const users = user.getAll;

console.log(users); // => [users]

//  get by id
const user1 = user.getItem('26d466a7-4d1c-4252-abfb-9930a5577c9b');

console.log(user1)
     // if exist
     // {
     //     firstName: 'Mohammad Mahdi',
     //     lastName: 'Moodi',
     //     userName: 'admin',
     //     email: 'mohammadmhaimoodi2005@gmail.com',
     //     profile: '',
     //     lastLogin: '',
     //     _id: '26d466a7-4d1c-4252-abfb-9930a5577c9b'
     //   };
     // else => null

// getItemByKn(key&value)
const user2 = user.getItemByKn('lastName','Moodi');

console.log(user2);
     // if exist
     // {
     //     firstName: 'Mohammad Mahdi',
     //     lastName: 'Moodi',
     //     userName: 'admin',
     //     email: 'mohammadmhaimoodi2005@gmail.com',
     //     profile: '',
     //     lastLogin: '',
     //     _id: '26d466a7-4d1c-4252-abfb-9930a5577c9b'
     //   };
     // else => null

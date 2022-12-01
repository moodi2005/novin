import { user } from "../db_user.js";


//  remove by id
const user1 = user.removeItem('26d466a7-4d1c-4252-abfb-9930a5577c9b');

console.log(user1)
     // if exist => true
     // else => false

// removeItemByKn(key&value)
const user2 = user.removeItemByKn('lastName','Moodi');

console.log(user2);
     // if exist => true
     // else => false
<!-- <image src="https://tav2.ir/wp-content/uploads/2022/10/data_96285-1.png"
style="width:410px;"> -->
### The database fast, easy and json format

##  Installation
This is a  [Node.js](https://nodejs.org/en/)  module available through the  [npm registry](https://www.npmjs.com/).
Before installing,  [download and install Node.js](https://nodejs.org/en/download/). Node.js 0.10 or higher is required.

Installation is done using the  [`npm install`  command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

    npm i @webkn/storage
 Installation is done using the  [`yarn add `  command](https://yarnpkg.com/getting-started/usage#adding-a-dependency):
 

    yarn add @webkn/storage

## Features

 - Fast (set 100,000 Record in 1:36s)
 - Auto id
 - Json format
 - With a backup file

##  Overview
Install the executable.

    yarn add @webkn/storage
 ###  Configuration 

    import { NovinStorage } from  '@webkn/storage';
    
    import  type {DocumentObject} from  '@webkn/storage';

    interface user extends  DocumentObject {
       firstName:string,
       lastName:string,
       userName:string,
       email:string,
       profile:string,
       lastLogin:string,
    }
    
    const user = new NovinStorage<user>({
      name:'user',
      path:'./db',
    })
###  more opstion NovinStorage:
| Key | description | defult| 
|--|--|--|
| autoId  | set automatic _id | true |
| logInConsole  |log function storage  | true |
|saveBeautiful | reading data in files| false|
|saveDebounce|Save delay to disk after each operation|1000|

### set(documentObject: DocumentType)
    user.set({
       firstName: 'Mohammad Mahdi',
       lastName: 'Moodi',
       userName: 'admin',
       email: 'mohammadmahdi2005@gmail.com',
    });
*Top: If you use Autoid, leave the id field blank*

### getItem(id)
Get Item by ket **_id**

    user.getItem('sugfh-socmo-socni-cdinid-icdnidn');  // ⇨ {"userName":"admin",...}


### removeItem(id)
Remove item by ket **_id**

    user.remove('sugfh-socmo-socni-cdinid-icdnidn');  // ⇨ true

### update(id)
Update record 
*Tip: The id used must be the same as the id of the registered record*

    user.update({
       _id:'sugfh-socmo-socni-cdinid-icdnidn',
       firstName: 'Mohammad Mahdi',
       lastName: 'Moodi',
       userName: 'admin',
       email: 'mohammadmahdi2005@gmail.com',
    });

## More middleware
| Name | Description |   Entrance | output |
|--|--|--|--|
| removeBykn | Remove Item by key&value on documentObject | key:string, value:unkown | true
| getBykn | Get Item by key&value on documentObject | key:string, value:unkown | documentObject
| updateBykn | Update Item by key&value on documentObject | key:string, value:unkown | true
| getalll | Get all records |  | documentObject[]
| forAll | Change or get item on record | 


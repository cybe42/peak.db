<div align="center">
  <img src="https://i.ibb.co/mbJC8yX/unknown.png" width="512"/>
  <br/>
  <img src="https://badgen.net/npm/v/peak.db"/>
  <img src="https://badgen.net/npm/license/peak.db"/>
  <img src="https://badgen.net/npm/node/peak.db"/>
  <img src="https://badgen.net/npm/dt/peak.db"/>
</div>

# peak.db ![version](https://badgen.net/npm/v/peak.db) ![license](https://badgen.net/npm/license/peak.db) ![node-version](https://badgen.net/npm/node/peak.db) ![downloads](https://badgen.net/npm/dt/peak.db)

Fast and advanced, document based NoSQL database that able to work as it is installed.

## Features

  * NoSQL database
  * Can be run as it is installed
  * Customizable settings for all collections
  * Quick data reading and writing
  * Automatically or manual backup
  * No need to use schema
  * Easy to find data

## Usage

### Installation
```
npm install peak.db --save
```

### Create a Collection
```js
const PeakDB = require("peak.db");
var accounts = new PeakDB.Collection({
  "name": "ACCOUNTS", // Name of collection (required)
  "id_length": 32, // This determines the length of unique identities given to documents. (no required, default: 32)
  "delete_backups_before_this_day": 3, // This determines how many days of backups will be deleted. (no required, default: 3)
  "auto_backup": true, // If active this, this collection will receive automatic backups. (no required, default: false)
  "indicate_created_at": true, // If active this, will be automatically specified date when documents are created. (no required, default: false)
  "indicate_created_timestamp": true, // If active this, will be automatically specified timestamp when documents are created. (no required, default: false)
  "indicate_updated_at": true, // If active this, will be automatically specified date when documents are updated. (no required, default: false)
  "indicate_updated_timestamp": true // If active this, will be automatically specified timestamp when documents are updated. (no required, default: false)
});
```

### Insert a Document
```js
accounts.insert({"email": "fir4tozden@gmail.com", "username": "fir4tozden", "password": "12345678", "region": "Muğla"});
/*
  {
    "_id": "RMmXZVDfQrVLQwFlquMPb98XNUCxQ6MM",
    "_updated": false,
    "_created_at": 2022-03-20T00:00:00.000Z,
    "_created_timestamp": 1647745200000,
    "email": "fir4tozden@gmail.com",
    "username": "fir4tozden",
    "password": "12345678",
    "region": "Muğla"
  }
*/
```

### Find a Document
```js
accounts.find(document => document.email === "fir4tozden@gmail.com");
/*
  {
    "_id": "RMmXZVDfQrVLQwFlquMPb98XNUCxQ6MM",
    "_updated": false,
    "_created_at": 2022-03-20T00:00:00.000Z,
    "_created_timestamp": 1647745200000,
    "email": "fir4tozden@gmail.com",
    "username": "fir4tozden",
    "password": "12345678",
    "region": "Muğla"
  }
*/
```

### Filter Documents
```js
accounts.filter(document => document.region === "Muğla");
/*
  [
    {
      "_id": "RMmXZVDfQrVLQwFlquMPb98XNUCxQ6MM",
      "_updated": false,
      "_created_at": 2022-03-20T00:00:00.000Z,
      "_created_timestamp": 1647745200000,
      "email": "fir4tozden@gmail.com",
      "username": "fir4tozden",
      "password": "12345678",
      "region": "Muğla"
    },
    {
      "_id": "23ERK9fHqiH_n83fhzU7eOYtzz6tUl7S",
      "_updated": false,
      "_created_at": 2022-03-20T00:05:00.000Z,
      "_created_timestamp": 1647734700000,
      "email": "nehir@gmail.com",
      "username": "nehir",
      "password": "12345678",
      "region": "Muğla"
    }
  ]
*/
```

### Update a Document
```js
let document = accounts.find(document => document.email === "fir4tozden@gmail.com");
accounts.update(document._id, {"email": "fir4tozden@gmail.com", "username": "hey_im_fir4tozden", "password": "87654321", "region": "İstanbul"});
/*
  {
    "_id: "23ERK9fHqiH_n83fhzU7eOYtzz6tUl7S",
    "_updated": true,
    "_created_at": 2022-03-20T00:00:00.000Z,
    "_created_timestamp": 1647745200000,
    "_updated_at": 2022-03-20T00:10:00.000Z,
    "_updated_timestamp": 1647735000000,
    "email": "fir4tozden@gmail.com",
    "username": "hey_im_fir4tozden",
    "password": "87654321",
    "region": "İstanbul"
  }
*/
```

### Delete a Document
```js
let document = accounts.find(document => document.email === "fir4tozden@gmail.com");
accounts.delete(document._id);
// true
```

### Backup Collection
```js
accounts.backup();
// true
```

## License
[MIT](LICENSE.md)

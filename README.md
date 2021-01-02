<h1 align="center">⚡ Image Repository Server ⚡</h1>
This server is meant to be a backend server for an image repository. I created the front end for this server in Angular and the source code is available 
<a href="https://github.com/kushbhag/ImageRepository">here</a>. Full documentation on how to use the web applicaiton
is available in that same link. If you would like to try the application out, you can also visit this site <a href="https://kushbhag.github.io/ImageRepository/home">here</a>.


---
<h2>Stack</h2>
This backend server was developed using <a href="https://nodejs.org/en/about/">Node js</a>, and then deployed on Heroku. A <a href="https://www.mongodb.com/2">MongoDB</a> database was also used to store all image, user, and auth data.
The server itself was built using <a href="https://expressjs.com/">Expres</a>, and <a href="https://mongoosejs.com/">Mongoose</a> was used to provide the schemas for my
entities.

---
<h2>Usage</h2>
There are three main routes that can be accessed: '/image', '/user', and '/auth'. The image route is meant to GET, POST or DELETE images. The user route is to GET any type of
user data that is stored within the database. The auth route is meant for login, signup and overall authentication of the user.

---
<h3 align="center">Image Route</h3>
This route makes use of a basic image object as defined below.


**Image Object**
| Key | Type | Description |
|---|---|---|
| _id  | ObjectId | Used within mongoose |
| path | string | Indicates that path to access the image |
| name | string | The name of the image |
| public | boolean | Indicates whether or not the image is public |
| userId | ObjectId | The ID of the user who submitted the image |

**Route Details**
| Method | Endpoint | Usage
|---|---|---|
| **GET**  | /image | Get an array of image objects |
| **GET** | /image/:imageId | Get a single image object with the id matching the imageId paramater. |
| **GET** | /image/user/:userId | Get an array of image objects that the user with userId has posted. Requires a JWT access token. |
| **POST** | /image | Post an image. Need to provide name, image file (JPEG, JPG, or PNG), public boolean, userId, and a JWT access token. The format must be in form-data. |
| **DELETE** | /image/:imageId | Delete the image with id imageId. Requires a JWT access token. |

---
<h3 align="center">User Route</h3>
This route is used to send user data back to the client. It makes use of simplified user object that is shown below.


**Simplified User Object**
| Key | Type | Description |
|---|---|---|
| firstName  | string | The first name of the user |
| lastName | string | The last name of the user |
| _id | ObjectId | The id of the user |

**Route Details**
| Method | Endpoint | Usage |
|---|---|---|
| **GET**  | /user/:userId | Get a simplified user object that matches the userId provided. |

---
<h3 align="center">Auth Route</h3>
This route is mainly used for creating, and authenticating users. This route makes use of an auth object as described below.


**Auth Object**
| Key | Type | Description |
|---|---|---|
| user  | Simplified User Object | The data of the user who is being authenticated |
| accessToken | JWT Token | A token that must be used to GET this users images, and POST and DELETE an image on behalf of this user. |
| refreshToken | JWT Token | The accessToken can only be used for 30 mins, after which you must use this refreshToken to get a new accessToken. |

**Route Details**
| Method | Endpoint | Usage |
|---|---|---|
| **POST**  | /auth | Used to create a new user. Needs to take in a <a href="https://github.com/kushbhag/ImageRepositoryServer/blob/main/api/models/user.js">user object</a> |
| **POST** | /auth/login | Used to login. It needs a username and password field in the request body. It will return an auth object. |
| **POST** | /auth/token | Used to get a new access token. It needs a refreshToken in the request body. |
| **DELETE** | /auth/logout/:refreshToken | Used to delete an exisiting refresh token from the database when a user logs out of their account. |

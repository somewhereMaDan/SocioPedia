*** npm i express body-parser bcrypt cors dotenv gridfs-stream multer multer-gridfs-storage helmet morgan jsonwebtoken mongoose ***

body-parser -> to process the request body

bcrypt -> for password encryption (hashing)

cors -> cross origin request

dotenv -> for environment variables

gridfs-stream -> for file upload

multer multer-gridfs-storage -> so we can upload our files locally

helmet -> for request safety

morgan -> for login

jsonwebtoken -> for authentication

mongoose -> for mongo db access



In package.json :
"type" : module -> so we can use import statements instead of require statements
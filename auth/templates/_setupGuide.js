# Authentication Setup

> Passport + JsonWebToken + Redis enabled robust Authentication & Authorization for Restgoose

 ## Setup
 1. Install Redis Server   
      a. [Windows](https://github.com/rgl/redis/downloads)  
      b. Mac OS X   ``brew install redis``  
      c. [Linux](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis)

2. Open ``app.js`` from root directory and uncomment the lines where it is written ``UNCOMMENT IF USING AUTH``. For reference, the line no.s are 16-36, 125-133, 139, 145.
3. [*Optional*] Change redis port if its not runnig on the defult one, in ``config/lib.js``.
4. [*Optional*, **Recommended**] Change jwt secret and Sendgrid API key in ``config/lib.js``.
4. That's it. Your authentication system is up and running.


## Route Usage
1. Auth Routes are in ``api/auth.js``  
	a. ``/api/auth/register``  
    b. ``/api/auth/login``  
    c. ``/api/auth/logout``
2. Register a basic account
	```
    /api/auth/register

      curl -X POST 
      	-H "Content-Type: application/json" 
        -H "Cache-Control: no-cache" 
        -d '{
      		"name":	"Abhi",
      		"email":"v@g.c",
      		"password":"lalalaPassword"
  		}' "http://localhost:3000/api/auth/register"
    ```
	This will, by default, have a `Member` role.
    
    
3. Login 
```

curl -X POST 
	-H "Content-Type: application/json" 
    -H "Cache-Control: no-cache" 
    -d '{
      "email":"v@g.c",
      "password":"lalalaPassword"
	}' "http://localhost:3000/api/auth/login"

```

4. Logout
```
curl -X POST 
	-H "Content-Type: application/json" 
    -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWsdgOTY2YzNmYTUzNzV2YzlkYWMiLCJuYW1lIjoiQWJoaSIs133YWsdgJyb2xlIjoiTWVtYmVyIiwsdgF0Ijsdgsg3NTAwLCJleHAiOjE0ODkx55ODB9.XHXG6iWW0N3368Gpe6jOpexr8C6QNHMGTTB55Tkr70Q" 
    -H "Cache-Control: no-cache" 
	"http://localhost:3000/api/auth/logout"

```
A logout endpoint will expect a logged-in token, otherwise, it will not logout.

	
5. Access Secured Route
```
curl -X GET 
	-H "Content-Type: application/json" 
    -H "Authorization: JWT eyJhbGciOiJIUzI1N13CI6IkpXVCJ9.eyJfaWQiOiI1OGMyOTY435hYTUzNzVhMjRifd5tg5WMiLCJuYW1lIjoiQWJoaSI3VtYWlsfg34b2xlIjtyWVtYdsgWF0IjoxNDg5MTQ3NTI2LCJleHAiOjE0ODkxNTc2MDZ9.aodmKjvnmp4urjMtgbBO_MoQCsKP20dyOMfHKRoo" 
    -H "Cache-Control: no-cache" 
    "http://localhost:3000/dashboard"

```

The server will allways expect a JWT header (returned after login) to be present in the Authorization Header. Always!


## Developer Usage
[Todo]
Check out sample route on usage in ``/routes/sampleauth.js``.

## Architecture

After a successful login, the token and user data will be store on redis memory. So, if a token needs to be revoked, it can be done by deleting the token from redis. Restarting the redis server will essentially logout all users.
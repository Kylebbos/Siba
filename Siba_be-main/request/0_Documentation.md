# Improvements 2023-10-22:
## These have been already done
1. Ctrl+Shift+P, settings => select Preferences: Open Settings (UI)
1. select Workspace          (creates a .vscode folder to root root folder "Siba")
1. look for: rest client
1. select rest client environment variables
1. Creates Write to that settings.json:
  ```
  {
    "rest-client.environmentVariables": {
      "$shared": {
      }
    }
  }
  ```
## You need to do this once for each machine where your work:
1. create a folder .vscode to the root root folder, the folder where you have Siba_be and siba-fe folders - if none yet
1. create there settings.json - if none yet
1. Then make it look like this:
  ```
  {
    "rest-client.environmentVariables": {
      "$shared": {
        "host":"http://localhost:1234/api"
      },

      "adminEnv": {
        "token":"fasdflöjaösdlfkjöasdlkjf",
      },
      "plannerEnv": {
        "token":"asdfasjdflöakjsdfölajsdf",
      },
      "statistEnv": {
        "token":"asdfasdjfölasdkjfölasj",
      }
    }
  }
  ```

  Well, the tokens you get by logging in as respective role user. See the Logins.rest.

1. Then you can switch between different environments simply from lower right corner, when .rest file is open in VS Code

1. Then we create one file per database table. And in that file have at least C,R,U,D,L test cases, in the order: LRCUD, same order as the route file


# OLD VERSION, Just for curiosity and ideas:
## Using Rest Client plugin in VS Code instead of Postman
Rest Client plugin can be used in VS Code to make requests in the running backend instead of Postman, which is convenient for developers to test apis.
**At first, install REST Client plugin in VS Code through extensions**
***

### Steps

1. Create a folder for example request in the root of your backend project

```shell
mkdir request
```
***

2. Change your directory to the request folder

```shell
cd request
```
***

3. Create a file for example subject.rest **Note: file extention should be .rest**

```shell
touch subject.rest
```
***

4. Now you can write your requests inside the file subject.rest
  You can follow these examples below:<br>
  __Note: You need to seperate each next requests with ### to have more than one request in one file__

**Get all subjects**

```shell
GET http://localhost:1234/api/subject
Authorization: Basic <put your token here>
```
***

**Get subject by id**

```shell
GET http://localhost:1234/api/subject/<put subject id here>
Authorization: Basic <put your token here>
```
***

**Create subject**

```shell
POST http://localhost:1234/api/subject
Authorization: Basic <put your token here>
Content-Type: application/json

{
  "name": "Data structures",
  "groupSize": 25,
  "groupCount": 2,
  "sessionLength": "02:30:00",
  "sessionCount": 2,
  "area": 35,
  "programId": 3030,
  "programName": "Avoin Kampus",
  "spaceTypeId": 5002,
  "spaceTypeName": "Luentoluokka"
}
```
***

**Update subject**

```shell
PUT http://localhost:1234/api/subject
Authorization: Basic <put your token here>
Content-Type: application/json

 {
  "id": 4042,
  "name": "Data structures and algorithm",
  "groupSize": 25,
  "groupCount": 2,
  "sessionLength": "02:30:00",
  "sessionCount": 2,
  "area": 35,
  "programId": 3030,
  "programName": "Avoin Kampus",
  "spaceTypeId": 5002,
  "spaceTypeName": "Luentoluokka"
}
```
***

**Remove subject**

```shell
DELETE http://localhost:1234/api/subject/<put subject id here>
Authorization: Basic <put your token here>
```
***

For detail info, please visit **[here](https://github.com/Huachao/vscode-restclient)** and **[here](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)**

Enjoy!!

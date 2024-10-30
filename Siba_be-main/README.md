<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">

<h1 align="center">Siba project - Backend</h1>

<h3 align="center">
    This project was created on the courses Softala-projekti / Software Project<br />
<br />
</div>

## Creators

<p>SIBA22S Softala team</p>
<p>SIBA23K Softala team</p>
<p>SWP23K team</p>
<p>SWP24K team </p>
<!-- ABOUT THE PROJECT -->

## About the project

Copyrights reserved. This Project is a collaborative work, which aims at building an information system that makes it possible to calculate and optimize teaching space and equipment usage for different lessons.

<p align="right">(<a href="#top">back to top</a>)</p>

### Backend technology and other useful resources

- [Mariadb](https://mariadb.org/)
- [Node](https://nodejs.org/en/)
- [Winston Logger](https://www.npmjs.com/package//winston)
- [Express-validator](https://www.npmjs.com/package/express-validator)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Express](https://www.npmjs.com/package/express)
- [Body-parser](https://www.npmjs.com/package/body-parser)
- [Cors](https://www.npmjs.com/package/cors)
- [Mysql](https://www.mysql.com/)
- [Nodemon](https://www.npmjs.com/package/nodemon)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED1 -->


## Beginning

Backend side installation instructions

### Installation

1. Install [Mariadb](https://www.mariadbtutorial.com/getting-started/install-mariadb/) version 10.x or newer

2. Install a Graphical SQL-editor: [DBeaver](https://dbeaver.io/) or [MySQL Workbench](https://www.mysql.com/products/workbench/)

3. Create in your chosen SQL editor a database scheme called casedb. Run [000\_\_CreateALLdb.sql](https://github.com/haagahelia/Siba_be/blob/main/Database/SQL_Scripts/000__CreateALLdb.sql) script to create files to the database

4. Clone the repository

   ```sh
   git clone https://github.com/haagahelia/Siba_be.git
   ```

5. Change directory

   ```sh
   cd Siba_be
   ```

6. Install needed packages

   ```sh
   npm install
   ```

7. Create the **.env** file. Add .env to the root of the project

   ```
   BE_API_URL_PREFIX=/api
   BE_SERVER_PORT=3001
   DB_DRIVER_MODULE=mysql
   BE_DEVELOPMENT_PHASE=true
   DB_HOST=localhost
   DB_PORT=3306
   MARIADB_USER=<<DB Username>>
   MARIADB_PASSWORD=<<DB password>>
   MARIADB_ROOT_PASSWORD=<<root password>>  # Needed when running with Docker. Otherwise not needed.
   MARIADB_DATABASE=casedb
   DB_DEBUG=true
   DB_MULTIPLE_STATEMENTS=true
   DB_CONNECTION_POOL_MIN=1
   DB_CONNECTION_POOL_MAX=7
   SECRET_TOKEN=<<Secret token here for the JWT>>
   TOKEN_EXPIRATION_SECONDS=3600
   ```

   The secret_token has to be something of the length and format of: A3fs9t395dsgSDf3fRsTse349. But not that one! Hardening process should change it for the real deployment of the backend.
   This particular one A3fs... should not be used even for testing! This is visible in the internet. It's just a dummy value to help randomizing the real one!

   Be context aware! E.g. in the list above the ports are usually changed. And if you use a tunnel, then you target the tunnel port, not the real ports. Ask help! Usually one excel has all the dev time secrets for you.

8. Application launch

   ```sh
   npm start
   ```

   Attention! If it doesn't boot install:

   ```sh
   npm install -g nodemon
   ```

9. Attention! Follow the [Frontend repo](https://github.com/haagahelia/siba-fe) installation guide as well

### How to run nodejs backend using docker-compose

1. Follow installation steps from 1 to 5

2. Run this command to launch application

   ```sh
   docker-compose -f docker-compose-be.yaml up -d
   ```

### How to dockerize the local MariaDB database

1. Edit the .env file to set your desired database name, root password, secondary user/password combination, and the host machine DB port

2. Run this command to launch application:

   ```sh
   docker-compose -f docker-compose-db.yaml up -d
   ```

3. Alternatively run from command prompt:

   ```sh
   docker run --detach --name mariadock --env MARIADB_USER=alternate_user --env MARIADB_PASSWORD=alternate_user_psw --env MARIADB_ROOT_PASSWORD=root_psw  mariadb:latest
   ```

4. Access the container terminal:

   ```sh
   docker exec -it mariadock bash
   ```

5. Access the DB directly using mysql terminal command:

   ```sh
   mysql -u root -p
   ```

6. Continue the configuration of the local DB as described in the step by step guide located in Database/Documentation/local_mariadb_windows_installation.md

7. Reset the database data if needed by removing the created Docker volume:

   ```sh
   docker volume rm db_project_mariadb_volume
   ```

   Remove the container and restart it. Note! If the command doesn't work, check the right volume name from the Docker compose script or list all volumes with the following command:

   ```sh
   docker volume ls
   ```

   You can also check volumes with Docker Desktop.

### How to run mariadb database and nodejs backend using docker-compose

Configuration of the local DB is described in the guide located in Database/Documentation/local_mariadb_windows_installation.md. The docker-compose file covered the process and make the application ready to use.

1. Follow installation steps from 1 to 5

2. Edit the docker-compose-dbbe.yaml file to have the right configuration according to your environment (database, username, password, root password)

3. Run this command to launch database and backend

   ```sh
   docker-compose -f docker-compose-dbbe.yaml up -d
   ```
  
4. Some useful commands:

   Access mariadb container terminal:

   ```sh
   docker exec -it mariadock sh
   ```

   Access mariadb container terminal:

   ```sh
   docker exec -it siba_be_dock sh
   ```

   Exit terminal inside container:

   ```sh
   exit
   ```

<p align="right">(<a href="#top">back to the top</a>)</p>

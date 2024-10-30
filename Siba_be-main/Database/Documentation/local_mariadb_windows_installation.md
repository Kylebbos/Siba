# Setting Up a Local MariaDB Installation and Linking with Siba Backend

These instructions will guide you through the process of setting up a local MariaDB database and linking it to your Siba backend application.

## MariaDB Installation

1. **Download MariaDB**:
   - Visit [MariaDB Download Page](https://mariadb.org/download/?t=mariadb&p=mariadb&r=10.10.6&os=windows&cpu=x86_64&pkg=msi&m=xtom_tal).
   - Download MariaDB for your Windows; tested versions 10.10.x and 10.6.x.

2. **Install MariaDB**:
   - Install MariaDB with default settings.
   - Remember to save your credentials (username and password) for later use. Note: It's not recommended to keep the root user without a password.

3. **Environment Variable Setup (Windows)**:
   - Windows requires setting environment variables to use MariaDB commands from any location. Follow the procedure outlined in the [MariaDB Windows Environment Variable Setup Guide](https://en.wiki.bluespice.com/wiki/Setup:Installation_Guide/System_Preparation/Windows/MariaDB) for details. Alternatively, skip to step 4.

4. **Starting MariaDB**:
   - You can launch the command prompt from the 'bin' folder in  MariaDB installation path.
   - Start MariaDB with the command: `mysql -u "username" -p`. Replace `"username"` with your chosen username. You will be prompted to enter the password afterwards.

## Database Setup

5. **Create a Local Database**:
   - Run the following SQL command to create a local database:
     ```sql
     CREATE DATABASE db_name;
     ```
     The name of the remote database can be reused .

6. **User and Privileges**:
   - For security, create a new user and grant permissions only to the database used for the Siba project:
     ```sql
     CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
     GRANT ALL PRIVILEGES ON db_name.* TO 'username'@'localhost' IDENTIFIED BY 'password';
     ```
     Note: In the tested versions, the `IDENTIFIED BY 'password'` part is not required.
     Username, and password can be the the same as the ones provided for the remote connection in order to speed up step 10.

7. **Access the Local Database**:
   - Use the following command to access the local database:
     ```sql
     USE db_name;
     ```

8. **Database Population**:
   - Run the provided SQL script to create tables and populate data:
     ```sql
     SOURCE full/path/to/sql/000__CreateALLdb.sql;
     ```

9. **Alternative Database Management**:
   - Optionally, use a tool like DBeaver to manage the database. Create a new connection with the following parameters:
     - Driver: mysql/mariadb
     - Host/Computer: localhost
     - Port: 3306
     - DB User: username
     - Password: password
     - Database: db_name

     Username, password, and database name are the ones provided in steps 5 and 6.
     The creation script can be also run from the GUI that DBeaver provides.

## Siba Backend Configuration

10. **Create an `.env` file**:
    - In the Siba_be folder, create an `.env` file and populate it with the following configurations:

    ```plaintext
    BE_API_URL_PREFIX=/api
    BE_SERVER_PORT=1234
    DB_DRIVER_MODULE=mysql
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=username
    DB_PASSWORD=password
    DB_DATABASE=db_name
    DB_DEBUG=true
    DB_MULTIPLE_STATEMENTS=true
    DB_CONNECTION_POOL_MIN=1
    DB_CONNECTION_POOL_MAX=7
    SECRET_TOKEN=key
    ```
    If the same username, password, database name are used for both local and remote connections, the change from one to another, only the port will be required to change: 3306 for local and 3308 for remote.

11. **Running the Backend**:
    - Open a command prompt or Git Bash within the Siba_be folder and start the backend with:
      ```
      npm start
      ```

12. **Testing the Backend**:
    - To quickly test the backend and local database link, try accessing:
      [http://localhost:1234/api/subject/getAll](http://localhost:1234/api/subject/getAll)

# Setting up a local MariaDB installation on Linux

1. **Install MariaDB through the package manager**:
   - Open a terminal and type
   ``` sudo apt-get install mariadb-server ```
   - If you're using a different Linux distribution, replace 'apt-get' with the appropriate package manager for your system (like 'yum' for CentOS or 'dnf' for Fedora).

2. **Check the status and start the MariaDB service**:
   - To check the status of the MariaDB service, you can run:
    ``` sudo systemctl status mariadb ```
    - Press CTRL + C or STRG + C to exit the view once you have confirmed that the service is active, inactive, or stopped.
    - If the service is not active, you can start it using the following command:
    ` sudo systemctl start mariadb `

3. **Secure MariaDB (Optional but recommended)**:
   - To secure your MariaDB installation, run the following command and follow the prompts:
    ``` sudo mysql_secure_installation ```
   - This will set a root password, remove anonymous users, disallow remote root login, and remove test databases.
   - When asked for the password of root hit enter.
   - When asked to switch to unix_socket_authentication type 'n'.
   - Next you will be asked to change the password of root. You should type 'y' and enter a secure password.
   - When asked to remove anonymous users type 'y'
   - When asked to disallow remote root login type 'y'
   - When asked to remove the test database type 'y'
   - When asked to reload privilege tables type 'y' to finish and save the changes.

4. **Access MariaDB**:
   - Access the MariaDB command line client by running:
    `mysql -u root -p`
   - You will be prompted to enter the root password you set during installation or the one generated during the secure installation step.

## Database Setup

5. **Creating the Local Database and user access**:
   - Once logged in with root, create the database with:
     ```sql
     CREATE DATABASE casedb;
     ```

6. **User and Privileges**:
   - Create a new user and grant permissions to the database:
     ```sql
     CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
     GRANT ALL PRIVILEGES ON casedb.* TO 'username'@'localhost' IDENTIFIED BY 'password';
     ```
   - Replace 'username' and 'password' with your desired username and password.
   - Type 'exit' and press Enter to exit the MariaDB command line client with root access.

7. **Access the Local Database**:
   - Log into the newly created user using: (Replace username with the new user)
    `mysql -u username -p`
   - Select the casedb database by running the following command:
     ```sql
     USE casedb;
     ```

8. **Populate the Database**:
   - Locate and execute the `SQL script 000__CreateALLdb.sql` that can be found in the Siba_be directory.
     ```sql
     SOURCE /home/username/Siba_be/Database/SQL_Scripts/000__CreateALLdb.sql;
     ```
   - Replace `username` with your linux username that is used to log into your operating system.
   - If you do not know the directory of Siba_be when you pulled it from Github then follow the directory by using `cd folder_name`. Once you arrived in the folder `SQL_Scripts` type `pwd` to get the folder path.
   - After the SQL script has executed successfully, you can exit the MariaDB command-line client by typing:
     ```sql
     EXIT;
     ```

## Backend Configuration

10. **Create the `.env` file**:
    - In the Siba_be folder, create an `.env` file and populate it with the following configurations:

         ```
         BE_API_URL_PREFIX=/api
         BE_SERVER_PORT=1234
         DB_DRIVER_MODULE=mysql
         DB_HOST=localhost
         DB_PORT=3306
         DB_USER=username
         DB_PASSWORD=password
         DB_DATABASE=casedb
         DB_DEBUG=true
         DB_MULTIPLE_STATEMENTS=true
         DB_CONNECTION_POOL_MIN=1
         DB_CONNECTION_POOL_MAX=7
         SECRET_TOKEN=key
         ```

    - Replace username and password with the previously created user for casedb
    - Replace key with a secure key
    - If the same username, password, and database name are used for both local and remote connections then changing from one to the other only requires for the port to change to: `3306` (local) or `3308` (remote).

11. **Start the Backend**:
    - Make sure you have Node.js dependencies installed by running `npm install` while you are within the Siba_be directory
    - To start the backend type `npm start`

12. **Test the Backend**:
    - You can test the running backend by accessing the following URL in your web browser:
      [http://localhost:1234/api/subject/getAll](http://localhost:1234/api/subject/getAll)
    - If everything is set up correctly, you should see the expected response from your backend.

## Troubleshooting

- If you experience errors read the error codes carefully. You can try the following options if the error codes indicate so:

   **Install Node Version Manager (nvm) to change the Node version to 14 or higher:**

   - If you don't already have nvm (Node Version Manager) installed, you can use it to manage multiple Node.js versions on your system.
   - To install nvm, run the following command in the terminal:
    `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash`
   - After installing nvm, you should close and reopen your terminal or run
   `source ~/.bashrc` to load nvm
   - Now that you have nvm installed, you can use it to install Node.js version 16.x. with
    `nvm install 16`

- Additionally, you may have to install packages manually within the Siba_be directory. Try the following commands one by one and test the result:
    `npm i --save-dev @types/node`
    `npm install tsc-watch --save-dev`
    `npm install typescript --save-dev`
- Should there be no effect uninstall the previously installed package to avoid clutter.

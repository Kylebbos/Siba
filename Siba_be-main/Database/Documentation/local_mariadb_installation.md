## Local MariaDB installation and making Siba backend to use it instead of CSC cloud.
==================================================================================

1. Download MariaDB from: <https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.1.2&os=windows&cpu=x86_64&pkg=msi&m=xtom_tal>

1. Install it with default settings.

1. Select username, password and write them down. (Default user is root)

1. Open MySQL Client (MariaDB) from Windows start menu.

1. Enter the password you selected.

1. Create database using command: CREATE DATABASE casedb; (CREATE SCHEMA casedb;)

1. Use database using command: USE casedb;

1. Locate your sql script under your repo folder structure.

1. Use following command in MariaDB/SQL client: SOURCE C:/gitrepos/siba/Siba_be/Database/SQL_Scripts/000__CreateALLdb.sql;

1. Open Siba_be folder with Visual Studio Code.

1. Create .env file.

1. Copy the lines mentioned in the main README to the .env file:

1. Change DB_USER and DB_PASSWORD to the ones you selected.

1. Open Git Bash in Siba_be folder.

1. Run following command in Git Bash: npm start

1. Test that backend is working with following link: <http://localhost:1234/api/subject/getAll>

## Local MariaDB installation on macOS using Homebrew and making Siba backend to use it instead of CSC cloud.
==================================================================================

1. Install Homebrew if you do not have it installed. The command to install Homebrew
`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"´
The command should be run in the Terminal. Also, for clear instructions on how to install, visit the Homebrew homepage at https://brew.sh/

1. Install MariaDB. For installing MariaDB, run the command in Terminal
`brew install mariadb`

1. After installing MariaDB, run in Terminal the command
`brew services start mariadb`
The command starts MariaDB running.

1. Run in Terminal the command
`mysql -u root -p`
The command lets you into MariaDB.

1. Run in Terminal the command
`ALTER USER 'root'@'localhost' IDENTIFIED BY 'newrootpassword';`
Replace `'newrootpassword'`with you password.
The command lets you set or change the root password for MariaDB.

1. Install DBeaver Community from their official website: https://dbeaver.io/download/

1. After installing DBeaver, run it and choose Create New Connection. It will ask you to select a new database connection. Choose MariaDB. (It might ask you to install MariaDB drivers; click install.)
Ensure that serverhost is 'localhost' and port is '3306'. The username should be 'root, and the password should be the same as what you created.

1. After creating the connection, click 'Database' and create a new database, 'casedb.

1. Next, copy SQL scripts from
https://github.com/haagahelia/Siba_be/blob/main/Database/SQL_Scripts/000__CreateALLdb.sql
and paste them to execute SQL scripts. Shortcut to execute: option + X

1. Go to the director Siba_be and create the .env file according to the main README.md instructions.

1. Change DB_USER and DB_PASSWORD to the ones you selected.

1. Open Terminal in the Siba_be folder and run the command

    `npm start`

1. Test that the backend is working with the following link: <http://localhost:1234/api/subject/getAll>

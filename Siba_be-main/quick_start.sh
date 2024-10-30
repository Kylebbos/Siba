#!/bin/bash

# check if mariadb service is running, if not, start it
# (make sure to support both mac and linux)
if [ "$(uname)" == "Darwin" ]; then
  if [ "$(pgrep mariadb)" == "" ]; then
    echo "mariadb is not running, starting it..."
    brew services start mariadb
  fi
elif [ "$(uname)" == "Linux" ]; then
  if [ "$(pgrep mariadb)" == "" ]; then
    echo "mariadb is not running, starting it..."
    sudo service mysql start
  fi
fi

# check if mariadb has schema "casedb", drop it if it does
if [ "$(sudo mysql -u root -e "show databases" | grep casedb)" != "" ]; then
  echo "casedb already exists, dropping it..."
  sudo mysql -u root -e "drop database casedb"
fi

echo "creating database casedb"
sudo mysql -u root -e "create database casedb"

# source ./Database/SQL_Scripts/000_CreateAlldb.sql
# as sudo from the folder this is run from
echo "creating tables..."
sudo mysql -u root casedb < Database/SQL_Scripts/000__CreateALLdb.sql


# ask for the username and password and create mariadb user
# with the same name and password and grant it all permissions
echo "creating mariadb user..."
read -p "username for mariadb user: " username
read -p "password for mariadb user: " password
# check that user is not already in the database. If it is, skip next commands
if [ "$(sudo mysql -u root -e "select user from mysql.user" | grep $username)" == "" ]; then
  echo "user does not exist, creating it..."
  sudo mysql -u root -e "CREATE USER '$username'@'localhost' IDENTIFIED BY '$password'"
  sudo mysql -u root -e "GRANT ALL PRIVILEGES ON casedb.* TO '$username'@'localhost'"
  sudo mysql -u root -e "FLUSH PRIVILEGES"
else
  # else grant all privileges to the user
  echo "user already exists, granting all privileges..."
  sudo mysql -u root -e "GRANT ALL PRIVILEGES ON casedb.* TO '$username'@'localhost'"
fi

# check if .env file exists, if so, delete it
if [ -f ".env" ]; then
  echo "old .env file exists, deleting it..."
  rm .env
fi

# create .env file with given values
echo "creating .env file..."
touch .env
echo "BE_API_URL_PREFIX=/api" >> .env
echo "BE_SERVER_PORT=1234" >> .env
echo "DB_DRIVER_MODULE=mysql" >> .env
echo "DB_HOST=localhost" >> .env
echo "DB_PORT=3306" >> .env
echo "DB_USER=$username" >> .env
echo "DB_PASSWORD=$password" >> .env
echo "DB_DATABASE=casedb" >> .env
echo "DB_DEBUG=true" >> .env
echo "DB_MULTIPLE_STATEMENTS=true" >> .env
echo "DB_CONNECTION_POOL_MIN=1" >> .env
echo "DB_CONNECTION_POOL_MAX=7" >> .env

# if npm is not installed, exit and ask the user to install npm
if [ "$(which npm)" == "" ]; then
  echo "npm is not installed, please install it and run this script again"
  exit
fi

# run npm install
echo "running npm install..."
npm install

# check if nodemon is installed globally, if not, install it
if [ "$(npm list -g | grep nodemon)" == "" ]; then
  echo "nodemon is not installed, installing it..."
  npm install -g nodemon
fi

# run nodemon
echo "running nodemon..."
nodemon

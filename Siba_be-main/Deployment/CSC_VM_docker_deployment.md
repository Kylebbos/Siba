# CSC cloud Ubuntu VM Siba deployment with Docker

Updated: 19.4.2024 (April 19 2024)

This documentation explains how to deploy the Siba project to the CSC cloud cPouta Ubuntu virtual machine using Docker and securing it with HTTPS. It is assumed that the user has the VM running and can connect to it with SSH. Some Linux understanding can also be helpful.

- VM OS: Ubuntu 22.04 LTS (64-bit)

Some parts of this documentation are based on this: https://github.com/haagahelia/ohke-teknologiat/blob/master/01_docker/fullstack_dockerized_task/Manual_Installation_commands.md

## Security Groups and firewall

CSC cloud Pouta security groups used:

![security_groups](./CSC_VM_security_groups_april2024_2.JPG)

- Port 22 is for SSH
- Port 80 is for the Nginx frontend HTTP
- Port 443 is for the Nginx frontend HTTPS
- Port 3000 is for the backend API reverse proxy

Pouta Security Groups are used to setup firewall rules in this deployment. Another option to manage firewall is to use ufw inside the Ubuntu VM.

Security Groups can be found by going to Project -> Network -> Security Groups

**NOTE**: Do not open unnecessary ports because it is a security risk! Only open ports that are needed.

More detailed information: https://docs.csc.fi/cloud/pouta/security/

## Update the system

```sh
sudo apt update && sudo apt upgrade -y
```

## Install Docker if not installed

Instructions used: https://docs.docker.com/engine/install/ubuntu/

Remove conflicting Docker packages
```sh
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt remove $pkg; done
```

Set up Docker's apt repository
```sh
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
```

Install the latest Docker packages including Docker Compose:
```sh
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Check the Docker version
```sh
sudo docker version
```

Check the Docker Compose version
```sh
sudo docker compose version
```

Check if the Docker daemon is running
```sh
sudo systemctl status docker
ps -ef | grep docker
```

Start it if it's not running
```sh
sudo systemctl start docker
```

This makes sure the Docker daemon starts automatically on system reboots
```sh
sudo systemctl enable docker
```

## Get the source code

Check if git is already installed
```sh
git --version
```

Install it if not installed
```sh
sudo apt update
sudo apt install git
```

This is a very simple way to install git. More detailed info here: https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-22-04

Create the directory for the source code
```sh
cd ~
mkdir siba
```

Clone the frontend and backend git repositories
```sh
cd siba
git clone https://github.com/haagahelia/Siba_be.git
git clone https://github.com/haagahelia/siba-fe.git
```

Pull the latests changes if needed
```sh
cd ~/siba/Siba_be
git pull
cd ~/siba/siba-fe
git pull
```

## Secure the deployment with HTTPS

This deployment uses a free SSL/TLS certificate obtained from Let's Encrypt. Let's Encrypt certificates require a domain name.

Certbot was used to manage Let's Encrypt certificates. https://github.com/certbot/certbot

There are many ways to install Certbot, one example below:
```sh
sudo apt-get remove certbot
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

There are also many ways to get a certificate with Certbot, but this deployment used this:
```sh
sudo certbot certonly -d <YOUR_DOMAIN_NAME>
```
Replace <YOUR_DOMAIN_NAME> with your server's domain name. For example: example.com

It is probably a good idea to follow the official documentations, because this may not work in all environments.

Read this documentation about CSC cloud Pouta DNS names: https://docs.csc.fi/cloud/pouta/additional-services/#dns-services-in-cpouta

Answer the questions it will ask you. After everything went OK, it should tell you where the certificate file is. The location should be something like this:

- certificate file: `/etc/letsencrypt/live/<YOUR_DOMAIN_NAME>/fullchain.pem`
- private key: `/etc/letsencrypt/live/<YOUR_DOMAIN_NAME>/privkey.pem`

<YOUR_DOMAIN_NAME> is the server's domain name that you used earlier. Check /etc/letsencrypt/live/ for all possible options. If you remove and generate several certificates for the same domain they may have some additions like `<YOUR_DOMAIN_NAME>-0001`.

# About reverse proxy

The backend uses Nginx as reverse proxy to do [SSL termination](https://docs.digitalocean.com/glossary/ssl-termination/). Basically it decrypts incoming encrypted traffic and then forwards the request to the backend container. The backend container then returns the response to the reverse proxy, which encrypts it and sends it back to the client. This process works in a private network inside the virtual machine. The reverse proxy needs to have the SSL certificate and private key so it can do this process.

You should read more about the topic if you want to know more as this documentation doesn't focus on it.
- https://en.wikipedia.org/wiki/TLS_termination_proxy

Reference for the implementation:
- https://gist.github.com/dahlsailrunner/679e6dec5fd769f30bce90447ae80081

## Deploy the database and backend with Docker

In order to prevent unnecessary environment variables from ending up in the containers, we want to create multiple environment variable files to be able to set only the environment variables that are needed in each container.

Create `.env`, `.env.db`, `.env.db.root` and `.env.be` files for environment variables and set permissions
```sh
cd ~/siba/Siba_be
touch .env
touch .env.db
touch .env.db.root
touch .env.be
sudo chmod 644 .env
sudo chmod 644 .env.db
sudo chmod 644 .env.db.root
sudo chmod 644 .env.be
```
The docker compose script that is used expects the file names above.

Add the following environment variables to the `.env.db` file
```sh
MARIADB_DATABASE=casedb
MARIADB_USER=<YOUR_DATABASE_USER>
MARIADB_PASSWORD=<YOUR_DATABASE_USER_PASSWORD>
```
Replace the values with your actual values. This is used both in the database and backend containers.

Add the following environment variable to the `.env.db.root` file
```sh
MARIADB_ROOT_PASSWORD=<YOUR_ROOT_PASSWORD>
```
Replace the value with your desired database root user password. This is used only in the database container.

Add the following environment variables to the `.env.be` file
```sh
BE_API_URL_PREFIX=/api
BE_SERVER_PORT=3001
DB_DRIVER_MODULE=mysql
DB_PORT=3306
DB_MULTIPLE_STATEMENTS=true
DB_CONNECTION_POOL_MIN=1
DB_CONNECTION_POOL_MAX=7
SECRET_TOKEN=<YOUR_SECRET_TOKEN>
TOKEN_EXPIRATION_SECONDS=3600
```
Replace the values with your actual values. This is used only in the backend container.

Add the following environment variables to the `.env` file
```sh
SSL_CERT_PATH=<PATH_TO_YOUR_CERTIFICATE>
SSL_KEY_PATH=<PATH_TO_YOUR_PRIVATE_KEY>
```
Replace the values with your actual values. `<PATH_TO_YOUR_CERTIFICATE>` is the file path to the SSL certificate file and `<PATH_TO_YOUR_PRIVATE_KEY>` is the file path to the SSL certificate private key file.

Start the database and backend containers
```sh
sudo docker compose -f ~/siba/Siba_be/docker-compose-dbbe-deploy.yaml up -d
```
With -d the container will be run in the background. This way you can keep using the same terminal to run other commands.

Check if the containers started
```sh
sudo docker ps
```

The backend API should now be accessible at `https://<VM_DOMAIN_NAME>:3000/api` where `<VM_DOMAIN_NAME>` is the public domain name of the virtual machine. The backend reverse proxy listens in port 3000 and that port is opened with firewall rules. The database is not exposed outside the VM, but can be exposed by opening port 3306. The backend container also isn't exposed because it is accessed through the reverse proxy to enable secure HTTPS connections.

To stop and remove the containers, run
```sh
sudo docker compose -f ~/siba/Siba_be/docker-compose-dbbe-deploy.yaml down
```

If you need to rebuild the backend image before starting containers, pass `--build` to the command
```sh
sudo docker compose -f ~/siba/Siba_be/docker-compose-dbbe-deploy.yaml up -d --build
```

## Deploy the frontend with Docker

Some parts are based on this: https://github.com/haagahelia/siba-fe?tab=readme-ov-file#beginning

Create the frontend .env file for environment variables and set permissions
```sh
cd ~/siba/siba-fe
touch .env
sudo chmod 644 .env
```

Add the following environment variables to the .env file
```sh
VITE_BE_SERVER_BASE_URL=https://<VM_DOMAIN_NAME>:3000/api
PORT=80
SSL_PORT=443
SSL_CERT_PATH=<PATH_TO_YOUR_CERTIFICATE>
SSL_KEY_PATH=<PATH_TO_YOUR_PRIVATE_KEY>
```
Replace the values with your actual values. `<VM_DOMAIN_NAME>` with the public domain name of the virtual machine. This is the backend API address the frontend will use to make ajax requests. `<PATH_TO_YOUR_CERTIFICATE>` is the file path to the SSL certificate file and `<PATH_TO_YOUR_PRIVATE_KEY>` is the file path to the SSL certificate private key file.

Run the frontend Docker container that uses Nginx web server to serve the React application
```sh
sudo docker compose -f ~/siba/siba-fe/docker-compose-fe-nginx.yaml up -d
```
With -d the container will be run in the background. This way you can keep using the same terminal to run other commands.

Check if the container started
```sh
sudo docker ps
```

The frontend should now be available at `https://<VM_DOMAIN_NAME>` where `<VM_DOMAIN_NAME>` is the public domain name of the virtual machine. `http://<VM_DOMAIN_NAME>` should redirect to `https://<VM_DOMAIN_NAME>`.

To stop and remove the container, run
```sh
sudo docker compose -f ~/siba/siba-fe/docker-compose-fe-nginx.yaml down
```

If you need to rebuild the frontend image before starting container, pass `--build` to the command
```sh
sudo docker compose -f ~/siba/siba-fe/docker-compose-fe-nginx.yaml up -d --build
```

## Upgrading the deployment

Make sure to do the steps above if deploying for the first time. After directories, .env files, etc. are setup, you can deploy the latest changes of the whole app by running only one script.

```sh
bash ~/siba/Siba_be/Deployment/scripts/deploy_whole_app.sh
```

There are also scripts to deploy only the backend or frontend changes.

To deploy only the backend changes:
```sh
bash ~/siba/Siba_be/Deployment/scripts/deploy_backend.sh
```

To deploy only the frontend changes:
```sh
bash ~/siba/Siba_be/Deployment/scripts/deploy_frontend.sh
```

The above scripts pull the latest changes from the git repositories, stop and remove running containers, and then rebuild the new images and start containers. New database changes are also applied by resetting the database.

## Removing Docker volumes

Sometimes removing the volume the Docker compose script creates is needed.

View volumes
```sh
sudo docker volume ls
```

Example of removing the volume
```sh
sudo docker volume rm siba_be_mariadb_data
```
Replace the volume name with the actual volume. WARNING: This will reset the data in the database!

## Other useful commands

Go inside a container to view the file system, environment variables etc.
```sh
sudo docker exec -it <container id or name> sh
```

View container logs. Useful for debugging.
```sh
sudo docker logs <container id or name>
```

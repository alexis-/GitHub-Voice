# GitHub Voice with nginx Setup Guide

This guide is for people who want to setup the GitHub Voice server and client to run on the same server, rather than running the server separately from the client.

This guide assumes you are running Ubuntu.

# Cloning

First, you will want to ssh into your server.

```ssh user@server```

Make sure you have installed ```git``` and then clone the GitHub Voice repo into the ```/srv``` directory.

```
cd /srv
git clone https://github.com/alexis-/GitHub-Voice/
```

# Configuration

Next we are going to create the config file for the project.

```cd``` into the config directory and copy the default config to a new file called ```local.json5```.

```
cd ./GitHub-Voice/config
cp default.json5 local.json5
```

## Creating a GitHub App

Before proceeding, you will need to create a new GitHub App. 

Login to GitHub and go to the Settings page.

Select Developer settings.

Select OAuth Apps.

Press New OAuth App.

Enter the details for your application.

For the authorization callback URL, you will want to copy the Homepage URL and append "/api/auth"

Eg. If your Homepage URL was ```https://feedback.site.com```, then the Authorization callback URL would be ```https://feedback.site.com/api/auth```


Finally you should generate a new client secret.

Keep this page open while you complete the rest of the setup so you can easily access this information.

## Common

Open the ```local.json5``` file in your favorite text editor.

In the ```common``` block, you will want to:

1) Change the ```apiUrl``` to the same as the GitHub App Authorization callback URL.
2) Change the ```webUrl``` to the same as the GitHub App Homepage URL.

## Server

In the ```server``` block, you will want to:

1) Set ```serveStaticFiles``` to ```false```.
2) Set ```cors``` to '*' (a single quote, followed by a star, followed by a singlequote).
3) Choose your own sessionsSecret. Perhaps a quote from your favorite book.
4) Set  ```gitHubClientId``` to your GitHub App client ID.
5) Set ```gitHubClientIdSecret``` to your GitHub App client secret.

## Client

In the ```client``` block, you will want to:

1) Set ```title``` to whatever you want to name your site.
2) Set each of the social links to your various social media sites.

## Repositories

Here you can decide which repositories' issues will show up in GitHub voice.

```repositories``` is an array of dictionaries.

The format of the value corresponding to the ```orgAndRepo``` key is ```<GitHub user name OR organization name>/<repository name>```

The value of the ```displayName``` key gives the human-readable name of the repository that will be shown to the user.


TODO: repositoryGroups

# Installation

Now we need to install node and npm. We are going to install version 12.

```
curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Change directory out of the config directory, back into the project root and run ```npm install```.

```
cd ..
npm install
```

Create the data folder:

```
mkdir data
```

Create a new user called ghvoice:

```useradd ghvoice```

While in the project root, run the following command to recursively transfer ownership of the GitHub Voice files to to ghvoice user:

```
chown -R ghvoice:ghvoice .
```

Next we can build the client and server by running the following code, which first logs us in as the ghvoice user and runs the build commands:

```
su ghvoice
npm run build:client
npm run build:server
```

# Nginx

## Installation

Start by installing, enabling and starting nginx:

```
sudo apt install nginx
systemctl enable nginx
systemctl start nginx
```

## Configuration

Change directory into the nginx configuration directory:

```
cd /etc/nginx/conf.d
```
Paste the following into a file called ...

TODO: Create the config

## Certbot

We need to setup HTTPS certificates.

Download certbot:

```
sudo snap install certbot
```

certbot --nginx -d url

TODO: Renew the certificate using a cron job

# System Service

Finally we are going to setup a system service to run GitHub voice.

Paste the following into ```/etc/systemd/system/ghvoice.service```

```
[Unit]
Description=GitHub Voice
After=network.target

[Service]
Environment=NODE_ENV=production
Type=simple
User=ghvoice
WorkingDirectory=/srv/GitHub-Voice
ExecStart=/usr/bin/node /srv/GitHub-Voice/dist/server/server/server.js >> /tmp/sm-user-voice-err.log
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Run the follwing commands to enable and start the service:

```
systemctl enable ghvoice
systemctl start ghvoice
```

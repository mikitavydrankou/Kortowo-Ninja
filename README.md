# Kortowo Ninja

Student exchange platform for dormitory residents at University of Warmia and Mazury (UWM). 

## Production deployment steps (with certificates, https and cookies)

1. You should have server 
2. Install docker on it

(I used this on Ubuntu - https://docs.docker.com/engine/install/ubuntu/)

3. Clone project 
```
git clone https://github.com/yourusername/kortowo-ninja.git
cd kortowo-ninja
```

4. Create and fill .env from .env.example

```
cp .env.example .env
nano .env
```

5. Build project
```
docker-compose up -d --build 
```

6. Warning! It will work only if you have domain - kortowo.ninja :). If you want use it for yourself, change Traefik and Nginx settings for your domain

## Local development environment steps

1. If you want try it locally, you should have installed Docker on you  machine

2. Create and fill .env from .env.example

```
cp .env.example .env
nano .env
```

3. Build project
```
docker compose -f compose.dev.yml up -d --build
```

4. That's all! Go to localhost:5173

---

Built for UWM Kortowo community

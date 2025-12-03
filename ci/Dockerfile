# Reusable CI image with Playwright, Node 20 and MySQL Server
FROM mcr.microsoft.com/playwright:v1.45.0-jammy

USER root

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends ca-certificates curl gnupg; \
    install -d -m 0755 /etc/apt/keyrings; \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --batch --yes --dearmor -o /etc/apt/keyrings/nodesource.gpg; \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends nodejs mysql-server; \
    npm install -g npm@latest; \
    rm -rf /var/lib/apt/lists/*

COPY ci/init-mysql.sh /usr/local/bin/init-mysql.sh
RUN chmod +x /usr/local/bin/init-mysql.sh

WORKDIR /workspace

import { GenericContainer, Wait } from 'testcontainers';

let container;

export const startContainer = async () => {
    process.env.TESTCONTAINERS_RYUK_DISABLED = 'true';

    container = await new GenericContainer('mysql:8.0')
        .withEnvironment({
            MYSQL_ROOT_PASSWORD: 'test_root_password',
            MYSQL_DATABASE: 'kortowo_test',
            MYSQL_USER: 'test_user',
            MYSQL_PASSWORD: 'test_password'
        })
        .withTmpFs({ '/var/lib/mysql': 'rw' })
        .withExposedPorts(3306)
        .withWaitStrategy(Wait.forListeningPorts())
        .withStartupTimeout(120000)
        .start();

    process.env.DB_HOST = container.getHost();
    process.env.DB_PORT = container.getMappedPort(3306);
    process.env.DB_USER = 'test_user';
    process.env.DB_PASSWORD = 'test_password';
    process.env.DB_NAME = 'kortowo_test';
    process.env.DB_DIALECT = 'mysql';
    process.env.JWT_SECRET = 'test-jwt-secret-for-integration-tests';

    const mysql = await import('mysql2/promise');
    let connected = false;
    let attempts = 0;
    const maxAttempts = 60;

    while (!connected && attempts < maxAttempts) {
        try {
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });
            await connection.end();
            connected = true;
        } catch (error) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    if (!connected) {
        await container.stop();
        throw new Error('Failed to connect to MySQL container after 60 seconds!');
    }

    return container;
};

export const stopContainer = async () => {
    if (container) {
        await container.stop();
    }
};

module.exports = {
    apps: [
        {
            name: 'listui',
            watch: true,
            exec_mode: 'cluster',
            instances: '1',
            script: './.output/server/index.mjs',
            env: {
                NODE_ENV: 'development',
                PORT: 3007,
                NITRO_PORT: 3007
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3007,
                NITRO_PORT: 3007
            }
        }
    ]
}

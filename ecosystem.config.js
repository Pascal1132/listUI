module.exports = {
    apps : [{
        name: 'listui',
        script: './.output/server/index.mjs',
        watch: true,
        exec_mode: 'cluster',
        instances: '1',
        port: 3007,
        env: {
            NODE_ENV: 'development',
        },
        env_production: {
            NODE_ENV: 'production',
        }
    },
]};
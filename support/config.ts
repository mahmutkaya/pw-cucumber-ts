Object.assign(global, {
    BROWSER: process.env.BROWSER || 'chromium',
    BASE_URL: process.env.BASE_URL || 'https://google.com',
    BASE_ENV: process.env.BASE_ENV || 'develop',
    CUCUMBER_TIMEOUT: 60000,
});

<template>
    <slot />
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

:root {
    --primary-color: #294c8e;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --info-color: #17a2b8;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
    --light-color: #f8f9fa;
    --dark-color: #343a40;

    --bg-primary-color: #272727;
    --bg-secondary-color: #4f4f4f;
    --text-color: #fff;
    --text-secondary-color: #d7d7d7;
    --text-on-primary-color: #ffffff;
    --text-highlight-color: #17a2b8;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out, width 0.3s ease-in-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-5%);
}
body {
    font-family: 'Poppins', sans-serif;
    background-color: var(--bg-primary-color);
    color: var(--text-color);
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

* {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

html,
body {
    height: 100%;
    width: 100%;
    display: block;
    padding: 0;
    margin: 0;
}

h3 {
    color: #f6f6f6;
    font-size: 1.1rem;
    background-image: linear-gradient(to left, var(--text-color), var(--text-highlight-color));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: animated-text 5s infinite alternate;
}
</style>
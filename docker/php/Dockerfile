FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    libzip-dev \
    zip \
    icu-dev \
    oniguruma-dev \
    linux-headers \
    curl \
    nodejs \
    npm

RUN docker-php-ext-install \
    pdo_mysql \
    zip \
    intl \
    mbstring \
    bcmath \
    opcache

RUN apk add --no-cache $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis

COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

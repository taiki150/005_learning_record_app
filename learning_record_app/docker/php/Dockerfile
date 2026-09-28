FROM php:8.4-fpm-alpine

# ホストのUID/GIDを受け取る（デフォルト: Mac の UID 501, GID 20）
ARG USER_ID=501
ARG GROUP_ID=20

# 既存のGIDがすでに存在する場合はそのまま利用し、ユーザーを作成して所属させる
RUN if getent group ${GROUP_ID}; then \
        GROUP_NAME=$(getent group ${GROUP_ID} | cut -d: -f1); \
        adduser -u ${USER_ID} -S appuser -G ${GROUP_NAME}; \
    else \
        addgroup -g ${GROUP_ID} -S appgroup && \
        adduser -u ${USER_ID} -S appuser -G appgroup; \
    fi

# ディレクトリ構造の作成と権限設定
RUN mkdir -p /var/www/html/storage/logs /var/www/html/storage/app /var/www/html/bootstrap/cache && \
    mkdir -p /var/www/html/storage/framework/cache && \
    mkdir -p /var/www/html/storage/framework/sessions && \
    mkdir -p /var/www/html/storage/framework/views && \
    chown -R ${USER_ID}:${GROUP_ID} /var/www/html/storage /var/www/html/bootstrap && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap

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

# PHP-FPM をこのユーザーで実行
USER appuser

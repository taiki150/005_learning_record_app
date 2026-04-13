# Docker で Laravel を動かす手順


## 何が必要か

| 必要なもの | 説明 |
|------------|------|
| **Docker Desktop** | 必須です。これがあれば PHP・Nginx・データベースはすべてコンテナ内で動かせます |

---

## 0. Docker Desktop のインストール（まだの場合）

1. [Docker の公式サイト](https://www.docker.com/products/docker-desktop/) から Docker Desktop をダウンロード
2. インストールして起動
3. 画面上で Docker が起動かを確認

ターミナルで次のコマンドが動けば準備完了です。

```bash
docker --version
docker compose version
```

---

## 1. .env の設定

プロジェクト直下の `.env` を開き、次の部分を以下の値に変更してください。

```
DB_HOST=mariadb
DB_PORT=3306
DB_PASSWORD=secret
APP_URL=http://localhost:8080
```

---

## 2. Docker で起動

ターミナルを開き下記実行

```bash
docker compose up -d
```

---

## 3. 初回セットアップ（1 回だけ）

起動後、次のコマンドを順番に実行します。

```bash
# 依存パッケージのインストール
docker compose exec php composer install

# データベースのテーブル作成
docker compose exec php php artisan migrate

#DBへUser情報を登録する
docker compose exec php php artisan db:seed --class=UserTableSeeder
```

---

## 4. ブラウザでアクセス

ブラウザで次の URL を開きます。

**http://localhost:8080**

Laravel の画面が表示されれば成功です。

---

## 5. 停止するとき

```bash
docker compose down
```

---

## トラブルシュート

### コマンドが動かない

- Docker Desktop が起動しているか確認してください
- ターミナルのカレントディレクトリが、この README があるプロジェクト直下か確認してください

### 画面が表示されない

- `.env` の `DB_HOST` が `mariadb` になっているか確認してください
- `docker compose up -d` のあと、1〜2 分待ってから再度アクセスしてみてください
- `docker compose ps` で、各コンテナが起動しているか確認できます

Goal: Integrate this legacy PHP app into a fresh Laravel project (so you can use `php artisan serve`).

Summary steps (commands to run from a shell with Composer installed):

1) Create a new Laravel project inside the workspace (recommended name `bsms-laravel`):

# Composer (Linux/macOS/Windows WSL)
composer create-project laravel/laravel bsms-laravel

# Or using Composer PHAR on Windows PowerShell
php composer.phar create-project laravel/laravel bsms-laravel

2) Move / copy legacy app files into the Laravel project
- Copy static assets (css/, js/, images/, Font-Awesome-master/, DataTables/, select2/) into `bsms-laravel/public/`.
- Copy `database/bsms_db.sql` into `bsms-laravel/database/` (or keep in legacy folder).
- Create a folder `bsms-laravel/resources/views/legacy/` and copy your legacy PHP pages (index.php, login.php, sales.php, etc.) there. For pages with PHP logic that depends on DB, move only HTML portions to blade, or keep full PHP as "legacy" views for now.

3) Create a simple controller to serve legacy pages (example):

// app/Http/Controllers/LegacyController.php
<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
class LegacyController extends Controller
{
    public function page($page = 'index')
    {
        // Load the corresponding legacy view (blade or raw php)
        $path = resource_path("views/legacy/{$page}.php");
        if(file_exists($path)){
            // If your legacy files expect to run raw PHP, include them
            return response()->file($path);
        }
        return abort(404);
    }
}

Note: Using `response()->file()` returns the file as-is — better approach is to convert critical pages into Blade templates or use a small adapter.

4) Add a route to `routes/web.php` to forward requests to the legacy controller:

Route::get('/legacy/{page?}', [App\Http\Controllers\LegacyController::class, 'page']);

Visit: http://127.0.0.1:8000/legacy/login.php (or map routes accordingly).

5) Configure DB and import SQL
- In `bsms-laravel/.env` set DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD.
- Import the SQL dump into your MySQL/MariaDB instance:

# Example (Windows PowerShell with MySQL on PATH)
mysql -u root -p < "bsms-laravel/database/bsms_db.sql"

6) Make legacy DB connection compatible
- Laravel uses Eloquent and PDO. To keep legacy code working with mysqli, either:
  a) Refactor legacy code to use Laravel DB/Eloquent (recommended long-term).
  b) Keep legacy PHP files and update their DB connection to read credentials from Laravel `.env` via `getenv('DB_USERNAME')` etc.

Example for legacy `DBConnection.php` change (read from env):
$host = getenv('DB_HOST') ?: '127.0.0.1';
$user = getenv('DB_USERNAME') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: '';
$db   = getenv('DB_DATABASE') ?: 'bsms_db';
$this->db = new mysqli($host, $user, $pass, $db);

7) Run the Laravel server
cd bsms-laravel
php artisan serve
Visit: http://127.0.0.1:8000/legacy/login.php (or your mapped routes)

Notes, trade-offs and next steps
- Quick adapter (above) lets you boot Laravel and still serve legacy PHP files, but it's fragile and not idiomatic.
- Best approach: gradually port pages into Blade + Controllers, use Laravel DB access, and create migrations for schema.
- I can scaffold the `LegacyController`, route snippet, and example `.env` mapping for you — but I cannot run Composer in this environment. If you want, I will:
  1) Create the scaffold files and migration notes here.
  2) Or run Composer commands on your machine if you allow me to run them (I can't run them remotely without Composer installed here).

Tell me which option you want: scaffold files + instructions (I will create the files), or step-by-step commands only so you can run Composer locally.
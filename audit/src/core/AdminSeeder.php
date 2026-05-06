<?php

class AdminSeeder
{
    public function __construct(private PDO $pdo)
    {
    }

    public function run(): void
    {
        $stmt = $this->pdo->prepare('SELECT id FROM user WHERE username = :username');
        $stmt->execute([':username' => Constants::adminUsername()]);
        if ($stmt->fetch()) return;

        $this->pdo->prepare(
            "INSERT INTO user (username, email, password_hash, role)
             VALUES (:username, :email, :hash, 'ADMIN')"
        )->execute([
            ':username' => Constants::adminUsername(),
            ':email' => Constants::adminEmail(),
            ':hash' => password_hash(Constants::adminPassword(), PASSWORD_BCRYPT),
        ]);
    }
}

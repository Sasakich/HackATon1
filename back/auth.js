const myPassport = require('passport');
const passportGithub = require('passport-github');

const githubStrategy = new passportGithub.Strategy(
    {
        clientID: "2897c730c31dd10adb98",
        clientSecret: "5e58f80274b20bc1fe8cf264011d230290c4c72e",
        callbackURL: 'http://localhost:3001/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        // В этом месте можно сохранить пользователя в свою базу
        // или найти уже существующего в базе по данным из `profile`
        //
        // User.findOrCreate(profile.username, (err, profile) => {
        //     done(err, profile);
        // });

        // Чтобы завершить процесс аутентификации необходимо вызвать `done`
        // и передать туда профиль пользователя – исходный или дополненный из базы
        done(null, profile)

        // Чтобы отменить аутентификацию отправляем false
        // done(null, false)
    }
);

// Подключаем созданную стратегию
myPassport.use(githubStrategy);

// Определяем функцию для сохранения данных пользователя в сессию
myPassport.serializeUser((profile, done) => {
    // Мы можем сохранить целиком
    done(null, profile);
});

// Определяем функцию для получения данных пользователя из сессии
myPassport.deserializeUser((profile, done) => {
    // Мы сохранили целиком, поэтому данные уже готовы
    done(null, profile);

    // Если бы мы сохранили только id пользователя,
    // то понадобилось бы в начале сходить в базу:
    //
    // User.findById(id, (err, profile) => {
    //     done(err, profile);
    // });
});

module.exports = { myPassport };
const myPassport = require('passport');
const passportGithub = require('passport-github');



const githubStrategy = new passportGithub.Strategy(
    {
        clientID: "2897c730c31dd10adb98",
        clientSecret: "5e58f80274b20bc1fe8cf264011d230290c4c72e",
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        // В этом месте можно сохранить пользователя в свою базу
        // или найти уже существующего в базе по данным из `profile`
        //
        // User.findOrCreate(profile.username, (err, profile) => {
        //     done(err, profile);
        // });
        const username = profile.username;
        const userId = profile.id;
        const avatarUrl = profile.photos[0].value;

        find(username, userId, avatarUrl)
            .then(response => {
                if (response.status !== 200) {
                    return creat(username, userId, avatarUrl);
                } else {
                    return response.json(); // Assuming the response contains user data
                }
            })
            .then(user => {
                console.log(user);
                done(null, profile);
            })
            .catch(err => {
                console.error('Error in find or creat:', err);
                done(err, null);
            });
        //  console.log(profile)
        //console.log(typeof profile.username , typeof profile.id, typeof profile.photos[0].value);


        // Чтобы завершить процесс аутентификации необходимо вызвать `done`
        // и передать туда профиль пользователя – исходный или дополненный из базы
        //done(null, profile)

        // Чтобы отменить аутентификацию отправляем false
        // done(null, false)

    }
);
console.log(githubStrategy)
const creat = async function (user, password, avatar) {
    console.log("asd");
    await fetch('http://localhost:3000/createUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: user, password: password, icon: avatar })
    });
};


const find = async function (user, password, avatar) {
    const res = await fetch(
        `http://localhost:3000/getUser?login=${user}&password=${password}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return res;
}

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
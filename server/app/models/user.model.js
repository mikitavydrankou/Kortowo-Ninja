

const userModel = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Nickname nie może być pusty",
                },
                len: {
                    args: [3, 25],
                    msg: "Nickname musi mieć od 3 do 25 znaków",
                },
                is: {
                    args: /^[a-zA-Z0-9_]+$/i,
                    msg: "Nickname może zawierać tylko litery, cyfry i podkreślenia",
                },
            },
        },
        // password: {
        //     type: Sequelize.STRING,
        //     validate: {
        //         notEmpty: {
        //             msg: "Hasło nie może być puste",
        //         },
        //         len: {
        //             args: [8, 100],
        //             msg: "Hasło musi mieć co najmniej 8 znaków",
        //         },
        //         isStrongEnough(value) {
        //             const strongPasswordPattern =
        //                 /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
        //             if (!strongPasswordPattern.test(value)) {
        //                 throw new Error(
        //                     "Hasło musi zawierać co najmniej jedną cyfrę"
        //                 );
        //             }
        //         },
        //     },
        // },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Hasło nie może być puste",
                },
                len: {
                    args: [8, 100],
                    msg: "Hasło musi mieć co najmniej 8 znaków",
                },
                isStrongEnough(value) {
                    const strongPasswordPattern =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
                    if (!strongPasswordPattern.test(value)) {
                        throw new Error(
                            "Hasło musi zawierać co najmniej jedną małą i wielką literę, cyfrę oraz znak specjalny"
                        );
                    }
                },
            },
        },

        link: {
            type: Sequelize.STRING,
            unique: {
                name: "unique_facebook_link",
                msg: "Ten link Facebook jest już zajęty!",
            },
            validate: {
                isFacebookUrl(value) {
                    const facebookPattern =
                        /^(https?:\/\/)?(www\.|m\.)?(facebook|fb)\.com\/[\S]+$/i;

                    if (!facebookPattern.test(value)) {
                        throw new Error(
                            "Link Facebook musi być poprawnym adresem URL"
                        );
                    }
                },
                len: {
                    args: [0, 500],
                    msg: "Link Facebook nie może być dłuższy niż 500 znaków",
                },
            },
        },
    });

    return User;
};

export default userModel;

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          console.log('Tentative de connexion pour:', email);
          
          const user = await User.findOne({ where: { email: email } });

          if (!user) {
            console.log('Utilisateur non trouvé');
            return done(null, false, { message: "Cet email n'est pas enregistré" });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          console.log('Résultat de la comparaison du mot de passe:', isMatch);
          
          if (isMatch) {
            return done(null, user);
          }
            return done(null, false, { message: "Mot de passe incorrect" });
        } catch (err) {
          console.error('Erreur lors de l\'authentification:', err);
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

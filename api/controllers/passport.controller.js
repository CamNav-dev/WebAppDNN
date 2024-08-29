import passport from 'passport';

app.use(passport.initialize());
app.use(passport.session()); // If using sessions

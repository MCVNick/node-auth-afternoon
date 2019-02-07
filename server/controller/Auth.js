const bcrypt = require('bcryptjs')

module.exports = {
    login: async (req, res) => {
        const db = req.app.get('db')
        const { username, password } = req.body

        const foundUser = await db.get_user(username)
        const user = foundUser[0]
        
        if(!user) {
            return res.status(401).send('User not found. Please register as a new user before logging in.')
        }

        const isAuthenticated = bcrypt.compareSync(password, user.hash)

        if(!isAuthenticated) {
            return res.status(403).send('Incorrect password')
        }

        req.session.user = { isAdmin: user.isAdmin, id: user.id, username: user.username }
        console.log(req.session.user)
        res.send(req.session.user)
    },
    register: async (req, res) => {
        const db = req.app.get('db')
        const { username, password } = req.body
        console.log(req.body.isAdmin)

        const existingUser = await db.check_existing_user(username)

        if(existingUser[0]) {
            res.status(409).send('Username taken')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const createdUser = await db.register_user([req.body.isAdmin, username, hash])
        const user = createdUser[0]

        req.session.user = { isAdmin: req.body.isAdmin, id: user.id, username: user.username}
        console.log(req.session.user)
        res.send(req.session.user)
    },
    logout: async (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}